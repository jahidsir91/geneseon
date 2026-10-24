"""SQLite-backed users and server-side sessions for Geneseon Academy."""

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import unicodedata
import uuid
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone

PASSWORD_ITERATIONS = 310_000
SESSION_TTL = timedelta(hours=12)
PASSWORD_RESET_TTL = timedelta(minutes=30)


def _utc_now():
    return datetime.now(timezone.utc)


def _hash_password(password, salt=None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS
    )
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt.hex()}${digest.hex()}"


def _verify_password(password, encoded):
    try:
        algorithm, iterations, salt_hex, digest_hex = encoded.split("$")
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, TypeError):
        return False


def normalize_mobile(mobile):
    digits = "".join(
        str(unicodedata.digit(char)) for char in mobile if char.isdigit()
    )
    if digits.startswith("00880") and len(digits) == 15:
        return "0" + digits[5:]
    if digits.startswith("880") and len(digits) == 13:
        return "0" + digits[3:]
    if len(digits) == 10 and digits.startswith("1"):
        return "0" + digits
    return digits or mobile.strip()


class AuthStore:
    def __init__(self, database_path):
        self.database_path = os.path.abspath(database_path)
        os.makedirs(os.path.dirname(self.database_path), exist_ok=True)
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
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                    mobile TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'ADMIN')),
                    education_type TEXT,
                    batch_or_target TEXT,
                    profile_json TEXT NOT NULL DEFAULT '{}',
                    status TEXT NOT NULL DEFAULT 'active',
                    admin_eligible INTEGER NOT NULL DEFAULT 0,
                    joined_at TEXT NOT NULL,
                    last_login_at TEXT
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    token_hash TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    expires_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
                CREATE TABLE IF NOT EXISTS password_reset_tokens (
                    token_hash TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    expires_at TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS password_reset_user_idx
                    ON password_reset_tokens(user_id);
                """
            )
            columns = {
                row["name"]
                for row in connection.execute("PRAGMA table_info(users)").fetchall()
            }
            if "profile_json" not in columns:
                connection.execute(
                    "ALTER TABLE users ADD COLUMN profile_json TEXT NOT NULL DEFAULT '{}'"
                )
            if "last_login_at" not in columns:
                connection.execute(
                    "ALTER TABLE users ADD COLUMN last_login_at TEXT"
                )
            if "admin_eligible" not in columns:
                connection.execute(
                    "ALTER TABLE users ADD COLUMN admin_eligible INTEGER NOT NULL DEFAULT 0"
                )
            connection.execute(
                "UPDATE users SET admin_eligible = 1 WHERE role = 'ADMIN'"
            )

    @staticmethod
    def public_user(row):
        user = {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "mobile": row["mobile"],
            "role": row["role"],
            "adminEligible": bool(row["admin_eligible"]),
            "educationType": row["education_type"],
            "batchOrTarget": row["batch_or_target"],
            "status": row["status"],
            "joinedAt": row["joined_at"],
            "lastLoginAt": row["last_login_at"],
            "avatar": (
                "https://api.dicebear.com/7.x/adventurer/svg?seed="
                + row["id"]
            ),
            "streak": 0,
            "enrolledCourses": [],
            "completedLessons": [],
            "unlockedProducts": [],
        }
        try:
            profile = json.loads(row["profile_json"] or "{}")
        except (KeyError, TypeError, json.JSONDecodeError):
            profile = {}
        for key in ("enrolledCourses", "completedLessons", "unlockedProducts"):
            if isinstance(profile.get(key), list):
                user[key] = profile[key]
        return user

    def create_user(self, name, email, mobile, password, education_type, batch):
        normalized_email = email.strip().lower()
        normalized_mobile = normalize_mobile(mobile)
        now = _utc_now().date().isoformat()
        user_id = "usr_" + uuid.uuid4().hex
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO users
                    (id, name, email, mobile, password_hash, role,
                     education_type, batch_or_target, joined_at)
                VALUES (?, ?, ?, ?, ?, 'STUDENT', ?, ?, ?)
                """,
                (
                    user_id,
                    name.strip(),
                    normalized_email,
                    normalized_mobile,
                    _hash_password(password),
                    education_type,
                    batch.strip(),
                    now,
                ),
            )
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
        return self.public_user(row)

    def create_admin(self, name, email, mobile, password):
        user_id = "usr_" + uuid.uuid4().hex
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO users
                    (id, name, email, mobile, password_hash, role,
                     batch_or_target, admin_eligible, joined_at)
                VALUES (?, ?, ?, ?, ?, 'ADMIN', 'Admin Portal', 1, ?)
                """,
                (
                    user_id,
                    name.strip(),
                    email.strip().lower(),
                    normalize_mobile(mobile),
                    _hash_password(password),
                    _utc_now().date().isoformat(),
                ),
            )
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
        return self.public_user(row)

    def authenticate(self, identifier, password):
        normalized = identifier.strip()
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM users WHERE email = ? COLLATE NOCASE",
                (normalized.lower(),),
            ).fetchone()
            if not row:
                row = connection.execute(
                    "SELECT * FROM users WHERE mobile = ?", (normalized,)
                ).fetchone()
            if not row:
                compact_mobile = (
                    "REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(mobile, ' ', ''), "
                    "'-', ''), '+', ''), '(', ''), ')', '')"
                )
                normalized_mobile = normalize_mobile(normalized)
                candidates = {normalized_mobile}
                if (
                    normalized_mobile.startswith("0")
                    and len(normalized_mobile) == 11
                ):
                    country_code_number = "880" + normalized_mobile[1:]
                    candidates.update(
                        (country_code_number, "00" + country_code_number)
                    )
                placeholders = ", ".join("?" for _ in candidates)
                row = connection.execute(
                    f"SELECT * FROM users WHERE {compact_mobile} IN ({placeholders})",
                    tuple(candidates),
                ).fetchone()
        if not row or row["status"] != "active":
            return None
        if not _verify_password(password, row["password_hash"]):
            return None
        return self.public_user(row)

    def record_login(self, user_id):
        with self._connect() as connection:
            connection.execute(
                "UPDATE users SET last_login_at = ? WHERE id = ?",
                (_utc_now().isoformat(), user_id),
            )
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
        return self.public_user(row) if row else None

    def reset_student_password(self, user_id, password):
        if (
            not isinstance(password, str)
            or len(password) < 6
            or len(password.encode("utf-8")) > 1024
        ):
            raise ValueError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।")
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
            if not row:
                raise LookupError("অ্যাকাউন্টটি পাওয়া যায়নি।")
            if row["role"] != "STUDENT":
                raise ValueError("শুধু শিক্ষার্থী অ্যাকাউন্টের পাসওয়ার্ড রিসেট করা যাবে।")
            connection.execute(
                "UPDATE users SET password_hash = ? WHERE id = ?",
                (_hash_password(password), user_id),
            )
            connection.execute(
                "DELETE FROM sessions WHERE user_id = ?", (user_id,)
            )
        return self.public_user(row)

    def create_password_reset(self, email, token):
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        now = _utc_now()
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            row = connection.execute(
                """
                SELECT * FROM users
                WHERE email = ? COLLATE NOCASE AND role = 'STUDENT' AND status = 'active'
                """,
                (email.strip(),),
            ).fetchone()
            if not row:
                return None
            connection.execute(
                "DELETE FROM password_reset_tokens WHERE user_id = ?",
                (row["id"],),
            )
            connection.execute(
                """
                INSERT INTO password_reset_tokens
                    (token_hash, user_id, expires_at, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (
                    token_hash,
                    row["id"],
                    (now + PASSWORD_RESET_TTL).isoformat(),
                    now.isoformat(),
                ),
            )
        return self.public_user(row)

    def discard_password_reset(self, token):
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with self._connect() as connection:
            connection.execute(
                "DELETE FROM password_reset_tokens WHERE token_hash = ?",
                (token_hash,),
            )

    def complete_password_reset(self, token, password):
        if (
            not isinstance(password, str)
            or len(password) < 6
            or len(password.encode("utf-8")) > 1024
        ):
            raise ValueError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।")
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        now = _utc_now()
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            reset = connection.execute(
                """
                SELECT user_id FROM password_reset_tokens
                WHERE token_hash = ? AND expires_at > ?
                """,
                (token_hash, now.isoformat()),
            ).fetchone()
            if not reset:
                return False
            updated = connection.execute(
                """
                UPDATE users SET password_hash = ?
                WHERE id = ? AND role = 'STUDENT' AND status = 'active'
                """,
                (_hash_password(password), reset["user_id"]),
            )
            if updated.rowcount != 1:
                connection.execute(
                    "DELETE FROM password_reset_tokens WHERE user_id = ?",
                    (reset["user_id"],),
                )
                return False
            connection.execute(
                "DELETE FROM password_reset_tokens WHERE user_id = ?",
                (reset["user_id"],),
            )
            connection.execute(
                "DELETE FROM sessions WHERE user_id = ?", (reset["user_id"],)
            )
            updated_user = connection.execute(
                "SELECT * FROM users WHERE id = ?", (reset["user_id"],)
            ).fetchone()
        return self.public_user(updated_user) if updated_user else None

    def list_students(self):
        with self._connect() as connection:
            rows = connection.execute(
                "SELECT * FROM users WHERE role = 'STUDENT' ORDER BY joined_at DESC"
            ).fetchall()
        return [self.public_user(row) for row in rows]

    def list_users(self):
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT * FROM users
                ORDER BY CASE role WHEN 'ADMIN' THEN 0 ELSE 1 END, joined_at DESC
                """
            ).fetchall()
        return [self.public_user(row) for row in rows]

    def switch_own_role(
        self, user_id, role, education_type=None, batch_or_target=None, password=None
    ):
        if not isinstance(role, str) or role not in {"STUDENT", "ADMIN"}:
            raise ValueError("ভূমিকা STUDENT অথবা ADMIN হতে হবে।")
        if role == "STUDENT" and (
            not isinstance(education_type, str)
            or education_type not in {"SSC", "HSC", "JOB"}
            or not isinstance(batch_or_target, str)
            or not batch_or_target.strip()
            or len(batch_or_target.strip()) > 120
        ):
            raise ValueError("শিক্ষার্থী বিভাগ ও ব্যাচ/লক্ষ্য সঠিকভাবে দিন।")

        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
            if not row:
                raise LookupError("ইউজার অ্যাকাউন্টটি পাওয়া যায়নি।")
            if row["role"] == role:
                raise ValueError("ইউজারের এই ভূমিকাটি ইতোমধ্যে সেট করা আছে।")
            if not row["admin_eligible"]:
                raise PermissionError("শুধু পূর্বনির্ধারিত অ্যাডমিন অ্যাকাউন্ট এই মোড পরিবর্তন করতে পারবে।")
            if row["status"] != "active":
                raise PermissionError("নিষ্ক্রিয় অ্যাকাউন্টের ভূমিকা পরিবর্তন করা যাবে না।")
            if role == "ADMIN" and (
                not isinstance(password, str)
                or not _verify_password(password, row["password_hash"])
            ):
                raise PermissionError("অ্যাডমিন মোড চালু করতে সঠিক পাসওয়ার্ড দিন।")

            if role == "ADMIN":
                connection.execute(
                    """
                    UPDATE users
                    SET role = 'ADMIN', education_type = NULL,
                        batch_or_target = 'Admin Portal'
                    WHERE id = ?
                    """,
                    (user_id,),
                )
            else:
                connection.execute(
                    """
                    UPDATE users
                    SET role = 'STUDENT', education_type = ?,
                        batch_or_target = ?
                    WHERE id = ?
                    """,
                    (education_type, batch_or_target.strip(), user_id),
                )
            connection.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
            updated = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
        return self.public_user(updated)

    def create_session(self, user_id):
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode("ascii")).hexdigest()
        expires_at = (_utc_now() + SESSION_TTL).isoformat()
        with self._connect() as connection:
            connection.execute(
                "DELETE FROM sessions WHERE expires_at <= ?",
                (_utc_now().isoformat(),),
            )
            connection.execute(
                "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
                (token_hash, user_id, expires_at),
            )
        return token

    def get_session_user(self, token):
        if not token:
            return None
        token_hash = hashlib.sha256(token.encode("ascii")).hexdigest()
        now = _utc_now().isoformat()
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT users.* FROM sessions
                JOIN users ON users.id = sessions.user_id
                WHERE sessions.token_hash = ? AND sessions.expires_at > ?
                """,
                (token_hash, now),
            ).fetchone()
        if not row or row["status"] != "active":
            return None
        return self.public_user(row)

    def revoke_session(self, token):
        if not token:
            return
        token_hash = hashlib.sha256(token.encode("ascii")).hexdigest()
        with self._connect() as connection:
            connection.execute(
                "DELETE FROM sessions WHERE token_hash = ?", (token_hash,)
            )

    def update_user(self, user_id, changes):
        allowed = {
            "name": "name",
            "mobile": "mobile",
            "educationType": "education_type",
            "batchOrTarget": "batch_or_target",
        }
        updates = [(allowed[key], value) for key, value in changes.items() if key in allowed]
        profile_changes = {
            key: value
            for key, value in changes.items()
            if key in {"enrolledCourses", "completedLessons", "unlockedProducts"}
            and isinstance(value, list)
        }
        with self._connect() as connection:
            if updates:
                statement = ", ".join(f"{column} = ?" for column, _ in updates)
                values = [
                    value.strip() if isinstance(value, str) else value
                    for _, value in updates
                ]
                connection.execute(
                    f"UPDATE users SET {statement} WHERE id = ?",
                    (*values, user_id),
                )
            if profile_changes:
                row = connection.execute(
                    "SELECT profile_json FROM users WHERE id = ?", (user_id,)
                ).fetchone()
                if not row:
                    return None
                try:
                    profile = json.loads(row["profile_json"] or "{}")
                except json.JSONDecodeError:
                    profile = {}
                profile.update(profile_changes)
                connection.execute(
                    "UPDATE users SET profile_json = ? WHERE id = ?",
                    (json.dumps(profile), user_id),
                )
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
        return self.public_user(row) if row else None

    def get_user(self, user_id):
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM users WHERE id = ?", (user_id,)
            ).fetchone()
        return self.public_user(row) if row else None
