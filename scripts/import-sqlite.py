"""One-time, restart-safe import from the legacy SQLite database to Supabase."""

import hashlib
import http.client
import json
import os
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import Request, urlopen


def required(name):
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"Set {name} in this PowerShell session before importing.")
    return value


SUPABASE_URL = required("SUPABASE_URL").rstrip("/")
parsed_supabase_url = urlsplit(SUPABASE_URL)
if (
    parsed_supabase_url.scheme not in {"http", "https"}
    or not parsed_supabase_url.netloc
    or parsed_supabase_url.path
    or parsed_supabase_url.query
    or parsed_supabase_url.fragment
):
    raise RuntimeError(
        "SUPABASE_URL must be the project URL only (for example "
        "https://your-project-ref.supabase.co), without /dashboard/... "
        "or /rest/v1."
    )
SERVICE_KEY = required("SUPABASE_SERVICE_ROLE_KEY")
BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "academy-files")
DATABASE_PATH = Path(required("JA_DATABASE_PATH")).expanduser().resolve()
UPLOAD_DIRECTORY = Path(
    os.environ.get("JA_UPLOAD_DIRECTORY", str(DATABASE_PATH.parent / "uploads"))
).expanduser().resolve()

API_ROOT = SUPABASE_URL + "/rest/v1/"
STORAGE_ROOT = SUPABASE_URL + "/storage/v1/object/"
AUTH_HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
}


def request_json(method, url, payload=None, prefer=None):
    headers = dict(AUTH_HEADERS)
    if payload is not None:
        headers["Content-Type"] = "application/json"
    if prefer:
        headers["Prefer"] = prefer
    data = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8") if payload is not None else None
    request = Request(url, data=data, headers=headers, method=method)
    try:
        with urlopen(request, timeout=60) as response:
            raw = response.read()
            return json.loads(raw) if raw else None
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        endpoint = urlsplit(url)
        raise RuntimeError(
            f"Supabase REST request failed ({exc.code}) at "
            f"{endpoint.netloc}{endpoint.path}: {detail}"
        ) from exc
    except URLError as exc:
        raise RuntimeError(f"Supabase connection failed: {exc.reason}") from exc


def upsert(table, rows, conflict="id"):
    if not rows:
        return
    query = urlencode({"on_conflict": conflict})
    request_json(
        "POST",
        f"{API_ROOT}{table}?{query}",
        rows,
        "resolution=merge-duplicates,return=minimal",
    )


def table_exists(connection, name):
    return connection.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (name,)
    ).fetchone() is not None


def decode_json(value, fallback):
    try:
        return json.loads(value) if value else fallback
    except (TypeError, json.JSONDecodeError):
        return fallback


def is_unexpired(value):
    if not value:
        return False
    try:
        expiry = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (AttributeError, TypeError, ValueError):
        return False
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    return expiry > datetime.now(timezone.utc)


def upload_file(file_path, object_path, content_type):
    parsed = urlsplit(STORAGE_ROOT)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise RuntimeError("SUPABASE_URL must be an HTTP(S) URL.")
    connection_class = http.client.HTTPSConnection if parsed.scheme == "https" else http.client.HTTPConnection
    connection = connection_class(parsed.hostname, parsed.port, timeout=120)
    encoded_path = quote(f"{BUCKET}/{object_path}", safe="/")
    request_path = f"{parsed.path}{encoded_path}"
    size = file_path.stat().st_size
    try:
        connection.putrequest("POST", request_path)
        connection.putheader("apikey", SERVICE_KEY)
        connection.putheader("Authorization", f"Bearer {SERVICE_KEY}")
        connection.putheader("Content-Type", content_type)
        connection.putheader("Content-Length", str(size))
        connection.putheader("x-upsert", "true")
        connection.endheaders()
        with file_path.open("rb") as source:
            while True:
                chunk = source.read(1024 * 1024)
                if not chunk:
                    break
                connection.send(chunk)
        response = connection.getresponse()
        detail = response.read().decode("utf-8", "replace")
        if response.status not in {200, 201}:
            raise RuntimeError(
                f"Storage upload failed for {file_path.name} ({response.status}): {detail}"
            )
    finally:
        connection.close()


