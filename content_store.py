"""SQLite persistence and private local uploads for admin-managed content."""

import json
import io
import math
import mimetypes
import os
import secrets
import sqlite3
from contextlib import contextmanager
from pathlib import Path


RESOURCE_TABLES = {"courses", "exams", "questions", "products"}


class ContentStore:
    def __init__(self, database_path, upload_directory=None, product_catalog_path=None):
        self.database_path = os.path.abspath(database_path)
        self.product_catalog_path = Path(
            product_catalog_path or Path(__file__).with_name("store_products.json")
        )
        self.upload_directory = Path(
            upload_directory or Path(self.database_path).parent / "uploads"
        ).resolve()
        self.upload_directory.mkdir(parents=True, exist_ok=True)
        self._initialize()

    @contextmanager
    def _connect(self):
        connection = sqlite3.connect(self.database_path, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    def _initialize(self):
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS managed_content (
                    collection TEXT NOT NULL,
                    id TEXT NOT NULL,
                    category TEXT NOT NULL,
                    data_json TEXT NOT NULL,
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (collection, id)
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS file_assets (
                    id TEXT PRIMARY KEY,
                    stored_name TEXT NOT NULL UNIQUE,
                    original_name TEXT NOT NULL,
                    content_type TEXT NOT NULL,
                    category TEXT NOT NULL,
                    purpose TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS site_settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS exam_attempts (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    exam_id TEXT NOT NULL,
                    category TEXT NOT NULL,
                    status TEXT NOT NULL,
                    cq_pdf_asset_id TEXT,
                    data_json TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS payment_orders (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    transaction_id TEXT NOT NULL UNIQUE,
                    status TEXT NOT NULL,
                    data_json TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS shared_ai_question_solutions (
                    category TEXT NOT NULL,
                    question_id TEXT NOT NULL,
                    solution TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (category, question_id)
                )
                """
            )
            legacy_cache_exists = connection.execute(
                """
                SELECT 1 FROM sqlite_master
                WHERE type = 'table' AND name = 'ai_question_solutions'
                """
            ).fetchone()
            if legacy_cache_exists:
                connection.execute(
                    """
                    INSERT OR IGNORE INTO shared_ai_question_solutions
                        (category, question_id, solution)
                    SELECT content.category, saved.question_id, saved.solution
                    FROM ai_question_solutions AS saved
                    JOIN managed_content AS content
                        ON content.collection = 'questions'
                        AND content.id = saved.question_id
                    """
                )
            if self.product_catalog_path.is_file():
                try:
                    with self.product_catalog_path.open(encoding="utf-8") as catalog:
                        products = json.load(catalog)
                except (OSError, json.JSONDecodeError) as exc:
                    raise ValueError("store_products.json পাওয়া বা পড়া যায়নি।") from exc
                if not isinstance(products, list):
                    raise ValueError("store_products.json-এ product list থাকতে হবে।")
                for product in products:
                    self._validate_product(product)
                    connection.execute(
                        """
                        INSERT OR IGNORE INTO managed_content
                            (collection, id, category, data_json)
                        VALUES ('products', ?, ?, ?)
                        """,
                        (
                            product["id"],
                            product["category"],
                            json.dumps(
                                product, ensure_ascii=False, separators=(",", ":")
                            ),
                        ),
                    )

    def get_setting(self, key):
        with self._connect() as connection:
            row = connection.execute(
                "SELECT value FROM site_settings WHERE key = ?", (key,)
            ).fetchone()
        return row["value"] if row else None

    def set_setting(self, key, value):
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO site_settings (key, value) VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
                """,
                (key, value),
            )

    @staticmethod
    def _decode(row):
        return json.loads(row["data_json"])

    def list_resources(self, collection, category=None):
        if collection not in RESOURCE_TABLES:
            raise ValueError("Unknown resource collection")
        with self._connect() as connection:
            if category:
                rows = connection.execute(
                    "SELECT data_json FROM managed_content WHERE collection = ? AND category = ? ORDER BY updated_at DESC",
                    (collection, category),
                ).fetchall()
            else:
                rows = connection.execute(
                    "SELECT data_json FROM managed_content WHERE collection = ? ORDER BY updated_at DESC",
                    (collection,),
                ).fetchall()
        return [self._decode(row) for row in rows]

    def save_resource(self, collection, data):
        if collection not in RESOURCE_TABLES:
            raise ValueError("Unknown resource collection")
        if not isinstance(data, dict):
            raise ValueError("Resource must be an object")
        if collection == "products":
            self._validate_product(data)
        resource_id = data.get("id")
        category = data.get("category")
        if (
            not isinstance(resource_id, str)
            or not resource_id
            or len(resource_id) > 120
            or (
                category not in {"SSC", "HSC", "JOB"}
                if collection != "products"
                else not isinstance(category, str)
                or not category.strip()
                or len(category) > 80
            )
        ):
            raise ValueError("Resource ID and category are required")
        encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
        if len(encoded.encode("utf-8")) > 2_000_000:
            raise ValueError("Resource is too large")
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO managed_content (collection, id, category, data_json)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(collection, id) DO UPDATE SET
                    category = excluded.category,
                    data_json = excluded.data_json,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (collection, resource_id, category, encoded),
            )
        return data

    @staticmethod
    def _validate_product(product):
        if not isinstance(product, dict):
            raise ValueError("Product must be an object")
        if (
            not isinstance(product.get("name"), str)
            or not product["name"].strip()
            or len(product["name"]) > 200
            or product.get("type") not in {"digital", "physical"}
            or not isinstance(product.get("educationTypes"), list)
            or not product["educationTypes"]
            or any(
                not isinstance(category, str)
                or category not in {"SSC", "HSC", "JOB"}
                for category in product["educationTypes"]
            )
        ):
            raise ValueError("পণ্যের নাম, ধরন এবং শিক্ষা বিভাগ সঠিকভাবে দিন।")
        if len(set(product["educationTypes"])) != len(product["educationTypes"]):
            raise ValueError("একই শিক্ষা বিভাগ একাধিকবার দেওয়া যাবে না।")
        try:
            price = float(product.get("price"))
        except (TypeError, ValueError) as exc:
            raise ValueError("পণ্যের মূল্য সঠিক নয়।") from exc
        if price <= 0 or not math.isfinite(price):
            raise ValueError("পণ্যের মূল্য শূন্যের বেশি হতে হবে।")
        if product["type"] == "digital" and (
            not isinstance(product.get("fileUrl"), str)
            or not product["fileUrl"].strip()
            or len(product["fileUrl"]) > 2000
        ):
            raise ValueError("ডিজিটাল পণ্যের PDF URL দিতে হবে।")
        for field in ("originalPrice", "stock"):
            if product.get(field) is None:
                continue
            try:
                value = float(product[field])
            except (TypeError, ValueError) as exc:
                raise ValueError("পণ্যের অতিরিক্ত মূল্য বা stock সঠিক নয়।") from exc
            if not math.isfinite(value) or value < 0:
                raise ValueError("পণ্যের অতিরিক্ত মূল্য বা stock ঋণাত্মক হতে পারবে না।")

    def delete_resource(self, collection, resource_id):
        if collection not in RESOURCE_TABLES:
            raise ValueError("Unknown resource collection")
        with self._connect() as connection:
            cursor = connection.execute(
                "DELETE FROM managed_content WHERE collection = ? AND id = ?",
                (collection, resource_id),
            )
        return cursor.rowcount > 0

    def register_asset(self, asset_id, stored_name, original_name, content_type, category, purpose):
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO file_assets
                    (id, stored_name, original_name, content_type, category, purpose)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (asset_id, stored_name, original_name, content_type, category, purpose),
            )

    def get_asset(self, asset_id):
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM file_assets WHERE id = ?", (asset_id,)
            ).fetchone()
        return dict(row) if row else None

    def save_exam_attempt(self, attempt):
        encoded = json.dumps(attempt, ensure_ascii=False, separators=(",", ":"))
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO exam_attempts
                    (id, user_id, exam_id, category, status, cq_pdf_asset_id, data_json)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    attempt["id"], attempt["userId"], attempt["examId"],
                    attempt["category"], attempt["cqStatus"],
                    attempt["cqPdfAssetId"], encoded,
                ),
            )
        return attempt

    def get_exam_attempt(self, attempt_id):
        with self._connect() as connection:
            row = connection.execute(
                "SELECT data_json FROM exam_attempts WHERE id = ?", (attempt_id,)
            ).fetchone()
        return json.loads(row["data_json"]) if row else None

    def list_exam_attempts(self, user_id=None):
        with self._connect() as connection:
            if user_id:
                rows = connection.execute(
                    "SELECT data_json FROM exam_attempts WHERE user_id = ? ORDER BY created_at DESC",
                    (user_id,),
                ).fetchall()
            else:
                rows = connection.execute(
                    "SELECT data_json FROM exam_attempts ORDER BY created_at DESC"
                ).fetchall()
        return [json.loads(row["data_json"]) for row in rows]

    def get_ai_question_solution(self, category, question_id):
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT solution FROM shared_ai_question_solutions
                WHERE category = ? AND question_id = ?
                """,
                (category, question_id),
            ).fetchone()
        return row["solution"] if row else None

    def save_ai_question_solution(self, category, question_id, solution):
        if (
            category not in {"SSC", "HSC", "JOB"}
            or not isinstance(question_id, str)
            or not question_id
            or not isinstance(solution, str)
            or not solution.strip()
        ):
            raise ValueError("AI question solution data is invalid")
        with self._connect() as connection:
            connection.execute(
                """
                INSERT OR IGNORE INTO shared_ai_question_solutions
                    (category, question_id, solution)
                VALUES (?, ?, ?)
                """,
                (category, question_id, solution),
            )
            row = connection.execute(
                """
                SELECT solution FROM shared_ai_question_solutions
                WHERE category = ? AND question_id = ?
                """,
                (category, question_id),
            ).fetchone()
        return row["solution"]

    def create_payment_order(self, order):
        encoded = json.dumps(order, ensure_ascii=False, separators=(",", ":"))
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO payment_orders
                    (id, user_id, transaction_id, status, data_json)
                VALUES (?, ?, ?, 'pending', ?)
                """,
                (
                    order["id"], order["userId"], order["transactionId"], encoded
                ),
            )
        return order

    def list_payment_orders(self, user_id=None):
        with self._connect() as connection:
            if user_id:
                rows = connection.execute(
                    "SELECT data_json FROM payment_orders WHERE user_id = ? "
                    "ORDER BY created_at DESC",
                    (user_id,),
                ).fetchall()
            else:
                rows = connection.execute(
                    "SELECT data_json FROM payment_orders ORDER BY created_at DESC"
                ).fetchall()
        return [json.loads(row["data_json"]) for row in rows]

    def review_payment_order(self, order_id, status):
        if status not in {"approved", "rejected"}:
            raise ValueError("অর্ডারের সিদ্ধান্ত সঠিক নয়।")
        with self._connect() as connection:
            row = connection.execute(
                "SELECT data_json, status FROM payment_orders WHERE id = ?",
                (order_id,),
            ).fetchone()
            if not row:
                raise LookupError("অর্ডারটি পাওয়া যায়নি।")
            if row["status"] != "pending":
                raise ValueError("এই অর্ডারটি আগে থেকেই যাচাই করা হয়েছে।")
            order = json.loads(row["data_json"])
            if status == "approved":
                user_row = connection.execute(
                    "SELECT profile_json FROM users WHERE id = ?",
                    (order["userId"],),
                ).fetchone()
                if not user_row:
                    raise LookupError("অর্ডারের শিক্ষার্থী অ্যাকাউন্ট পাওয়া যায়নি।")
                profile = json.loads(user_row["profile_json"] or "{}")
                enrolled = set(profile.get("enrolledCourses", []))
                unlocked = set(profile.get("unlockedProducts", []))
                enrolled.update(
                    item["id"] for item in order["items"]
                    if item.get("type") == "course"
                )
                unlocked.update(
                    item["id"] for item in order["items"]
                    if item.get("type") == "digital"
                )
                profile["enrolledCourses"] = sorted(enrolled)
                profile["unlockedProducts"] = sorted(unlocked)
                connection.execute(
                    "UPDATE users SET profile_json = ? WHERE id = ?",
                    (json.dumps(profile, ensure_ascii=False), order["userId"]),
                )
            order["status"] = status
            encoded = json.dumps(order, ensure_ascii=False, separators=(",", ":"))
            connection.execute(
                """
                UPDATE payment_orders
                SET status = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (status, encoded, order_id),
            )
        return order

    def update_exam_attempt(self, attempt):
        encoded = json.dumps(attempt, ensure_ascii=False, separators=(",", ":"))
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE exam_attempts
                SET status = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (attempt["cqStatus"], encoded, attempt["id"]),
            )
        return cursor.rowcount > 0

    def is_exam_pdf_owned_by(self, asset_id, user_id):
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT 1 FROM exam_attempts
                WHERE cq_pdf_asset_id = ? AND user_id = ?
                """,
                (asset_id, user_id),
            ).fetchone()
        return row is not None

    def store_upload(self, file_bytes, original_name, content_type, category, purpose):
        return self.store_upload_stream(
            io.BytesIO(file_bytes),
            len(file_bytes),
            original_name,
            content_type,
            category,
            purpose,
        )

    def store_upload_stream(
        self, source, file_size, original_name, content_type, category, purpose
    ):
        extension = Path(original_name).suffix.lower()
        allowed = {
            "video": {".mp4", ".webm", ".mov"},
            "questions-pdf": {".pdf"},
            "course-pdf": {".pdf"},
            "cq-answer-sheet": {".pdf"},
            "brand-logo": {".png", ".jpg", ".jpeg", ".webp"},
            "question-image": {".png", ".jpg", ".jpeg", ".webp"},
        }
        if purpose not in allowed or extension not in allowed[purpose]:
            raise ValueError("This file type is not supported")
        if file_size <= 0:
            raise ValueError("The uploaded file is empty")
        max_size = 5 * 1024 * 1024 * 1024 if purpose == "video" else 100 * 1024 * 1024
        if purpose == "cq-answer-sheet":
            max_size = 20 * 1024 * 1024
        if purpose == "brand-logo":
            max_size = 5 * 1024 * 1024
        if purpose == "question-image":
            max_size = 5 * 1024 * 1024
        if file_size > max_size:
            raise ValueError(
                "ভিডিও সর্বোচ্চ ৫ GB, উত্তরপত্র ২০ MB, লোগো ৫ MB এবং অন্যান্য PDF ১০০ MB হতে পারে।"
            )
        source.seek(0)
        file_header = source.read(16)
        source.seek(0)
        if purpose != "brand-logo" and category not in {"SSC", "HSC", "JOB"}:
            raise ValueError("A valid student category is required")
        if purpose == "brand-logo":
            if category != "GLOBAL":
                raise ValueError("Invalid logo category")
            valid_logo = (
                file_header.startswith(b"\x89PNG\r\n\x1a\n")
                if extension == ".png"
                else file_header.startswith(b"\xff\xd8\xff")
                if extension in {".jpg", ".jpeg"}
                else len(file_header) >= 12 and file_header[:4] == b"RIFF"
                and file_header[8:12] == b"WEBP"
            )
            if not valid_logo:
                raise ValueError("লোগোটি সঠিক PNG, JPEG বা WebP ফাইল নয়।")
        elif purpose == "question-image":
            valid_image = (
                file_header.startswith(b"\x89PNG\r\n\x1a\n")
                if extension == ".png"
                else file_header.startswith(b"\xff\xd8\xff")
                if extension in {".jpg", ".jpeg"}
                else len(file_header) >= 12 and file_header[:4] == b"RIFF"
                and file_header[8:12] == b"WEBP"
            )
            if not valid_image:
                raise ValueError("প্রশ্নের ছবিটি সঠিক PNG, JPEG বা WebP ফাইল নয়।")
        if purpose == "brand-logo" and file_size > 5 * 1024 * 1024:
            raise ValueError("লোগো ফাইলটি ৫ MB-এর মধ্যে হতে হবে।")
        if purpose == "cq-answer-sheet":
            if file_size > 20 * 1024 * 1024:
                raise ValueError("উত্তরপত্রের PDF ২০ MB-এর মধ্যে হতে হবে।")
            if not file_header.startswith(b"%PDF-"):
                raise ValueError("উত্তরপত্রের ফাইলটি সঠিক PDF নয়।")
        if purpose == "course-pdf" and not file_header.startswith(b"%PDF-"):
            raise ValueError("লেকচারের ফাইলটি সঠিক PDF নয়।")
        if purpose == "video":
            valid_video = (
                file_size >= 12
                and file_header[4:8] == b"ftyp"
                if extension in {".mp4", ".mov"}
                else file_header.startswith(b"\x1a\x45\xdf\xa3")
            )
            if not valid_video:
                raise ValueError("ভিডিও ফাইলটি সঠিক MP4/MOV বা WebM নয়।")

        asset_id = secrets.token_urlsafe(24)
        stored_name = f"{asset_id}{extension}"
        target = (self.upload_directory / stored_name).resolve()
        if target.parent != self.upload_directory:
            raise ValueError("Invalid upload destination")
        try:
            bytes_written = 0
            with target.open("xb") as uploaded:
                while chunk := source.read(1024 * 1024):
                    uploaded.write(chunk)
                    bytes_written += len(chunk)
            if bytes_written != file_size:
                raise ValueError("The uploaded file size did not match the request")
        except Exception:
            target.unlink(missing_ok=True)
            raise
        try:
            detected_type = mimetypes.guess_type(stored_name)[0] or "application/octet-stream"
            self.register_asset(
                asset_id, stored_name, Path(original_name).name,
                detected_type, category, purpose,
            )
        except Exception:
            target.unlink(missing_ok=True)
            raise
        return {
            "id": asset_id,
            "name": Path(original_name).name,
            "contentType": detected_type,
            "category": category,
            "purpose": purpose,
            "url": f"/api/media/{asset_id}",
        }, target
