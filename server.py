"""Geneseon Academy static server and same-origin authentication API."""

import argparse
import http.cookies
import http.server
import logging
import mimetypes
import json
import math
import os
import re
import secrets
import socketserver
import sqlite3
import tempfile
import threading
import time
from datetime import datetime
from email.parser import BytesParser
from email.policy import default
from getpass import getpass
from pathlib import Path
from urllib.parse import unquote, urlsplit

from auth_store import AuthStore, SESSION_TTL, normalize_mobile
from content_store import ContentStore, RESOURCE_TABLES
from email_service import EmailDeliveryError, ResendEmailService
from pdf_questions import (
    GeminiRateLimitError,
    extract_questions,
    generate_study_assistant_response,
    generate_question_solution,
)

PORT = int(os.environ.get("JA_PORT", "8000"))
DIRECTORY = Path(__file__).resolve().parent
DATABASE_PATH = os.environ.get(
    "JA_DATABASE_PATH",
    str(Path.home() / ".jaacademy" / "ja_academy.sqlite3"),
)
SESSION_COOKIE = "ja_session"
SECURE_COOKIES = os.environ.get("JA_SECURE_COOKIES", "").lower() in {
    "1",
    "true",
    "yes",
}
AUTH_STORE = AuthStore(DATABASE_PATH)
CONTENT_STORE = ContentStore(DATABASE_PATH)
EMAIL_SERVICE = ResendEmailService()
LOGGER = logging.getLogger(__name__)
SITE_NAME = "Geneseon Academy"


class PaymentConfigError(ValueError):
    """Invalid payment settings in the editable payment configuration file."""