def migrate():
    if not DATABASE_PATH.is_file():
        raise RuntimeError(f"SQLite database does not exist: {DATABASE_PATH}")
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        migrate_users(connection)
        migrate_content(connection)
        migrate_assets(connection)
        migrate_orders(connection)
        migrate_attempts(connection)
        migrate_settings(connection)
        migrate_solutions(connection)
        migrate_sessions(connection)
        migrate_reset_tokens(connection)
    finally:
        connection.close()


def migrate_users(connection):
    if not table_exists(connection, "users"):
        raise RuntimeError("The source SQLite database has no users table.")
    rows = connection.execute("SELECT * FROM users").fetchall()
    result = []
    for row in rows:
        profile = decode_json(row["profile_json"], {})
        result.append({
            "id": row["id"],
            "email": row["email"].strip().lower(),
            "password_hash": row["password_hash"],
            "name": row["name"],
            "mobile": row["mobile"],
            "role": row["role"],
            "education_type": row["education_type"],
            "batch_or_target": row["batch_or_target"],
            "status": row["status"],
            "admin_eligible": bool(row["admin_eligible"]),
            "profile": profile if isinstance(profile, dict) else {},
            "joined_at": row["joined_at"],
            "last_login_at": row["last_login_at"],
        })
    upsert("users", result)
    print(f"Imported {len(result)} users (password hashes preserved).")


def migrate_content(connection):
    if not table_exists(connection, "managed_content"):
        print("No managed_content table; skipping content.")
        return
    rows = connection.execute(
        "SELECT collection, id, category, data_json, updated_at FROM managed_content"
    ).fetchall()
    for row in rows:
        data = decode_json(row["data_json"], {})
        if not isinstance(data, dict):
            raise RuntimeError(f"Invalid JSON in content item {row['id']}.")
        upsert("content_resources", [{
            "id": row["id"],
            "category": row["category"],
            "resource_type": row["collection"],
            "title": str(data.get("title") or data.get("name") or ""),
            "description": str(data.get("description") or ""),
            "content": data,
            "sort_order": 0,
            "is_published": True,
            "updated_at": row["updated_at"],
        }])
    print(f"Imported {len(rows)} content resources.")


def migrate_assets(connection):
    if not table_exists(connection, "file_assets"):
        print("No file_assets table; skipping stored files.")
        return
    rows = connection.execute("SELECT * FROM file_assets").fetchall()
    for row in rows:
        source = (UPLOAD_DIRECTORY / row["stored_name"]).resolve()
        if source.parent != UPLOAD_DIRECTORY or not source.is_file():
            raise RuntimeError(f"Missing or invalid uploaded file: {row['stored_name']}")
        object_path = f"{row['purpose']}/{row['category']}/{row['stored_name']}"
        upload_file(source, object_path, row["content_type"])
        upsert("assets", [{
            "id": row["id"],
            "storage_path": object_path,
            "original_name": row["original_name"],
            "content_type": row["content_type"],
            "category": row["category"],
            "purpose": row["purpose"],
            "size_bytes": source.stat().st_size,
        }])
    print(f"Uploaded and imported {len(rows)} files.")


def migrate_orders(connection):
    if not table_exists(connection, "payment_orders"):
        print("No payment_orders table; skipping payment orders.")
        return
    rows = connection.execute("SELECT * FROM payment_orders").fetchall()
    for row in rows:
        order = decode_json(row["data_json"], {})
        upsert("orders", [{
            "id": row["id"],
            "user_id": row["user_id"],
            "course_id": None,
            "amount": float(order.get("totalAmount") or 0),
            "status": row["status"],
            "payment_method": order.get("paymentGateway", ""),
            "transaction_id": row["transaction_id"],
            "order_data": order,
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }])
    print(f"Imported {len(rows)} payment orders.")


def migrate_attempts(connection):
    if not table_exists(connection, "exam_attempts"):
        print("No exam_attempts table; skipping exam attempts.")
        return
    rows = connection.execute("SELECT * FROM exam_attempts").fetchall()
    for row in rows:
        attempt = decode_json(row["data_json"], {})
        upsert("exam_attempts", [{
            "id": row["id"],
            "user_id": row["user_id"],
            "exam_id": row["exam_id"],
            "category": row["category"],
            "answers": attempt.get("answers", {}),
            "result": attempt,
            "answer_sheet_asset_id": row["cq_pdf_asset_id"],
            "status": row["status"],
            "data": attempt,
            "submitted_at": attempt.get("submittedAt") or row["created_at"],
            "created_at": row["created_at"],
        }])
    print(f"Imported {len(rows)} exam attempts.")


def migrate_settings(connection):
    if table_exists(connection, "site_settings"):
        rows = connection.execute("SELECT key, value FROM site_settings").fetchall()
        for row in rows:
            value = row["value"]
            if row["key"] == "brand_logo_id":
                value = {"brand_logo_id": value}
            else:
                parsed = decode_json(value, value)
                value = parsed
            upsert("site_settings", [{"key": row["key"], "value": value}], conflict="key")
    config_path = Path(__file__).resolve().parent.parent / "payment_config.json"
    if config_path.is_file():
        with config_path.open(encoding="utf-8") as source:
            config = json.load(source)
        upsert("site_settings", [{
            "key": "payment_config",
            "value": {
                "bkashNumber": config.get("bkash_number", ""),
                "coupons": config.get("coupons", {}),
            },
        }], conflict="key")
    print("Imported site settings.")


def migrate_solutions(connection):
    if not table_exists(connection, "shared_ai_question_solutions"):
        print("No shared AI solutions; skipping solution cache.")
        return
    rows = connection.execute(
        "SELECT category, question_id, solution FROM shared_ai_question_solutions"
    ).fetchall()
    question_lookup = {}
    if table_exists(connection, "managed_content"):
        for row in connection.execute(
            "SELECT id, data_json FROM managed_content WHERE collection='questions'"
        ).fetchall():
            question_lookup[row["id"]] = decode_json(row["data_json"], {})
    for row in rows:
        question_id = row["question_id"]
        question = question_lookup.get(question_id, {"id": question_id})
        upsert("ai_question_solutions", [{
            "category": row["category"],
            "question_hash": hashlib.sha256(question_id.encode("utf-8")).hexdigest(),
            "question": json.dumps(question, ensure_ascii=False),
            "solution": row["solution"],
        }], conflict="category,question_hash")
    print(f"Imported {len(rows)} shared AI solutions.")


def migrate_sessions(connection):
    if not table_exists(connection, "sessions"):
        print("No active sessions to import.")
        return
    rows = connection.execute(
        "SELECT token_hash, user_id, expires_at FROM sessions"
    ).fetchall()
    active_rows = [{
        "token_hash": row["token_hash"],
        "user_id": row["user_id"],
        "expires_at": row["expires_at"],
    } for row in rows if is_unexpired(row["expires_at"])]
    upsert("sessions", active_rows, conflict="token_hash")
    print(f"Imported {len(active_rows)} active session records.")


def migrate_reset_tokens(connection):
    if not table_exists(connection, "password_reset_tokens"):
        print("No password-reset tokens to import.")
        return
    rows = connection.execute(
        "SELECT token_hash, user_id, expires_at, created_at FROM password_reset_tokens"
    ).fetchall()
    pending_rows = [{
        "token_hash": row["token_hash"],
        "user_id": row["user_id"],
        "expires_at": row["expires_at"],
        "created_at": row["created_at"],
    } for row in rows if is_unexpired(row["expires_at"])]
    upsert("password_reset_tokens", pending_rows, conflict="token_hash")
    print(f"Imported {len(pending_rows)} pending password-reset records.")


if __name__ == "__main__":
    try:
        migrate()
    except (OSError, sqlite3.Error, ValueError, RuntimeError, HTTPError, URLError) as error:
        print(f"Import stopped: {error}", file=sys.stderr)
        sys.exit(1)
    print("SQLite import finished. Source database and uploads were not modified.")