def load_payment_config(config_path):
    try:
        with open(config_path, encoding="utf-8") as config_file:
            config = json.load(config_file)
    except (OSError, json.JSONDecodeError) as exc:
        raise PaymentConfigError(
            "payment_config.json পাওয়া বা পড়া যায়নি।"
        ) from exc
    if not isinstance(config, dict):
        raise PaymentConfigError("payment_config.json-এর format সঠিক নয়।")

    number = config.get("bkash_number", "")
    if not isinstance(number, str):
        raise PaymentConfigError("bkash_number একটি string হতে হবে।")
    number = number.strip()
    if number and not re.fullmatch(r"01[3-9]\d{8}", number):
        raise PaymentConfigError("bkash_number-এ সঠিক ১১ ডিজিটের নম্বর দিন।")

    configured_coupons = config.get("coupons", {})
    if not isinstance(configured_coupons, dict):
        raise PaymentConfigError("coupons একটি object হতে হবে।")
    coupons = {}
    for code, coupon in configured_coupons.items():
        if (
            not isinstance(code, str)
            or not re.fullmatch(r"[A-Za-z0-9_-]{2,40}", code)
            or not isinstance(coupon, dict)
        ):
            raise PaymentConfigError("payment_config.json-এ coupon entry সঠিক নয়।")
        clean_code = code.upper()
        if clean_code in coupons:
            raise PaymentConfigError("একই coupon code একাধিকবার দেওয়া হয়েছে।")
        percent = coupon.get("discountPercent")
        amount = coupon.get("discountAmount")
        maximum = coupon.get("maxDiscount")
        if (
            (percent is None) == (amount is None)
            or isinstance(percent, bool)
            or (percent is not None and (
                not isinstance(percent, (int, float))
                or not math.isfinite(percent)
                or not 0 < percent <= 100
            ))
            or isinstance(amount, bool)
            or (amount is not None and (
                not isinstance(amount, (int, float))
                or not math.isfinite(amount)
                or amount <= 0
            ))
            or isinstance(maximum, bool)
            or (maximum is not None and (
                not isinstance(maximum, (int, float))
                or not math.isfinite(maximum)
                or maximum <= 0
            ))
            or (percent is None and maximum is not None)
        ):
            raise PaymentConfigError(f"{code} coupon-এর ছাড়ের তথ্য সঠিক নয়।")
        expiry = coupon.get("expiry")
        if expiry is not None:
            if not isinstance(expiry, str):
                raise PaymentConfigError(f"{code} coupon-এর expiry date সঠিক নয়।")
            try:
                datetime.strptime(expiry, "%Y-%m-%d")
            except ValueError as exc:
                raise PaymentConfigError(
                    f"{code} coupon-এর expiry date YYYY-MM-DD format-এ দিন।"
                ) from exc
        coupons[clean_code] = {
            **({"discountPercent": percent} if percent is not None else {}),
            **({"discountAmount": amount} if amount is not None else {}),
            **({"maxDiscount": maximum} if maximum is not None else {}),
            **({"expiry": expiry} if expiry is not None else {}),
        }
    return {"bkashNumber": number, "coupons": coupons}


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        "": "application/octet-stream",
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".ico": "image/x-icon",
        ".pdf": "application/pdf",
        ".mp4": "video/mp4",
    }
    auth_store = AUTH_STORE
    content_store = CONTENT_STORE
    email_service = EMAIL_SERVICE
    secure_cookies = SECURE_COOKIES
    payment_config_path = os.environ.get(
        "JA_PAYMENT_CONFIG_FILE", str(DIRECTORY / "payment_config.json")
    )
    login_attempts = {}
    registration_attempts = {}
    password_reset_attempts = {}
    attempts_lock = threading.Lock()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        super().end_headers()

    def _send_json(self, status, payload, extra_headers=()):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        for name, value in extra_headers:
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        if self.headers.get_content_type() != "application/json":
            raise ValueError("JSON অনুরোধ প্রয়োজন।")
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError as exc:
            raise ValueError("অনুরোধটি সঠিক নয়।") from exc
        if length <= 0 or length > 2_100_000:
            raise ValueError("অনুরোধের আকার সঠিক নয়।")
        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError) as exc:
            raise ValueError("অনুরোধের তথ্য পড়া যায়নি।") from exc
        if not isinstance(payload, dict):
            raise ValueError("অনুরোধের তথ্য সঠিক নয়।")
        return payload

    def _require_same_origin(self):
        origin = self.headers.get("Origin")
        if not origin:
            return True
        try:
            return urlsplit(origin).netloc.lower() == self.headers.get("Host", "").lower()
        except ValueError:
            return False

    def _session_token(self):
        cookie_header = self.headers.get("Cookie")
        if not cookie_header:
            return None
        cookie = http.cookies.SimpleCookie()
        try:
            cookie.load(cookie_header)
        except http.cookies.CookieError:
            return None
        morsel = cookie.get(SESSION_COOKIE)
        return morsel.value if morsel else None

    def _set_session_cookie(self, token):
        value = (
            f"{SESSION_COOKIE}={token}; Path=/; HttpOnly; SameSite=Strict; "
            f"Max-Age={int(SESSION_TTL.total_seconds())}"
        )
        if self.secure_cookies:
            value += "; Secure"
        return ("Set-Cookie", value)

    def _clear_session_cookie(self):
        value = f"{SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
        if self.secure_cookies:
            value += "; Secure"
        return ("Set-Cookie", value)

    def _current_user(self):
        return self.auth_store.get_session_user(self._session_token())

    def _record_limited_attempt(self, attempts, key, limit, window_seconds):
        now = time.monotonic()
        with self.attempts_lock:
            if len(attempts) > 5000:
                for old_key, timestamps in list(attempts.items()):
                    if not timestamps or now - timestamps[-1] >= window_seconds:
                        attempts.pop(old_key, None)
            recent = [
                item for item in attempts.get(key, [])
                if now - item < window_seconds
            ]
            if len(recent) >= limit:
                attempts[key] = recent
                return True
            recent.append(now)
            attempts[key] = recent
            return False

    def _api_get(self, path):
        if path == "/api/branding":
            logo_id = self.content_store.get_setting("brand_logo_id")
            self._send_json(200, {
                "siteName": SITE_NAME,
                "logoUrl": "/api/branding/logo" if logo_id else None,
            })
            return
        if path == "/api/branding/logo":
            self._send_brand_logo()
            return
        if path == "/api/payment-info":
            try:
                payment_config = load_payment_config(self.payment_config_path)
            except PaymentConfigError as exc:
                LOGGER.exception("Payment configuration is invalid")
                self._send_json(500, {"error": str(exc)})
                return
            configured = bool(payment_config["bkashNumber"])
            self._send_json(200, {
                "bkashNumber": payment_config["bkashNumber"] or None,
                "bkashConfigured": configured,
                "coupons": {
                    code: coupon
                    for code, coupon in payment_config["coupons"].items()
                    if not coupon.get("expiry")
                    or coupon["expiry"] >= datetime.now().date().isoformat()
                },
            })
            return
        if path == "/api/auth/me":
            user = self._current_user()
            if not user:
                self._send_json(200, {"user": None})
                return
            self._send_json(200, {"user": user})
            return
        if path == "/api/admin/state":
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            if user["role"] != "ADMIN":
                self._send_json(403, {"error": "শুধু অ্যাডমিন এই তথ্য দেখতে পারবেন।"})
                return
            self._send_json(200, {
                "students": self.auth_store.list_students(),
                "users": self.auth_store.list_users(),
                "courses": self.content_store.list_resources("courses"),
                "exams": self.content_store.list_resources("exams"),
                "questions": self.content_store.list_resources("questions"),
                "products": self.content_store.list_resources("products"),
                "examAttempts": self.content_store.list_exam_attempts(),
                "paymentOrders": self.content_store.list_payment_orders(),
                "branding": {
                    "siteName": SITE_NAME,
                    "logoUrl": (
                        "/api/branding/logo"
                        if self.content_store.get_setting("brand_logo_id")
                        else None
                    ),
                },
            })
            return
        if path == "/api/orders":
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            self._send_json(200, {
                "orders": self.content_store.list_payment_orders(
                    None if user["role"] == "ADMIN" else user["id"]
                )
            })
            return
        if path == "/api/admin/exam-attempts":
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            if user["role"] != "ADMIN":
                self._send_json(403, {"error": "শুধু অ্যাডমিন উত্তরপত্র দেখতে পারবেন।"})
                return
            self._send_json(200, {
                "attempts": self.content_store.list_exam_attempts()
            })
            return
        if path == "/api/exam-attempts":
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            self._send_json(200, {
                "attempts": self.content_store.list_exam_attempts(
                    None if user["role"] == "ADMIN" else user["id"]
                )
            })
            return
        if path.startswith("/api/exam-attempts/"):
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            attempt_id = unquote(path.removeprefix("/api/exam-attempts/"))
            attempt = self.content_store.get_exam_attempt(attempt_id)
            if not attempt or (
                user["role"] != "ADMIN" and attempt["userId"] != user["id"]
            ):
                self._send_json(404, {"error": "পরীক্ষার ফলাফল পাওয়া যায়নি।"})
                return
            self._send_json(200, {"attempt": attempt})
            return
        if path == "/api/content":
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            category = None if user["role"] == "ADMIN" else user["educationType"]
            products = self.content_store.list_resources("products")
            if category:
                products = [
                    product for product in products
                    if category in product.get("educationTypes", [])
                ]
            self._send_json(200, {
                "courses": self.content_store.list_resources("courses", category),
                "exams": self.content_store.list_resources("exams", category),
                "questions": self.content_store.list_resources("questions", category),
                "products": products,
            })
            return
        if path.startswith("/api/media/"):
            self._send_media(unquote(path.removeprefix("/api/media/")))
            return
        self._send_json(404, {"error": "API endpoint পাওয়া যায়নি।"})

    def _api_post(self, path):
        if not self._require_same_origin():
            self._send_json(403, {"error": "এই অনুরোধ অনুমোদিত নয়।"})
            return
        if path == "/api/orders":
            self._create_manual_order()
            return
        if path == "/api/ai/question-solution":
            self._generate_ai_question_solution()
            return
        if path == "/api/ai/assistant":
            self._generate_ai_assistant_response()
            return
        if path.startswith("/api/admin/orders/") and path.endswith("/review"):
            self._review_manual_order(path)
            return
        if path.startswith("/api/exams/") and path.endswith("/attempts"):
            self._submit_exam_attempt(path)
            return
        if path.startswith("/api/admin/exam-attempts/") and path.endswith("/grade"):
            self._grade_exam_attempt(path)
            return
        if path == "/api/auth/password-reset/request":
            self._request_password_reset()
            return
        if path == "/api/auth/password-reset/complete":
            self._complete_password_reset()
            return
        if path == "/api/auth/admin-mode":
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            try:
                payload = self._read_json()
                updated = self.auth_store.switch_own_role(
                    user["id"],
                    payload.get("role"),
                    payload.get("educationType"),
                    payload.get("batchOrTarget"),
                    payload.get("password"),
                )
            except LookupError as exc:
                self._send_json(404, {"error": str(exc)})
                return
            except PermissionError as exc:
                self._send_json(403, {"error": str(exc)})
                return
            except ValueError as exc:
                self._send_json(400, {"error": str(exc)})
                return
            token = self.auth_store.create_session(updated["id"])
            self._send_json(
                200, {"user": updated}, (self._set_session_cookie(token),)
            )
            return
        if path.startswith("/api/admin/users/") and path.endswith("/password"):
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে অ্যাডমিন হিসেবে লগইন করুন।"})
                return
            if user["role"] != "ADMIN":
                self._send_json(403, {"error": "শুধু অ্যাডমিন শিক্ষার্থীর পাসওয়ার্ড রিসেট করতে পারবেন।"})
                return
            try:
                payload = self._read_json()
                student_id = unquote(
                    path.removeprefix("/api/admin/users/").removesuffix("/password")
                )
                student = self.auth_store.reset_student_password(
                    student_id, payload.get("password")
                )
            except LookupError as exc:
                self._send_json(404, {"error": str(exc)})
                return
            except ValueError as exc:
                self._send_json(400, {"error": str(exc)})
                return
            normalized_identifiers = {
                student["email"].casefold(),
                normalize_mobile(student["mobile"]).casefold(),
            }
            with self.attempts_lock:
                for key in list(self.login_attempts):
                    if isinstance(key, tuple) and key[1] in normalized_identifiers:
                        self.login_attempts.pop(key, None)
            self._send_json(200, {"ok": True})
            return
        if path == "/api/admin/upload":
            self._admin_upload()
            return
        if path.startswith("/api/admin/resources/"):
            user = self._current_user()
            if not user:
                self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
                return
            if user["role"] != "ADMIN":
                self._send_json(403, {"error": "শুধু অ্যাডমিন কন্টেন্ট পরিবর্তন করতে পারবেন।"})
                return
            collection = path.removeprefix("/api/admin/resources/")
            if collection not in RESOURCE_TABLES:
                self._send_json(404, {"error": "কন্টেন্টের ধরন পাওয়া যায়নি।"})
                return
            try:
                resource = self._read_json()
                saved = self.content_store.save_resource(collection, resource)
            except ValueError as exc:
                self._send_json(400, {"error": str(exc)})
                return
            self._send_json(200, {"resource": saved})
            return
        try:
            payload = self._read_json()
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
            return

        if path == "/api/auth/register":
            self._register(payload)
        elif path == "/api/auth/login":
            self._login(payload)
        elif path == "/api/auth/logout":
            token = self._session_token()
            self.auth_store.revoke_session(token)
            self._send_json(
                200, {"ok": True}, (self._clear_session_cookie(),)
            )
        elif path == "/api/auth/profile":
            self._update_profile(payload)
        else:
            self._send_json(404, {"error": "API endpoint পাওয়া যায়নি।"})

    def _generate_ai_question_solution(self):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "AI সমাধান পেতে প্রথমে লগইন করুন।"})
            return
        if user["role"] != "STUDENT":
            self._send_json(403, {"error": "এই সমাধানটি শিক্ষার্থী অ্যাকাউন্টের জন্য।"})
            return
        try:
            payload = self._read_json()
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
            return
        question_id = payload.get("questionId")
        if not isinstance(question_id, str) or not question_id or len(question_id) > 120:
            self._send_json(400, {"error": "প্রশ্নটি সঠিকভাবে নির্বাচন করুন।"})
            return
        if user.get("educationType") not in {"SSC", "HSC", "JOB"}:
            self._send_json(403, {"error": "আপনার শিক্ষার্থী বিভাগ পাওয়া যায়নি।"})
            return
        question = next(
            (
                item for item in self.content_store.list_resources(
                    "questions", user["educationType"]
                )
                if item.get("id") == question_id
            ),
            None,
        )
        if not question:
            self._send_json(404, {"error": "আপনার বিভাগের প্রশ্নটি পাওয়া যায়নি।"})
            return
        saved_solution = self.content_store.get_ai_question_solution(
            user["educationType"], question_id
        )
        if saved_solution is not None:
            self._send_json(200, {"solution": saved_solution})
            return
        try:
            solution = generate_question_solution(question, user["educationType"])
        except GeminiRateLimitError as exc:
            LOGGER.warning("Gemini question solution quota exhausted: %s", exc)
            self._send_json(429, {"error": str(exc)})
            return
        except RuntimeError as exc:
            LOGGER.warning("Gemini question solution failed: %s", exc)
            self._send_json(502, {"error": str(exc)})
            return
        saved_solution = self.content_store.save_ai_question_solution(
            user["educationType"], question_id, solution
        )
        self._send_json(200, {"solution": saved_solution})

    def _generate_ai_assistant_response(self):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "AI সহকারী ব্যবহার করতে প্রথমে লগইন করুন।"})
            return
        if user["role"] != "STUDENT":
            self._send_json(403, {"error": "AI সহকারী শিক্ষার্থী অ্যাকাউন্টের জন্য।"})
            return
        category = user.get("educationType")
        if category not in {"SSC", "HSC", "JOB"}:
            self._send_json(403, {"error": "আপনার শিক্ষার্থী বিভাগ পাওয়া যায়নি।"})
            return
        if self._record_limited_attempt(
            self.login_attempts, ("ai-assistant", user["id"]), 30, 60
        ):
            self._send_json(
                429, {"error": "এক মিনিটে AI-কে সর্বোচ্চ ৩০টি প্রশ্ন করতে পারবেন।"}
            )
            return
        try:
            payload = self._read_json()
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
            return
        prompt = payload.get("prompt")
        if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 4000:
            self._send_json(400, {"error": "১ থেকে ৪০০০ অক্ষরের মধ্যে প্রশ্ন লিখুন।"})
            return
        questions = self.content_store.list_resources("questions", category)
        try:
            answer = generate_study_assistant_response(
                prompt.strip(), category, questions
            )
        except GeminiRateLimitError as exc:
            LOGGER.warning("Gemini AI assistant quota exhausted: %s", exc)
            self._send_json(429, {"error": str(exc)})
            return
        except RuntimeError as exc:
            LOGGER.warning("Gemini AI assistant failed: %s", exc)
            self._send_json(502, {"error": str(exc)})
            return
        self._send_json(200, {"answer": answer})

    def _create_manual_order(self):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
            return
        if user["role"] != "STUDENT":
            self._send_json(403, {"error": "শুধু শিক্ষার্থী অ্যাকাউন্ট থেকে কোর্স অর্ডার করা যাবে।"})
            return
        try:
            payload = self._read_json()
            items = payload.get("items")
            transaction_id = payload.get("transactionId")
            coupon_code = payload.get("couponCode", "")
            if (
                not isinstance(items, list)
                or not items
                or len(items) > 20
                or not isinstance(coupon_code, str)
                or len(coupon_code) > 40
            ):
                raise ValueError("কোর্স এবং সঠিক কুপন কোড দিন।")
            courses = self.content_store.list_resources(
                "courses", user["educationType"]
            )
            course_map = {course["id"]: course for course in courses}
            products = self.content_store.list_resources("products")
            product_map = {
                product["id"]: product for product in products
                if user["educationType"] in product.get("educationTypes", [])
            }
            enrolled = set(user.get("enrolledCourses", []))
            unlocked = set(user.get("unlockedProducts", []))
            order_items = []
            total_amount = 0.0
            seen_item_ids = set()
            for item in items:
                if not isinstance(item, dict) or item.get("type") not in {
                    "course", "digital"
                }:
                    raise ValueError("Checkout-এ শুধু কোর্স বা ডিজিটাল PDF কেনা যাবে।")
                item_id = item.get("id")
                item_type = item["type"]
                quantity = item.get("quantity", 1)
                if (
                    not isinstance(item_id, str)
                    or item_id in seen_item_ids
                    or isinstance(quantity, bool)
                    or not isinstance(quantity, int)
                    or quantity != 1
                ):
                    raise ValueError("কার্টের একটি বা একাধিক আইটেম সঠিক নয়।")
                seen_item_ids.add(item_id)
                catalog_item = (
                    course_map.get(item_id) if item_type == "course"
                    else product_map.get(item_id)
                )
                if not catalog_item:
                    raise ValueError("কোর্স বা PDF-টি পাওয়া যায়নি।")
                if item_type == "digital" and catalog_item.get("type") != "digital":
                    raise ValueError("শুধু ডিজিটাল PDF checkout-এ কেনা যাবে।")
                if (
                    item_id in (enrolled if item_type == "course" else unlocked)
                ):
                    raise ValueError("আপনি ইতিমধ্যে এই কোর্স বা PDF access পেয়েছেন।")
                try:
                    price = float(catalog_item.get("price"))
                except (TypeError, ValueError) as exc:
                    raise ValueError("পণ্যের মূল্য সঠিকভাবে সেট করা নেই।") from exc
                if not math.isfinite(price) or price <= 0:
                    raise ValueError("পণ্যের মূল্য সঠিকভাবে সেট করা নেই।")
                order_items.append({
                    "id": item_id,
                    "name": str(
                        catalog_item.get("title")
                        or catalog_item.get("name", "কোর্স বা PDF")
                    )[:200],
                    "type": item_type,
                    "quantity": quantity,
                    "price": price,
                })
                total_amount += price * quantity
            subtotal = round(total_amount, 2)
            coupon_code = coupon_code.strip().upper()
            discount = self._course_coupon_discount(coupon_code, subtotal)
            total_amount = round(max(0, subtotal - discount), 2)
            if total_amount == 0:
                transaction_id = (
                    f"COUPON-FREE-{secrets.token_urlsafe(12)}"
                )
                order = {
                    "id": f"ord_{secrets.token_urlsafe(9)}",
                    "userId": user["id"],
                    "userName": user["name"],
                    "userMobile": user["mobile"],
                    "items": order_items,
                    "subtotal": subtotal,
                    "discount": discount,
                    "couponCode": coupon_code,
                    "totalAmount": 0,
                    "paymentGateway": "Coupon (Free)",
                    "transactionId": transaction_id,
                    "status": "pending",
                    "date": datetime.now().astimezone().isoformat(),
                }
                saved = self.content_store.create_payment_order(order)
                self._send_json(201, {"order": saved})
                return

            payment_config = load_payment_config(self.payment_config_path)
            number = payment_config["bkashNumber"]
            if not re.fullmatch(r"01[3-9]\d{8}", number):
                self._send_json(503, {
                    "error": "payment_config.json-এ bKash নম্বর সেট করুন।"
                })
                return
            raw_sender_mobile = payload.get("senderMobile")
            if not isinstance(raw_sender_mobile, str):
                raise ValueError("সঠিক bKash নম্বর দিন।")
            sender_mobile = normalize_mobile(raw_sender_mobile)
            if (
                not re.fullmatch(r"01[3-9]\d{8}", sender_mobile)
                or not isinstance(transaction_id, str)
                or not re.fullmatch(r"[A-Za-z0-9-]{4,40}", transaction_id.strip())
            ):
                raise ValueError("সঠিক bKash নম্বর এবং TrxID দিন।")
            transaction_id = transaction_id.strip()
            order = {
                "id": f"ord_{secrets.token_urlsafe(9)}",
                "userId": user["id"],
                "userName": user["name"],
                "userMobile": user["mobile"],
                "senderMobile": sender_mobile,
                "items": order_items,
                "subtotal": subtotal,
                "discount": discount,
                "couponCode": coupon_code or None,
                "totalAmount": total_amount,
                "paymentGateway": "bKash (Manual)",
                "transactionId": transaction_id,
                "status": "pending",
                "date": datetime.now().astimezone().isoformat(),
            }
            saved = self.content_store.create_payment_order(order)
        except sqlite3.IntegrityError:
            self._send_json(409, {"error": "এই TrxID দিয়ে একটি অর্ডার ইতিমধ্যে জমা হয়েছে।"})
            return
        except PaymentConfigError as exc:
            LOGGER.exception("Payment configuration is invalid")
            self._send_json(500, {"error": str(exc)})
            return
        except (TypeError, ValueError) as exc:
            self._send_json(400, {"error": str(exc)})
            return
        self._send_json(201, {"order": saved})

    def _course_coupon_discount(self, code, subtotal):
        if not code:
            return 0
        coupon = load_payment_config(self.payment_config_path)["coupons"].get(code)
        if not coupon:
            raise ValueError("কুপন কোডটি সঠিক নয়।")
        expiry = coupon.get("expiry")
        if expiry and datetime.now().date().isoformat() > expiry:
            raise ValueError("এই কুপনের মেয়াদ শেষ হয়েছে।")
        percent = coupon.get("discountPercent")
        if percent is not None:
            discount = subtotal * percent / 100
            maximum = coupon.get("maxDiscount")
            if maximum is not None:
                discount = min(maximum, discount)
            return math.floor(discount * 100 + 0.5) / 100
        return round(min(coupon["discountAmount"], subtotal), 2)

    def _review_manual_order(self, path):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
            return
        if user["role"] != "ADMIN":
            self._send_json(403, {"error": "শুধু অ্যাডমিন অর্ডার যাচাই করতে পারবেন।"})
            return
        try:
            payload = self._read_json()
            order_id = unquote(
                path.removeprefix("/api/admin/orders/").removesuffix("/review")
            )
            order = self.content_store.review_payment_order(
                order_id, payload.get("status")
            )
        except LookupError as exc:
            self._send_json(404, {"error": str(exc)})
            return
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
            return
        self._send_json(200, {"order": order})

    def _submit_exam_attempt(self, path):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
            return
        if user["role"] != "STUDENT":
            self._send_json(403, {"error": "শিক্ষার্থী অ্যাকাউন্ট থেকে পরীক্ষা জমা দিন।"})
            return
        parts = path.removeprefix("/api/exams/").split("/")
        if len(parts) != 2 or parts[1] != "attempts":
            self._send_json(404, {"error": "পরীক্ষা পাওয়া যায়নি।"})
            return
        exam_id = unquote(parts[0])
        exams = self.content_store.list_resources("exams", user["educationType"])
        exam = next((item for item in exams if item["id"] == exam_id), None)
        if not exam:
            self._send_json(404, {"error": "পরীক্ষাটি পাওয়া যায়নি।"})
            return
        now = datetime.now().astimezone()
        for key, message in (
            ("startAt", "পরীক্ষাটি এখনো শুরু হয়নি।"),
            ("endAt", "পরীক্ষার সময় শেষ হয়েছে।"),
        ):
            scheduled = exam.get(key)
            if scheduled:
                try:
                    scheduled_at = datetime.fromisoformat(
                        scheduled.replace("Z", "+00:00")
                    )
                except (AttributeError, ValueError):
                    self._send_json(400, {"error": "পরীক্ষার সময়সূচি সঠিক নয়।"})
                    return
                if scheduled_at.tzinfo is None:
                    scheduled_at = scheduled_at.astimezone()
                if key == "startAt" and now < scheduled_at:
                    self._send_json(403, {"error": message})
                    return
                if key == "endAt" and now > scheduled_at:
                    self._send_json(403, {"error": message})
                    return

        try:
            content_type = self.headers.get("Content-Type", "")
            if not content_type.lower().startswith("multipart/form-data;"):
                raise ValueError("পরীক্ষার উত্তর ও PDF আপলোড সঠিক ফরম্যাটে দিন।")
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 21 * 1024 * 1024:
                self._send_json(413, {"error": "উত্তরপত্রের PDF ২০ MB-এর মধ্যে হতে হবে।"})
                return
            message = BytesParser(policy=default).parsebytes(
                f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode()
                + self.rfile.read(length)
            )
            if not message.is_multipart():
                raise ValueError("পরীক্ষার উত্তর ও PDF আপলোড সঠিক ফরম্যাটে দিন।")
            fields = {}
            file_part = None
            for part in message.iter_parts():
                field_name = part.get_param("name", header="content-disposition")
                if field_name == "answerSheet":
                    file_part = part
                elif field_name:
                    fields[field_name] = part.get_content()
            try:
                answers = json.loads(fields.get("answers", "{}"))
            except (json.JSONDecodeError, TypeError) as exc:
                raise ValueError("পরীক্ষার উত্তর সঠিকভাবে পড়া যায়নি।") from exc
            if not isinstance(answers, dict):
                raise ValueError("পরীক্ষার উত্তর সঠিক নয়।")
            time_taken = fields.get("timeTaken", "")
            if not isinstance(time_taken, str) or len(time_taken) > 10 or (
                time_taken and not re.fullmatch(r"\d{1,3}:\d{2}", time_taken)
            ):
                raise ValueError("পরীক্ষায় ব্যয় করা সময় সঠিক নয়।")

            all_questions = self.content_store.list_resources(
                "questions", exam["category"]
            )
            question_map = {question["id"]: question for question in all_questions}
            questions = [
                question_map[qid]
                for qid in exam.get("questionIds", [])
                if qid in question_map
            ]
            if not questions or len(questions) != len(exam.get("questionIds", [])):
                raise ValueError("পরীক্ষার প্রশ্নগুলো আর পাওয়া যাচ্ছে না।")
            cq_questions = [
                question for question in questions
                if question.get("questionType") == "CQ"
            ]
            mcq_questions = [
                question for question in questions
                if question.get("questionType") != "CQ"
            ]
            if any(
                question.get("questionType") not in {None, "MCQ", "CQ"}
                for question in questions
            ):
                raise ValueError("পরীক্ষায় অজানা প্রশ্নের ধরন রয়েছে।")
            if not cq_questions:
                raise ValueError("এই পরীক্ষায় কোনো CQ প্রশ্ন নেই।")
            if any(
                not isinstance(question.get("options"), list)
                or isinstance(question.get("correctIndex"), bool)
                or not isinstance(question.get("correctIndex"), int)
                or not 0 <= question["correctIndex"] < len(question["options"])
                for question in mcq_questions
            ):
                raise ValueError("পরীক্ষার একটি বা একাধিক MCQ সঠিকভাবে সেট করা হয়নি।")
            if not file_part or not file_part.get_filename():
                raise ValueError("CQ পরীক্ষার উত্তরপত্র PDF আপলোড করা বাধ্যতামূলক।")
            answer_sheet_bytes = file_part.get_payload(decode=True) or b""
            if not answer_sheet_bytes.startswith(b"%PDF-"):
                raise ValueError("উত্তরপত্রের ফাইলটি সঠিক PDF নয়।")
            if len(answer_sheet_bytes) > 20 * 1024 * 1024:
                raise ValueError("উত্তরপত্রের PDF ২০ MB-এর মধ্যে হতে হবে।")
            if any(
                question_id not in {question["id"] for question in mcq_questions}
                or isinstance(answer, bool)
                or not isinstance(answer, int)
                or answer < 0
                or answer >= len(question_map[question_id].get("options", []))
                for question_id, answer in answers.items()
            ):
                raise ValueError("এক বা একাধিক MCQ উত্তর সঠিক নয়।")

            total_marks = float(exam.get("totalMarks") or len(questions))
            cq_max_marks = float(
                exam.get("cqTotalMarks")
                if exam.get("cqTotalMarks") is not None
                else total_marks - len(mcq_questions)
            )
            if (
                not math.isfinite(total_marks)
                or not math.isfinite(cq_max_marks)
                or total_marks <= 0
                or cq_max_marks <= 0
                or cq_max_marks > total_marks
                or (mcq_questions and cq_max_marks >= total_marks)
                or (not mcq_questions and cq_max_marks != total_marks)
            ):
                raise ValueError("পরীক্ষার পূর্ণমান ও CQ নম্বরের অনুপাত সঠিক নয়।")
            correct = sum(
                answers.get(question["id"]) == question.get("correctIndex")
                for question in mcq_questions
            )
            wrong = sum(
                question["id"] in answers
                and answers[question["id"]] != question.get("correctIndex")
                for question in mcq_questions
            )
            skipped = len(mcq_questions) - correct - wrong
            mcq_max_marks = total_marks - cq_max_marks
            mcq_marks_each = (
                mcq_max_marks / len(mcq_questions) if mcq_questions else 0
            )
            negative_per_question = float(exam.get("negativeMarking") or 0)
            penalty = wrong * negative_per_question * mcq_marks_each
            mcq_score = max(
                0,
                round(correct * mcq_marks_each - penalty, 2),
            )
            asset, _stored_path = self.content_store.store_upload(
                answer_sheet_bytes,
                Path(file_part.get_filename()).name,
                "application/pdf",
                exam["category"],
                "cq-answer-sheet",
            )
            attempt = {
                "id": f"atm_{secrets.token_urlsafe(12)}",
                "userId": user["id"],
                "userName": user["name"],
                "examId": exam["id"],
                "examTitle": exam["title"],
                "category": exam["category"],
                "subject": exam.get("subject", ""),
                "score": mcq_score,
                "mcqScore": mcq_score,
                "mcqMarksEach": round(mcq_marks_each, 4),
                "negativeMarkingPerQuestion": negative_per_question * mcq_marks_each,
                "cqScore": None,
                "cqMaxMarks": round(cq_max_marks, 2),
                "totalMarks": total_marks,
                "percentage": round(mcq_score / total_marks * 100),
                "correct": correct,
                "wrong": wrong,
                "skipped": skipped,
                "negativePenalty": round(penalty, 2),
                "timeTaken": time_taken,
                "submittedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
                "answers": answers,
                "questions": questions,
                "cqStatus": "pending",
                "cqFeedback": "",
                "cqPdfAssetId": asset["id"],
                "cqPdfUrl": asset["url"],
                "cqPdfName": asset["name"],
                "topicBreakdown": {},
                "weakTopics": [],
            }
            self.content_store.save_exam_attempt(attempt)
            self._send_json(201, {"attempt": attempt})
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
        except Exception as exc:
            self.log_error("CQ exam submission failed: %s", exc)
            self._send_json(500, {"error": "পরীক্ষার উত্তরপত্র জমা দেওয়া যায়নি।"})

    def _grade_exam_attempt(self, path):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
            return
        if user["role"] != "ADMIN":
            self._send_json(403, {"error": "শুধু অ্যাডমিন CQ নম্বর দিতে পারবেন।"})
            return
        attempt_id = unquote(
            path.removeprefix("/api/admin/exam-attempts/").removesuffix("/grade")
        )
        attempt = self.content_store.get_exam_attempt(attempt_id)
        if not attempt:
            self._send_json(404, {"error": "জমা দেওয়া পরীক্ষা পাওয়া যায়নি।"})
            return
        try:
            payload = self._read_json()
            cq_score = payload.get("cqScore")
            feedback = payload.get("feedback", "")
            if (
                isinstance(cq_score, bool)
                or not isinstance(cq_score, (int, float))
                or not 0 <= cq_score <= attempt["cqMaxMarks"]
                or not isinstance(feedback, str)
                or len(feedback) > 4000
            ):
                raise ValueError("CQ নম্বর পূর্ণমানের মধ্যে এবং feedback ৪০০০ অক্ষরের মধ্যে দিন।")
            attempt["cqScore"] = round(float(cq_score), 2)
            attempt["cqFeedback"] = feedback.strip()
            attempt["score"] = round(attempt["mcqScore"] + attempt["cqScore"], 2)
            attempt["percentage"] = round(
                attempt["score"] / attempt["totalMarks"] * 100
            )
            attempt["cqStatus"] = "reviewed"
            self.content_store.update_exam_attempt(attempt)
            self._send_json(200, {"attempt": attempt})
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
        except Exception as exc:
            self.log_error("CQ exam grading failed: %s", exc)
            self._send_json(500, {"error": "CQ নম্বর সংরক্ষণ করা যায়নি।"})

    def _register(self, payload):
        if self._record_limited_attempt(
            self.registration_attempts, self.client_address[0], 5, 3600
        ):
            self._send_json(
                429,
                {"error": "অনেকবার অ্যাকাউন্ট তৈরির চেষ্টা হয়েছে। পরে আবার চেষ্টা করুন।"},
            )
            return
        name = payload.get("name", "")
        email = payload.get("email", "")
        mobile = payload.get("mobile", "")
        password = payload.get("password", "")
        education_type = payload.get("educationType", "")
        batch = payload.get("batchOrTarget", "")
        if not all(isinstance(value, str) for value in (
            name, email, mobile, password, education_type, batch
        )):
            self._send_json(400, {"error": "সকল তথ্য সঠিকভাবে পূরণ করুন।"})
            return
        if (
            not name.strip()
            or len(name.strip()) > 120
            or any(char in name for char in '<>&"')
            or any(ord(char) < 32 for char in name)
            or len(email) > 254
            or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email.strip())
            or any(char in email for char in '<>&"')
            or not re.fullmatch(r"[0-9+() -]{7,20}", mobile.strip())
            or len(password) < 6
            or len(password.encode("utf-8")) > 1024
            or education_type not in {"SSC", "HSC", "JOB"}
            or not batch.strip()
            or len(batch.strip()) > 120
            or any(char in batch for char in '<>&"')
            or any(ord(char) < 32 for char in batch)
        ):
            self._send_json(
                400,
                {"error": "নাম, ইমেইল, মোবাইল, বিভাগ ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।"},
            )
            return
        try:
            user = self.auth_store.create_user(
                name, email, mobile, password, education_type, batch
            )
        except sqlite3.IntegrityError:
            self._send_json(
                409, {"error": "এই ইমেইল বা মোবাইল দিয়ে অ্যাকাউন্ট রয়েছে।"}
            )
            return
        token = self.auth_store.create_session(user["id"])
        user = self.auth_store.record_login(user["id"])
        self._send_json(
            201,
            {"user": user},
            (self._set_session_cookie(token),),
        )

    def _login(self, payload):
        identifier = payload.get("identifier", "")
        password = payload.get("password", "")
        if not isinstance(identifier, str) or not isinstance(password, str):
            self._send_json(400, {"error": "ইমেইল/মোবাইল ও পাসওয়ার্ড দিন।"})
            return
        normalized_identifier = identifier.strip()
        if "@" not in normalized_identifier:
            normalized_identifier = normalize_mobile(normalized_identifier)
        key = (self.client_address[0], normalized_identifier.casefold())
        with self.attempts_lock:
            recent = [
                item for item in self.login_attempts.get(key, [])
                if time.monotonic() - item < 900
            ]
            if len(recent) >= 10:
                self._send_json(
                    429,
                    {"error": "এই অ্যাকাউন্টে অল্প সময়ে অনেকবার ভুল চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।"},
                )
                return
        user = self.auth_store.authenticate(identifier, password)
        if not user:
            self._record_limited_attempt(
                self.login_attempts, key, 10, 900
            )
            self._send_json(401, {"error": "ইমেইল/মোবাইল বা পাসওয়ার্ড সঠিক নয়।"})
            return
        with self.attempts_lock:
            self.login_attempts.pop(key, None)
        user = self.auth_store.record_login(user["id"])
        token = self.auth_store.create_session(user["id"])
        self._send_json(
            200, {"user": user}, (self._set_session_cookie(token),)
        )

    def _request_password_reset(self):
        ip_address = self.client_address[0]
        if self._record_limited_attempt(
            self.password_reset_attempts, ip_address, 5, 3600
        ):
            self._send_json(
                429,
                {"error": "অনেকবার অনুরোধ করা হয়েছে। পরে আবার চেষ্টা করুন।"},
            )
            return
        if not self.email_service.configured:
            self._send_json(
                503,
                {"error": "পাসওয়ার্ড রিসেটের ইমেইল সেবা এখনো কনফিগার করা হয়নি।"},
            )
            return
        try:
            payload = self._read_json()
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
            return
        email = payload.get("email")
        if (
            not isinstance(email, str)
            or len(email) > 254
            or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email.strip())
        ):
            self._send_json(400, {"error": "একটি সঠিক ইমেইল ঠিকানা দিন।"})
            return
        token = secrets.token_urlsafe(32)
        user = self.auth_store.create_password_reset(email, token)
        if user:
            try:
                self.email_service.send_password_reset(
                    user["email"], user["name"], token
                )
            except EmailDeliveryError as exc:
                self.auth_store.discard_password_reset(token)
                LOGGER.warning("Password reset email delivery failed: %s", exc)
                self._send_json(
                    503,
                    {"error": "রিসেট ইমেইল পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"},
                )
                return
        self._send_json(
            200,
            {"message": "অ্যাকাউন্ট থাকলে নির্দেশনাসহ একটি ইমেইল পাঠানো হয়েছে।"},
        )

    def _complete_password_reset(self):
        ip_address = self.client_address[0]
        if self._record_limited_attempt(
            self.password_reset_attempts, ("complete", ip_address), 10, 900
        ):
            self._send_json(
                429,
                {"error": "অনেকবার চেষ্টা করা হয়েছে। পরে আবার চেষ্টা করুন।"},
            )
            return
        try:
            payload = self._read_json()
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
            return
        token = payload.get("token")
        password = payload.get("password")
        if (
            not isinstance(token, str)
            or not 40 <= len(token) <= 128
            or not re.fullmatch(r"[A-Za-z0-9_-]+", token)
            or not isinstance(password, str)
            or len(password) < 6
            or len(password.encode("utf-8")) > 1024
        ):
            self._send_json(
                400,
                {"error": "সঠিক রিসেট লিংক এবং কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।"},
            )
            return
        try:
            reset_user = self.auth_store.complete_password_reset(token, password)
        except ValueError as exc:
            self._send_json(400, {"error": str(exc)})
            return
        if not reset_user:
            self._send_json(
                400,
                {"error": "রিসেট লিংকটি মেয়াদোত্তীর্ণ বা ইতোমধ্যে ব্যবহার করা হয়েছে।"},
            )
            return
        identifiers = {
            reset_user["email"].casefold(),
            normalize_mobile(reset_user["mobile"]).casefold(),
        }
        with self.attempts_lock:
            for key in list(self.login_attempts):
                if (
                    isinstance(key, tuple)
                    and key[0] == ip_address
                    and key[1] in identifiers
                ):
                    self.login_attempts.pop(key, None)
        self._send_json(
            200,
            {"message": "পাসওয়ার্ড পরিবর্তন হয়েছে। নতুন পাসওয়ার্ড দিয়ে লগইন করুন।"},
        )

    def _admin_upload(self):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
            return
        if user["role"] != "ADMIN":
            self._send_json(403, {"error": "শুধু অ্যাডমিন ফাইল আপলোড করতে পারবেন।"})
            return
        content_type = self.headers.get("Content-Type", "")
        if not content_type.lower().startswith("multipart/form-data;"):
            self._send_json(400, {"error": "ফাইল আপলোডের ফরম্যাট সঠিক নয়।"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > 5 * 1024 * 1024 * 1024 + 1024 * 1024:
            self._send_json(413, {"error": "ভিডিও সর্বোচ্চ ৫ GB এবং PDF সর্বোচ্চ ১০০ MB হতে পারে।"})
            return
        temporary_path = None
        try:
            fields, filename, uploaded_content_type, temporary_path, file_size = (
                self._stream_admin_upload(length, content_type)
            )
            category = fields.get("category")
            purpose = fields.get("purpose")
            with open(temporary_path, "rb") as source:
                asset, stored_path = self.content_store.store_upload_stream(
                    source,
                    file_size,
                    filename,
                    uploaded_content_type or mimetypes.guess_type(filename)[0] or "application/octet-stream",
                    "GLOBAL" if purpose == "brand-logo" else category,
                    purpose,
                )
            if purpose == "brand-logo":
                self.content_store.set_setting("brand_logo_id", asset["id"])
            drafts = []
            used_ocr = False
            if purpose == "questions-pdf":
                drafts, used_ocr = extract_questions(stored_path)
            self._send_json(201, {
                "asset": asset,
                "questions": drafts,
                "usedOcr": used_ocr,
                "message": (
                    "কোনো সম্পূর্ণ MCQ পাওয়া যায়নি; PDF ফরম্যাট বা OCR ভাষা পরীক্ষা করুন।"
                    if not drafts and purpose == "questions-pdf"
                    else ""
                ),
            })
        except (ValueError, RuntimeError) as exc:
            self._send_json(400, {"error": str(exc)})
        except Exception as exc:
            self.log_error("Admin upload failed: %s", exc)
            self._send_json(500, {"error": "ফাইল প্রক্রিয়াকরণে সমস্যা হয়েছে।"})
        finally:
            if temporary_path:
                Path(temporary_path).unlink(missing_ok=True)

    def _stream_admin_upload(self, length, content_type):
        boundary = self.headers.get_param("boundary", header="Content-Type")
        if not boundary or len(boundary) > 200:
            raise ValueError("ফাইল আপলোডের boundary সঠিক নয়।")
        try:
            delimiter = b"\r\n--" + boundary.encode("ascii")
            opening = b"--" + boundary.encode("ascii") + b"\r\n"
        except UnicodeEncodeError as exc:
            raise ValueError("ফাইল আপলোডের boundary সঠিক নয়।") from exc

        remaining = length
        buffer = bytearray()

        def read_more():
            nonlocal remaining
            if remaining <= 0:
                return False
            chunk = self.rfile.read(min(1024 * 1024, remaining))
            if not chunk:
                raise ValueError("ফাইল আপলোড সম্পূর্ণ হয়নি।")
            buffer.extend(chunk)
            remaining -= len(chunk)
            return True

        def read_exact(size):
            while len(buffer) < size:
                if not read_more():
                    raise ValueError("Multipart অনুরোধটি অসম্পূর্ণ।")
            value = bytes(buffer[:size])
            del buffer[:size]
            return value

        def read_line(max_size):
            while True:
                newline = buffer.find(b"\n")
                if newline >= 0:
                    if newline + 1 > max_size:
                        raise ValueError("Multipart header অনেক বড়।")
                    return read_exact(newline + 1)
                if len(buffer) >= max_size or not read_more():
                    raise ValueError("Multipart header অসম্পূর্ণ বা অনেক বড়।")

        if read_exact(len(opening)) != opening:
            raise ValueError("Multipart অনুরোধের শুরু সঠিক নয়।")

        fields = {}
        temporary_path = None
        filename = None
        uploaded_content_type = None
        file_size = 0
        final_boundary = False
        temporary_file = None
        try:
            while not final_boundary:
                headers = bytearray()
                while True:
                    line = read_line(65536 - len(headers))
                    headers.extend(line)
                    if len(headers) > 65536:
                        raise ValueError("Multipart header অনেক বড়।")
                    if line == b"\r\n":
                        break

                part = BytesParser(policy=default).parsebytes(bytes(headers) + b"\r\n")
                field_name = part.get_param("name", header="content-disposition")
                part_filename = part.get_filename()
                max_part_size = 65536
                destination = None
                field_data = bytearray()

                if field_name == "file" and part_filename:
                    if "purpose" not in fields or (
                        fields["purpose"] != "brand-logo" and "category" not in fields
                    ):
                        raise ValueError("Upload metadata must precede the file.")
                    filename = Path(part_filename).name
                    uploaded_content_type = part.get_content_type()
                    purpose = fields["purpose"]
                    max_part_size = (
                        5 * 1024 * 1024 * 1024
                        if purpose == "video"
                        else 20 * 1024 * 1024
                        if purpose == "cq-answer-sheet"
                        else 5 * 1024 * 1024
                        if purpose in {"brand-logo", "question-image"}
                        else 100 * 1024 * 1024
                    )
                    temporary_file = tempfile.NamedTemporaryFile(
                        mode="wb", prefix=".admin-upload-", dir=self.content_store.upload_directory,
                        delete=False,
                    )
                    temporary_path = temporary_file.name
                    destination = temporary_file
                elif part_filename:
                    raise ValueError("একটি ফাইল নির্বাচন করুন।")

                part_size = 0
                while True:
                    marker_index = buffer.find(delimiter)
                    if marker_index >= 0:
                        chunk = bytes(buffer[:marker_index])
                        del buffer[:marker_index + len(delimiter)]
                        part_size += len(chunk)
                        if part_size > max_part_size:
                            raise ValueError(
                                "ভিডিও সর্বোচ্চ ৫ GB এবং PDF/Notes সর্বোচ্চ ১০০ MB হতে পারে।"
                            )
                        if destination:
                            destination.write(chunk)
                        else:
                            field_data.extend(chunk)
                        while len(buffer) < 2:
                            if not read_more():
                                raise ValueError("Multipart boundary অসম্পূর্ণ।")
                        suffix = read_exact(2)
                        if suffix == b"\r\n":
                            final_boundary = False
                        elif suffix == b"--":
                            final_boundary = True
                        else:
                            raise ValueError("Multipart boundary সঠিক নয়।")
                        break

                    keep = len(delimiter) + 2
                    if len(buffer) > keep:
                        count = len(buffer) - keep
                        chunk = bytes(buffer[:count])
                        del buffer[:count]
                        part_size += len(chunk)
                        if part_size > max_part_size:
                            raise ValueError(
                                "ভিডিও সর্বোচ্চ ৫ GB এবং PDF/Notes সর্বোচ্চ ১০০ MB হতে পারে।"
                            )
                        if destination:
                            destination.write(chunk)
                        else:
                            field_data.extend(chunk)
                    if not read_more():
                        raise ValueError("Multipart file boundary পাওয়া যায়নি।")

                if destination:
                    destination.close()
                    temporary_file = None
                    file_size = part_size
                elif field_name:
                    try:
                        fields[field_name] = field_data.decode("utf-8").strip()
                    except UnicodeDecodeError as exc:
                        raise ValueError("Upload metadata পড়া যায়নি।") from exc

            if not filename or not temporary_path:
                raise ValueError("একটি ফাইল নির্বাচন করুন।")
            if buffer.startswith(b"\r\n"):
                del buffer[:2]
            while remaining:
                if not read_more():
                    break
            return fields, filename, uploaded_content_type, temporary_path, file_size
        except Exception:
            if temporary_file:
                temporary_file.close()
            if temporary_path:
                Path(temporary_path).unlink(missing_ok=True)
            raise

    def _send_media(self, asset_id):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "মিডিয়া দেখতে লগইন করুন।"})
            return
        asset = self.content_store.get_asset(asset_id)
        if not asset or (
            user["role"] != "ADMIN"
            and (
                asset["category"] != user["educationType"]
                or (
                    asset["purpose"] in {"video", "course-pdf"}
                    and not self._student_can_access_course_asset(user, asset_id)
                )
                or (
                    asset["purpose"] == "cq-answer-sheet"
                    and not self.content_store.is_exam_pdf_owned_by(
                        asset_id, user["id"]
                    )
                )
            )
        ):
            self._send_json(404, {"error": "মিডিয়া ফাইলটি পাওয়া যায়নি।"})
            return
        file_path = (
            self.content_store.upload_directory / asset["stored_name"]
        ).resolve()
        if file_path.parent != self.content_store.upload_directory or not file_path.is_file():
            self._send_json(404, {"error": "মিডিয়া ফাইলটি পাওয়া যায়নি।"})
            return
        file_size = file_path.stat().st_size
        start, end = 0, file_size - 1
        range_header = self.headers.get("Range")
        status = 200
        if range_header:
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
            if not match or not any(match.groups()):
                self._send_json(416, {"error": "মিডিয়া রেঞ্জ সঠিক নয়。"})
                return
            if match.group(1):
                start = int(match.group(1))
                end = min(int(match.group(2)) if match.group(2) else end, end)
            else:
                suffix = int(match.group(2))
                start = max(0, file_size - suffix)
            if start > end or start >= file_size:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{file_size}")
                self.end_headers()
                return
            status = 206
        self.send_response(status)
        self.send_header("Content-Type", asset["content_type"])
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "private, no-store")
        if status == 206:
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.end_headers()
        with file_path.open("rb") as source:
            source.seek(start)
            remaining = end - start + 1
            while remaining:
                chunk = source.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                self.wfile.write(chunk)
                remaining -= len(chunk)

    def _send_brand_logo(self):
        asset_id = self.content_store.get_setting("brand_logo_id")
        asset = self.content_store.get_asset(asset_id) if asset_id else None
        if not asset or asset["purpose"] != "brand-logo":
            self._send_json(404, {"error": "লোগো ফাইলটি পাওয়া যায়নি।"})
            return
        file_path = (
            self.content_store.upload_directory / asset["stored_name"]
        ).resolve()
        if file_path.parent != self.content_store.upload_directory or not file_path.is_file():
            self._send_json(404, {"error": "লোগো ফাইলটি পাওয়া যায়নি।"})
            return
        self.send_response(200)
        self.send_header("Content-Type", asset["content_type"])
        self.send_header("Content-Length", str(file_path.stat().st_size))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        with file_path.open("rb") as source:
            while chunk := source.read(64 * 1024):
                self.wfile.write(chunk)

    def _student_can_access_course_asset(self, user, asset_id):
        enrolled_courses = set(user.get("enrolledCourses", []))
        asset_url = f"/api/media/{asset_id}"
        for course in self.content_store.list_resources(
            "courses", user["educationType"]
        ):
            if course.get("id") not in enrolled_courses:
                continue
            if course.get("previewVideo") == asset_url:
                return True
            chapters = course.get("chapters")
            if not isinstance(chapters, list):
                continue
            for chapter in chapters:
                if not isinstance(chapter, dict):
                    continue
                lessons = chapter.get("lessons")
                if not isinstance(lessons, list):
                    continue
                for lesson in lessons:
                    if not isinstance(lesson, dict):
                        continue
                    if any(
                        lesson.get(field) == asset_url
                        for field in ("videoUrl", "pdfUrl", "notesPdfUrl")
                    ):
                        return True
        return False

    def _update_profile(self, payload):
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
            return
        changes = {
            key: value
            for key, value in payload.items()
            if key in {"name", "mobile", "batchOrTarget"}
        }
        string_fields = {"name", "mobile", "batchOrTarget"}
        list_fields = set()
        invalid_string = any(
            not isinstance(value, str)
            or not value.strip()
            or any(char in value for char in '<>&"')
            or any(ord(char) < 32 for char in value)
            for key, value in changes.items()
            if key in string_fields
        )
        invalid_list = any(
            not isinstance(value, list)
            or len(value) > 5000
            or any(not isinstance(item, str) or len(item) > 200 for item in value)
            for key, value in changes.items()
            if key in list_fields
        )
        invalid_key = any(key not in string_fields | list_fields for key in changes)
        invalid_mobile = (
            "mobile" in changes
            and (
                not isinstance(changes["mobile"], str)
                or not re.fullmatch(
                    r"[0-9+() -]{7,20}", changes["mobile"].strip()
                )
            )
        )
        if not changes or invalid_string or invalid_list or invalid_key or invalid_mobile:
            self._send_json(400, {"error": "প্রোফাইলের তথ্য সঠিক নয়।"})
            return
        try:
            updated = self.auth_store.update_user(user["id"], changes)
        except sqlite3.IntegrityError:
            self._send_json(409, {"error": "এই মোবাইল নম্বরটি আগে থেকেই ব্যবহৃত।"})
            return
        self._send_json(200, {"user": updated})

    def do_GET(self):
        if self.path.startswith("/api/"):
            self._api_get(urlsplit(self.path).path)
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/"):
            self._api_post(urlsplit(self.path).path)
            return
        self._send_json(404, {"error": "পেজ পাওয়া যায়নি।"})

    def do_DELETE(self):
        path = urlsplit(self.path).path
        if not path.startswith("/api/admin/resources/"):
            self._send_json(404, {"error": "API endpoint পাওয়া যায়নি।"})
            return
        if not self._require_same_origin():
            self._send_json(403, {"error": "এই অনুরোধ অনুমোদিত নয়।"})
            return
        user = self._current_user()
        if not user:
            self._send_json(401, {"error": "প্রথমে লগইন করুন।"})
            return
        if user["role"] != "ADMIN":
            self._send_json(403, {"error": "শুধু অ্যাডমিন কন্টেন্ট মুছতে পারবেন।"})
            return
        parts = path.removeprefix("/api/admin/resources/").split("/", 1)
        if len(parts) != 2 or parts[0] not in RESOURCE_TABLES:
            self._send_json(404, {"error": "কন্টেন্টের ধরন পাওয়া যায়নি।"})
            return
        deleted = self.content_store.delete_resource(parts[0], unquote(parts[1]))
        self._send_json(200, {"deleted": deleted})

    def do_HEAD(self):
        path = urlsplit(self.path).path
        if path.startswith("/api/media/"):
            self._send_json(405, {"error": "HEAD অনুরোধ সমর্থিত নয়।"})
            return
        super().do_HEAD()


def create_admin():
    print("নতুন অ্যাডমিন অ্যাকাউন্ট তৈরি করুন।")
    name = input("নাম: ").strip()
    email = input("ইমেইল: ").strip()
    mobile = input("মোবাইল: ").strip()
    password = getpass("পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর; টাইপ করলে দেখা যাবে না): ")
    if len(password) < 6:
        raise SystemExit("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।")
    try:
        user = AUTH_STORE.create_admin(name, email, mobile, password)
    except sqlite3.IntegrityError as exc:
        raise SystemExit("এই ইমেইল বা মোবাইল ইতোমধ্যে ব্যবহৃত।") from exc
    print(f"অ্যাডমিন অ্যাকাউন্ট তৈরি হয়েছে: {user['email']}")


def run():
    parser = argparse.ArgumentParser(description="Geneseon Academy local web server")
    parser.add_argument(
        "--create-admin",
        action="store_true",
        help="Create an administrator account interactively",
    )
    args = parser.parse_args()
    if args.create_admin:
        create_admin()
        return

    host = os.environ.get("JA_HOST", "127.0.0.1")
    os.chdir(DIRECTORY)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer((host, PORT), Handler) as httpd:
        print(f"Geneseon Academy running at http://{host}:{PORT}")
        print(f"Serving from: {DIRECTORY}")
        print(f"Authentication database: {DATABASE_PATH}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")


if __name__ == "__main__":
    run()
