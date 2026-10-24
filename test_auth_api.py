import http.client
import io
import json
import os
import tempfile
import threading
import unittest
import uuid
from http.server import HTTPServer
from pathlib import Path
from unittest.mock import MagicMock, patch

from auth_store import AuthStore
from content_store import ContentStore
from email_service import EmailDeliveryError, ResendEmailService
from pdf_questions import GeminiRateLimitError

SERVER_TEST_DIR = tempfile.TemporaryDirectory()
os.environ["JA_DATABASE_PATH"] = str(
    Path(SERVER_TEST_DIR.name) / f"server-{uuid.uuid4().hex}.sqlite3"
)
from server import Handler, create_admin


class QuietHandler(Handler):
    def log_message(self, _format, *_args):
        pass


class RecordingEmailService:
    def __init__(self):
        self.configured = True
        self.sent = []
        self.error = None

    def send_password_reset(self, recipient, name, token):
        if self.error:
            raise self.error
        self.sent.append((recipient, name, token))


class AuthenticationApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        cls.handler = type(
            "TestHandler",
            (QuietHandler,),
            {
                "auth_store": AuthStore(
                    str(Path(cls.temp_dir.name) / "test.sqlite3")
                ),
                "content_store": ContentStore(
                    str(Path(cls.temp_dir.name) / "test.sqlite3"),
                    str(Path(cls.temp_dir.name) / "uploads"),
                ),
                "login_attempts": {},
                "registration_attempts": {},
                "password_reset_attempts": {},
                "attempts_lock": threading.Lock(),
                "email_service": RecordingEmailService(),
            },
        )
        cls.httpd = HTTPServer(("127.0.0.1", 0), cls.handler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.port = cls.httpd.server_address[1]

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join(timeout=2)
        cls.temp_dir.cleanup()
        SERVER_TEST_DIR.cleanup()

    def request(self, method, path, payload=None, cookie=None, origin=True):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        headers = {}
        if payload is not None:
            headers["Content-Type"] = "application/json"
            body = json.dumps(payload)
        else:
            body = None
        if cookie:
            headers["Cookie"] = cookie
        if origin:
            headers["Origin"] = f"http://127.0.0.1:{self.port}"
        connection.request(method, path, body=body, headers=headers)
        response = connection.getresponse()
        result = json.loads(response.read())
        response_headers = dict(response.getheaders())
        status = response.status
        connection.close()
        return status, result, response_headers

    def request_media(self, path, cookie):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request("GET", path, headers={"Cookie": cookie})
        response = connection.getresponse()
        status = response.status
        body = response.read()
        connection.close()
        return status, body

    def multipart_request(
        self, path, fields, filename, file_data, cookie, file_field="answerSheet"
    ):
        boundary = f"----Geneseon{uuid.uuid4().hex}"
        chunks = []
        for name, value in fields.items():
            chunks.extend([
                f"--{boundary}\r\n".encode(),
                f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
                str(value).encode(),
                b"\r\n",
            ])
        chunks.extend([
            f"--{boundary}\r\n".encode(),
            (
                f'Content-Disposition: form-data; name="{file_field}"; '
                f'filename="{filename}"\r\n'
            ).encode(),
            b"Content-Type: application/pdf\r\n\r\n",
            file_data,
            b"\r\n",
            f"--{boundary}--\r\n".encode(),
        ])
        body = b"".join(chunks)
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(
            "POST",
            path,
            body=body,
            headers={
                "Content-Type": f"multipart/form-data; boundary={boundary}",
                "Content-Length": str(len(body)),
                "Cookie": cookie,
                "Origin": f"http://127.0.0.1:{self.port}",
            },
        )
        response = connection.getresponse()
        result = json.loads(response.read())
        status = response.status
        connection.close()
        return status, result

    def setUp(self):
        with self.handler.attempts_lock:
            self.handler.login_attempts.clear()
            self.handler.registration_attempts.clear()
            self.handler.password_reset_attempts.clear()
            self.handler.email_service.sent.clear()
            self.handler.email_service.error = None
            self.handler.email_service.configured = True

    def register_student(
        self, email="student@example.com", mobile="01700000001",
        education_type="SSC",
    ):
        return self.request(
            "POST",
            "/api/auth/register",
            {
                "name": "Sample Student",
                "email": email,
                "mobile": mobile,
                "password": "correct-horse-1",
                "educationType": education_type,
                "batchOrTarget": "SSC 2026",
            },
        )

    def payment_config(self, bkash_number):
        config = json.loads(
            (Path(__file__).with_name("payment_config.json")).read_text(
                encoding="utf-8"
            )
        )
        config["bkash_number"] = bkash_number
        config_path = Path(self.temp_dir.name) / f"payment-{uuid.uuid4().hex}.json"
        config_path.write_text(
            json.dumps(config, ensure_ascii=False), encoding="utf-8"
        )
        return patch.object(
            self.handler, "payment_config_path", str(config_path)
        )

    def test_register_persists_password_hash_and_starts_session(self):
        email = f"registered-{uuid.uuid4().hex}@example.com"
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        status, result, headers = self.register_student(email=email, mobile=mobile)
        self.assertEqual(status, 201)
        self.assertEqual(result["user"]["role"], "STUDENT")
        self.assertFalse(result["user"]["adminEligible"])
        self.assertNotIn("password", result["user"])
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, current, _ = self.request(
            "GET", "/api/auth/me", cookie=cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(current["user"]["email"], email)
        stored = self.handler.auth_store.authenticate(
            email, "correct-horse-1"
        )
        self.assertEqual(stored["id"], result["user"]["id"])
        with self.handler.auth_store._connect() as connection:
            password_hash = connection.execute(
                "SELECT password_hash FROM users WHERE email = ?",
                (email,),
            ).fetchone()["password_hash"]
        self.assertNotIn("correct-horse-1", password_hash)
        status, _, _ = self.request(
            "POST", "/api/auth/logout", payload={}, cookie=cookie
        )
        self.assertEqual(status, 200)
        status, current, _ = self.request(
            "GET", "/api/auth/me", cookie=cookie, origin=False
        )
        self.assertIsNone(current["user"])

    def test_student_can_log_in_again_with_same_password_after_logout(self):
        email = f"logout-login-{uuid.uuid4().hex}@example.com"
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        status, registration, headers = self.request(
            "POST",
            "/api/auth/register",
            {
                "name": "Returning Student",
                "email": email,
                "mobile": mobile,
                "password": "same-password-1",
                "educationType": "SSC",
                "batchOrTarget": "SSC 2026",
            },
        )
        self.assertEqual(status, 201)
        registration_cookie = headers["Set-Cookie"].split(";", 1)[0]

        status, _, logout_headers = self.request(
            "POST", "/api/auth/logout", payload={}, cookie=registration_cookie
        )
        self.assertEqual(status, 200)
        self.assertIn("Max-Age=0", logout_headers["Set-Cookie"])

        status, result, login_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": email, "password": "same-password-1"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["id"], registration["user"]["id"])
        self.assertEqual(result["user"]["role"], "STUDENT")
        login_cookie = login_headers["Set-Cookie"].split(";", 1)[0]
        self.assertNotEqual(login_cookie, registration_cookie)

    def test_student_can_log_in_after_logout_with_normalized_mobile_formats(self):
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        country_code_mobile = "+880 " + mobile[1:4] + "-" + mobile[4:]
        status, registration, headers = self.request(
            "POST",
            "/api/auth/register",
            {
                "name": "Mobile Format Student",
                "email": f"mobile-format-{uuid.uuid4().hex}@example.com",
                "mobile": country_code_mobile,
                "password": "same-password-1",
                "educationType": "SSC",
                "batchOrTarget": "SSC 2026",
            },
        )
        self.assertEqual(status, 201)
        self.assertEqual(registration["user"]["mobile"], mobile)
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "POST", "/api/auth/logout", payload={}, cookie=cookie
        )
        self.assertEqual(status, 200)

        status, result, login_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": mobile, "password": "same-password-1"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["id"], registration["user"]["id"])
        cookie = login_headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "POST", "/api/auth/logout", payload={}, cookie=cookie
        )
        self.assertEqual(status, 200)

        bangla_mobile = "".join(chr(ord("০") + int(digit)) for digit in mobile)
        status, result, _ = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": bangla_mobile, "password": "same-password-1"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["id"], registration["user"]["id"])

    def test_login_matches_mobile_format_used_by_existing_account(self):
        email = f"legacy-mobile-{uuid.uuid4().hex}@example.com"
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        status, registration, _ = self.request(
            "POST",
            "/api/auth/register",
            {
                "name": "Existing Mobile Student",
                "email": email,
                "mobile": mobile,
                "password": "same-password-1",
                "educationType": "SSC",
                "batchOrTarget": "SSC 2026",
            },
        )
        self.assertEqual(status, 201)
        with self.handler.auth_store._connect() as connection:
            connection.execute(
                "UPDATE users SET mobile = ? WHERE id = ?",
                ("+880 " + mobile[1:4] + "-" + mobile[4:], registration["user"]["id"]),
            )

        status, result, _ = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": mobile, "password": "same-password-1"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["id"], registration["user"]["id"])

    def test_registration_accepts_six_character_password(self):
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        status, result, _ = self.request(
            "POST",
            "/api/auth/register",
            {
                "name": "Six Char Student",
                "email": f"six-char-{uuid.uuid4().hex}@example.com",
                "mobile": mobile,
                "password": "abc123",
                "educationType": "SSC",
                "batchOrTarget": "SSC 2026",
            },
        )
        self.assertEqual(status, 201)
        self.assertEqual(result["user"]["role"], "STUDENT")

    def test_registration_rejects_password_shorter_than_six_characters(self):
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        status, result, _ = self.request(
            "POST",
            "/api/auth/register",
            {
                "name": "Short Password",
                "email": f"short-password-{uuid.uuid4().hex}@example.com",
                "mobile": mobile,
                "password": "abc12",
                "educationType": "SSC",
                "batchOrTarget": "SSC 2026",
            },
        )
        self.assertEqual(status, 400)
        self.assertIn("৬ অক্ষরের", result["error"])

    def test_login_rejects_wrong_password_and_accepts_valid_credentials(self):
        self.register_student(email="login@example.com", mobile="01700000002")
        status, _, _ = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": "login@example.com", "password": "wrong-password"},
        )
        self.assertEqual(status, 401)
        status, result, headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": "login@example.com", "password": "correct-horse-1"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["role"], "STUDENT")
        self.assertIn("HttpOnly", headers["Set-Cookie"])
        self.assertIn("SameSite=Strict", headers["Set-Cookie"])

    def test_failed_logins_for_another_account_do_not_block_student_login(self):
        self.register_student(email="returning@example.com", mobile="01700000024")
        for _ in range(10):
            status, _, _ = self.request(
                "POST",
                "/api/auth/login",
                {"identifier": "other-student@example.com", "password": "wrong"},
            )
            self.assertEqual(status, 401)

        status, _, _ = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": "other-student@example.com", "password": "wrong"},
        )
        self.assertEqual(status, 429)

        status, result, _ = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": "returning@example.com", "password": "correct-horse-1"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["email"], "returning@example.com")

    def test_admin_can_reset_student_password_and_revoke_old_sessions(self):
        _, student, student_headers = self.register_student(
            email=f"reset-student-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        student_cookie = student_headers["Set-Cookie"].split(";", 1)[0]
        admin = self.handler.auth_store.create_admin(
            "Password Admin",
            f"password-admin-{uuid.uuid4().hex}@example.com",
            f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            "admin-password-1",
        )
        _, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": admin["email"], "password": "admin-password-1"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]

        status, _, _ = self.request(
            "POST",
            f"/api/admin/users/{student['user']['id']}/password",
            {"password": "new-student-password"},
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertIsNone(
            self.handler.auth_store.get_session_user(
                student_cookie.partition("=")[2]
            )
        )
        self.assertIsNone(
            self.handler.auth_store.authenticate(
                student["user"]["email"], "correct-horse-1"
            )
        )
        self.assertIsNotNone(
            self.handler.auth_store.authenticate(
                student["user"]["email"], "new-student-password"
            )
        )

    def test_student_cannot_reset_another_students_password(self):
        _, student, headers = self.register_student(
            email=f"reset-denied-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "POST",
            f"/api/admin/users/{student['user']['id']}/password",
            {"password": "new-student-password"},
            cookie=cookie,
        )
        self.assertEqual(status, 403)
        self.assertIsNotNone(
            self.handler.auth_store.authenticate(
                student["user"]["email"], "correct-horse-1"
            )
        )

    def test_password_reset_request_sends_one_time_token_without_disclosing_account(self):
        email = f"mail-reset-{uuid.uuid4().hex}@example.com"
        _, student, _ = self.register_student(email=email)
        status, result, _ = self.request(
            "POST",
            "/api/auth/password-reset/request",
            {"email": email},
        )
        self.assertEqual(status, 200)
        self.assertIn("অ্যাকাউন্ট থাকলে", result["message"])
        self.assertEqual(len(self.handler.email_service.sent), 1)
        sent_email, sent_name, token = self.handler.email_service.sent[0]
        self.assertEqual(sent_email, email)
        self.assertEqual(sent_name, student["user"]["name"])
        self.assertGreaterEqual(len(token), 40)
        with self.handler.auth_store._connect() as connection:
            stored_token = connection.execute(
                "SELECT token_hash FROM password_reset_tokens WHERE user_id = ?",
                (student["user"]["id"],),
            ).fetchone()["token_hash"]
        self.assertNotEqual(stored_token, token)

        status, unknown, _ = self.request(
            "POST",
            "/api/auth/password-reset/request",
            {"email": f"missing-{uuid.uuid4().hex}@example.com"},
        )
        self.assertEqual(status, 200)
        self.assertEqual(unknown, result)
        self.assertEqual(len(self.handler.email_service.sent), 1)

    def test_password_reset_token_changes_password_once_and_revokes_sessions(self):
        email = f"complete-reset-{uuid.uuid4().hex}@example.com"
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        _, student, headers = self.register_student(email=email, mobile=mobile)
        old_session = headers["Set-Cookie"].split(";", 1)[0].partition("=")[2]
        status, _, _ = self.request(
            "POST",
            "/api/auth/password-reset/request",
            {"email": email},
        )
        self.assertEqual(status, 200)
        token = self.handler.email_service.sent[0][2]
        status, result, _ = self.request(
            "POST",
            "/api/auth/password-reset/complete",
            {"token": token, "password": "new-reset-password"},
        )
        self.assertEqual(status, 200)
        self.assertIsNone(self.handler.auth_store.get_session_user(old_session))
        self.assertIsNone(self.handler.auth_store.authenticate(email, "correct-horse-1"))
        self.assertIsNotNone(
            self.handler.auth_store.authenticate(email, "new-reset-password")
        )
        status, _, _ = self.request(
            "POST",
            "/api/auth/password-reset/complete",
            {"token": token, "password": "another-password"},
        )
        self.assertEqual(status, 400)
        self.assertEqual(student["user"]["email"], email)

    def test_password_reset_rejects_expired_token(self):
        email = f"expired-reset-{uuid.uuid4().hex}@example.com"
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        _, student, _ = self.register_student(email=email, mobile=mobile)
        self.request(
            "POST",
            "/api/auth/password-reset/request",
            {"email": email},
        )
        token = self.handler.email_service.sent[0][2]
        with self.handler.auth_store._connect() as connection:
            connection.execute(
                "UPDATE password_reset_tokens SET expires_at = ? WHERE user_id = ?",
                ("2000-01-01T00:00:00+00:00", student["user"]["id"]),
            )
        status, _, _ = self.request(
            "POST",
            "/api/auth/password-reset/complete",
            {"token": token, "password": "new-reset-password"},
        )
        self.assertEqual(status, 400)
        self.assertIsNotNone(
            self.handler.auth_store.authenticate(email, "correct-horse-1")
        )

    def test_password_reset_requires_resend_configuration_and_cleans_up_on_send_failure(self):
        self.handler.email_service.configured = False
        status, _, _ = self.request(
            "POST",
            "/api/auth/password-reset/request",
            {"email": "not-configured@example.com"},
        )
        self.assertEqual(status, 503)

        self.handler.email_service.configured = True
        self.handler.email_service.error = EmailDeliveryError("Resend unavailable")
        email = f"failed-reset-{uuid.uuid4().hex}@example.com"
        mobile = f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}"
        _, student, _ = self.register_student(email=email, mobile=mobile)
        with patch("server.LOGGER.warning"):
            status, _, _ = self.request(
                "POST",
                "/api/auth/password-reset/request",
                {"email": email},
            )
        self.assertEqual(status, 503)
        with self.handler.auth_store._connect() as connection:
            stored = connection.execute(
                "SELECT 1 FROM password_reset_tokens WHERE user_id = ?",
                (student["user"]["id"],),
            ).fetchone()
        self.assertIsNone(stored)

    def test_resend_email_service_uses_secret_header_and_reset_link(self):
        response = MagicMock()
        response.status = 200
        response.read.return_value = b'{"id":"email-id"}'
        response.__enter__.return_value = response
        response.__exit__.return_value = False
        with patch.dict(
            os.environ,
            {
                "RESEND_API_KEY": "test-secret-key",
                "JA_EMAIL_FROM": "Geneseon Academy <no-reply@example.test>",
                "JA_PUBLIC_BASE_URL": "https://academy.example.test",
            },
        ), patch("email_service.urlopen", return_value=response) as send:
            ResendEmailService().send_password_reset(
                "student@example.test", "Test Student", "one-time-token"
            )
        request = send.call_args.args[0]
        body = json.loads(request.data)
        self.assertEqual(request.full_url, "https://api.resend.com/emails")
        self.assertEqual(request.get_header("Authorization"), "Bearer test-secret-key")
        self.assertEqual(body["to"], ["student@example.test"])
        self.assertIn(
            "https://academy.example.test/#/reset-password?token=one-time-token",
            body["text"],
        )
        self.assertIn("expires in 30 minutes", body["text"])

    def test_public_registration_cannot_assign_admin_role(self):
        status, result, _ = self.request(
            "POST",
            "/api/auth/register",
            {
                "name": "Attacker",
                "email": "attacker@example.com",
                "mobile": "01700000003",
                "password": "correct-horse-1",
                "educationType": "SSC",
                "batchOrTarget": "SSC",
                "role": "ADMIN",
            },
        )
        self.assertEqual(status, 201)
        self.assertEqual(result["user"]["role"], "STUDENT")

    def test_student_cannot_change_education_category_after_registration(self):
        status, result, headers = self.register_student(
            email="fixed-category@example.com",
            mobile="01700000006",
        )
        self.assertEqual(status, 201)
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "POST",
            "/api/auth/profile",
            {"educationType": "HSC"},
            cookie=cookie,
        )
        self.assertEqual(status, 400)
        status, current, _ = self.request(
            "GET", "/api/auth/me", cookie=cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(current["user"]["educationType"], "SSC")

    def test_students_cannot_access_admin_data_or_change_managed_content(self):
        status, _, headers = self.register_student(
            email="content-student@example.com",
            mobile="01700000007",
        )
        self.assertEqual(status, 201)
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "GET", "/api/admin/state", cookie=cookie, origin=False
        )
        self.assertEqual(status, 403)
        status, _, _ = self.request(
            "POST",
            "/api/admin/resources/courses",
            {"id": "unauthorized", "category": "SSC", "title": "No"},
            cookie=cookie,
        )
        self.assertEqual(status, 403)

    def test_predefined_admin_can_switch_own_account_between_modes(self):
        admin = self.handler.auth_store.create_admin(
            "Role Manager", "role-manager@example.com", "01700000021", "manager-pass-1"
        )
        _, _, admin_headers = self.request(
            "POST", "/api/auth/login",
            {"identifier": admin["email"], "password": "manager-pass-1"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        status, result, switch_headers = self.request(
            "POST",
            "/api/auth/admin-mode",
            {
                "role": "STUDENT",
                "educationType": "HSC",
                "batchOrTarget": "HSC 2027",
            },
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["role"], "STUDENT")
        self.assertEqual(result["user"]["educationType"], "HSC")
        self.assertTrue(result["user"]["adminEligible"])
        student_cookie = switch_headers["Set-Cookie"].split(";", 1)[0]
        self.assertNotEqual(student_cookie, admin_cookie)
        status, state, _ = self.request(
            "GET", "/api/auth/me", cookie=admin_cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertIsNone(state["user"])

        status, session, _ = self.request(
            "GET", "/api/auth/me", cookie=student_cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(session["user"]["role"], "STUDENT")
        status, result, admin_headers = self.request(
            "POST",
            "/api/auth/admin-mode",
            {"role": "ADMIN", "password": "manager-pass-1"},
            cookie=student_cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(result["user"]["role"], "ADMIN")
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        status, session, _ = self.request(
            "GET", "/api/auth/me", cookie=admin_cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(session["user"]["role"], "ADMIN")

    def test_regular_student_cannot_switch_to_admin_mode(self):
        _, student, headers = self.register_student(
            email=f"role-student-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "POST",
            "/api/auth/admin-mode",
            {"role": "ADMIN", "password": "correct-horse-1"},
            cookie=cookie,
        )
        self.assertEqual(status, 403)
        self.assertFalse(student["user"]["adminEligible"])

    def test_admin_mode_requires_correct_password(self):
        admin = self.handler.auth_store.create_admin(
            "Self Role", "self-role@example.com", "01700000022", "self-role-pass-1"
        )
        _, _, headers = self.request(
            "POST", "/api/auth/login",
            {"identifier": admin["email"], "password": "self-role-pass-1"},
        )
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, result, switch_headers = self.request(
            "POST",
            "/api/auth/admin-mode",
            {
                "role": "STUDENT",
                "educationType": "SSC",
                "batchOrTarget": "SSC 2026",
            },
            cookie=cookie,
        )
        self.assertEqual(status, 200)
        student_cookie = switch_headers["Set-Cookie"].split(";", 1)[0]
        status, result, switch_headers = self.request(
            "POST",
            "/api/auth/admin-mode",
            {"role": "ADMIN", "password": "incorrect-pass"},
            cookie=student_cookie,
        )
        self.assertEqual(status, 403)
        self.assertIn("সঠিক পাসওয়ার্ড", result["error"])

    def test_admin_mode_rejects_invalid_role_payload(self):
        admin = self.handler.auth_store.create_admin(
            "Invalid Role", "invalid-role@example.com", "01700000023", "invalid-role-pass-1"
        )
        _, _, headers = self.request(
            "POST", "/api/auth/login",
            {"identifier": admin["email"], "password": "invalid-role-pass-1"},
        )
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "POST",
            "/api/auth/admin-mode",
            {"role": ["ADMIN"]},
            cookie=cookie,
        )
        self.assertEqual(status, 400)

    def test_student_content_scopes_courses_exams_and_questions_to_own_category(self):
        self.handler.auth_store.create_admin(
            "Content Admin", "content-admin@example.com", "01700000008", "admin-password-2"
        )
        status, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": "content-admin@example.com", "password": "admin-password-2"},
        )
        self.assertEqual(status, 200)
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        resource = {"id": "server-course-hsc", "category": "HSC", "title": "HSC Physics"}
        status, _, _ = self.request(
            "POST",
            "/api/admin/resources/courses",
            resource,
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        status, state, _ = self.request(
            "GET", "/api/admin/state", cookie=admin_cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(state["courses"][0]["id"], resource["id"])

        question_resource = {
            "id": "server-question-job",
            "category": "JOB",
            "subject": "BCS Preliminary",
            "chapter": "বাংলাদেশ বিষয়াবলী",
            "text": "প্রশ্ন",
        }
        ssc_question = {
            "id": "server-question-ssc",
            "category": "SSC",
            "subject": "Physics",
            "chapter": "Measurement",
            "text": "SSC প্রশ্ন",
        }
        hsc_question = {
            "id": "server-question-hsc",
            "category": "HSC",
            "subject": "Physics",
            "chapter": "Waves",
            "text": "HSC প্রশ্ন",
        }
        status, _, _ = self.request(
            "POST",
            "/api/admin/resources/questions",
            question_resource,
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        status, _, _ = self.request(
            "POST",
            "/api/admin/resources/questions",
            ssc_question,
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        status, _, _ = self.request(
            "POST",
            "/api/admin/resources/questions",
            hsc_question,
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)

        status, _, student_headers = self.register_student(
            email="content-hsc@example.com",
            mobile="01700000009",
            education_type="HSC",
        )
        self.assertEqual(status, 201)
        student_cookie = student_headers["Set-Cookie"].split(";", 1)[0]
        status, content, _ = self.request(
            "GET", "/api/content", cookie=student_cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(
            {item["category"] for item in content["courses"]},
            {"HSC"},
        )
        self.assertEqual(
            {item["category"] for item in content["questions"]},
            {"HSC"},
        )
        self.assertIn(
            hsc_question["id"],
            [item["id"] for item in content["questions"]],
        )
        self.assertNotIn(
            question_resource["id"],
            [item["id"] for item in content["questions"]],
        )
        self.assertNotIn(
            ssc_question["id"],
            [item["id"] for item in content["questions"]],
        )
        status, _, ssc_headers = self.register_student(
            email="content-ssc-scope@example.com",
            mobile="01700000029",
            education_type="SSC",
        )
        self.assertEqual(status, 201)
        ssc_cookie = ssc_headers["Set-Cookie"].split(";", 1)[0]
        status, ssc_content, _ = self.request(
            "GET", "/api/content", cookie=ssc_cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(
            {item["category"] for item in ssc_content["questions"]},
            {"SSC"},
        )
        status, students, _ = self.request(
            "GET", "/api/admin/state", cookie=admin_cookie, origin=False
        )
        self.assertEqual(status, 200)
        registered = next(
            user for user in students["students"]
            if user["email"] == "content-hsc@example.com"
        )
        self.assertIsNotNone(registered["lastLoginAt"])

    def test_manual_bkash_order_waits_for_admin_approval_before_enrollment(self):
        email = f"manual-bkash-{uuid.uuid4().hex}@example.com"
        status, registration, headers = self.register_student(
            email=email,
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        self.assertEqual(status, 201)
        student_cookie = headers["Set-Cookie"].split(";", 1)[0]
        student_id = registration["user"]["id"]
        video_data = b"\x00\x00\x00\x18ftypisom"
        video_asset, _ = self.handler.content_store.store_upload_stream(
            io.BytesIO(video_data),
            len(video_data),
            f"locked-course-{uuid.uuid4().hex}.mp4",
            "video/mp4",
            "SSC",
            "video",
        )
        course = {
            "id": f"manual-course-{uuid.uuid4().hex}",
            "category": "SSC",
            "title": "Manual payment test course",
            "price": 1250,
            "previewVideo": video_asset["url"],
            "chapters": [{
                "title": "Chapter 1",
                "lessons": [{
                    "id": f"lesson-{uuid.uuid4().hex}",
                    "videoUrl": video_asset["url"],
                }],
            }],
        }
        self.handler.content_store.save_resource("courses", course)
        status, _ = self.request_media(video_asset["url"], student_cookie)
        self.assertEqual(status, 404, "Course media must remain locked before approval.")
        order_payload = {
            "items": [{"id": course["id"], "type": "course", "quantity": 1}],
            "senderMobile": "01800000001",
            "transactionId": f"TRX{uuid.uuid4().hex[:10]}",
        }
        with self.payment_config("01700000000"):
            status, payment_info, _ = self.request(
                "GET", "/api/payment-info", origin=False
            )
            self.assertEqual(status, 200)
            self.assertTrue(payment_info["bkashConfigured"])

            status, submitted, _ = self.request(
                "POST", "/api/orders", order_payload, cookie=student_cookie
            )
            self.assertEqual(status, 201)
            self.assertEqual(submitted["order"]["totalAmount"], 1250)
            self.assertEqual(submitted["order"]["status"], "pending")
            self.assertNotIn(
                course["id"],
                self.handler.auth_store.get_user(student_id)["enrolledCourses"],
            )

            status, _, _ = self.request(
                "POST", "/api/orders", order_payload, cookie=student_cookie
            )
            self.assertEqual(status, 409)

        admin = self.handler.auth_store.create_admin(
            "Payment Reviewer",
            f"payment-reviewer-{uuid.uuid4().hex}@example.com",
            f"016{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            "payment-reviewer-pass-1",
        )
        _, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": admin["email"], "password": "payment-reviewer-pass-1"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        status, state, _ = self.request(
            "GET", "/api/admin/state", cookie=admin_cookie, origin=False
        )
        self.assertEqual(status, 200)
        self.assertEqual(state["paymentOrders"][0]["status"], "pending")

        status, reviewed, _ = self.request(
            "POST",
            f"/api/admin/orders/{submitted['order']['id']}/review",
            {"status": "approved"},
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(reviewed["order"]["status"], "approved")
        self.assertIn(
            course["id"],
            self.handler.auth_store.get_user(student_id)["enrolledCourses"],
        )
        status, media = self.request_media(video_asset["url"], student_cookie)
        self.assertEqual(status, 200)
        self.assertEqual(media, video_data)

    def test_free_coupon_course_stays_locked_until_admin_approval(self):
        _, registration, headers = self.register_student(
            email=f"free-coupon-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        student_id = registration["user"]["id"]
        student_cookie = headers["Set-Cookie"].split(";", 1)[0]
        course = {
            "id": f"free-course-{uuid.uuid4().hex}",
            "category": "SSC",
            "title": "Free coupon test course",
            "price": 500,
        }
        self.handler.content_store.save_resource("courses", course)

        with patch(
            "server.load_payment_config",
            return_value={
                "bkashNumber": "01700000000",
                "coupons": {"FREE100": {"discountPercent": 100}},
            },
        ):
            status, submitted, _ = self.request(
                "POST",
                "/api/orders",
                {
                    "items": [{"id": course["id"], "type": "course"}],
                    "couponCode": "FREE100",
                },
                cookie=student_cookie,
            )
        self.assertEqual(status, 201)
        self.assertEqual(submitted["order"]["status"], "pending")
        self.assertNotIn(
            course["id"],
            self.handler.auth_store.get_user(student_id)["enrolledCourses"],
        )

        admin = self.handler.auth_store.create_admin(
            "Free Coupon Reviewer",
            f"free-reviewer-{uuid.uuid4().hex}@example.com",
            f"016{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            "free-reviewer-pass-1",
        )
        _, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": admin["email"], "password": "free-reviewer-pass-1"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        status, reviewed, _ = self.request(
            "POST",
            f"/api/admin/orders/{submitted['order']['id']}/review",
            {"status": "approved"},
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(reviewed["order"]["status"], "approved")
        self.assertIn(
            course["id"],
            self.handler.auth_store.get_user(student_id)["enrolledCourses"],
        )

    def test_coupon_discount_is_server_calculated_for_manual_course_orders(self):
        email = f"coupon-student-{uuid.uuid4().hex}@example.com"
        status, registration, headers = self.register_student(
            email=email,
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        self.assertEqual(status, 201)
        student_cookie = headers["Set-Cookie"].split(";", 1)[0]
        student_id = registration["user"]["id"]
        suffix = uuid.uuid4().hex
        jahid_course = {
            "id": f"jahid-course-{suffix}",
            "category": "SSC",
            "title": "Jahidsir91 discount course",
            "price": 1200,
        }
        discounted_course = {
            "id": f"discount-course-{suffix}",
            "category": "SSC",
            "title": "Coupon discount course",
            "price": 2000,
        }
        self.handler.content_store.save_resource("courses", jahid_course)
        self.handler.content_store.save_resource("courses", discounted_course)

        with self.payment_config("01700000000"):
            status, jahid_result, _ = self.request(
                "POST",
                "/api/orders",
                {
                    "items": [{
                        "id": jahid_course["id"], "type": "course", "quantity": 1
                    }],
                    "couponCode": "Jahidsir91",
                    "senderMobile": "01800000001",
                    "transactionId": f"JAHID{suffix[:10]}",
                },
                cookie=student_cookie,
            )
            self.assertEqual(status, 201)
            self.assertEqual(jahid_result["order"]["discount"], 1188)
            self.assertEqual(jahid_result["order"]["totalAmount"], 12)
            self.assertEqual(jahid_result["order"]["status"], "pending")
        self.assertNotIn(
            jahid_course["id"],
            self.handler.auth_store.get_user(student_id)["enrolledCourses"],
            msg="A 99% coupon must not grant course access before payment approval.",
        )

        with self.payment_config("01700000000"):
            status, paid_result, _ = self.request(
                "POST",
                "/api/orders",
                {
                    "items": [{
                        "id": discounted_course["id"],
                        "type": "course",
                        "quantity": 1,
                    }],
                    "couponCode": "GENESEON50",
                    "senderMobile": "01800000001",
                    "transactionId": f"TRX{suffix[:10]}",
                },
                cookie=student_cookie,
            )
            self.assertEqual(status, 201)
            self.assertEqual(paid_result["order"]["subtotal"], 2000)
            self.assertEqual(paid_result["order"]["discount"], 600)
            self.assertEqual(paid_result["order"]["totalAmount"], 1400)

            status, invalid_result, _ = self.request(
                "POST",
                "/api/orders",
                {
                    "items": [{
                        "id": discounted_course["id"],
                        "type": "course",
                        "quantity": 1,
                    }],
                    "couponCode": "NOT-A-COUPON",
                    "senderMobile": "01800000001",
                    "transactionId": f"TRX{suffix[10:20]}",
                },
                cookie=student_cookie,
            )
            self.assertEqual(status, 400)
            self.assertIn("কুপন", invalid_result["error"])

    def test_payment_configuration_file_controls_checkout_number_and_coupon_rates(self):
        _, _, headers = self.register_student(
            email=f"payment-config-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        student_cookie = headers["Set-Cookie"].split(";", 1)[0]
        course = {
            "id": f"config-course-{uuid.uuid4().hex}",
            "category": "SSC",
            "title": "Payment configuration test course",
            "price": 2000,
        }
        self.handler.content_store.save_resource("courses", course)
        config = json.loads(
            (Path(__file__).with_name("payment_config.json")).read_text(
                encoding="utf-8"
            )
        )
        config["bkash_number"] = "01900000000"
        config["coupons"]["CUSTOM25"] = {"discountPercent": 25}
        config_path = Path(self.temp_dir.name) / f"payment-{uuid.uuid4().hex}.json"
        config_path.write_text(
            json.dumps(config, ensure_ascii=False), encoding="utf-8"
        )
        with patch.object(self.handler, "payment_config_path", str(config_path)):
            status, info, _ = self.request(
                "GET", "/api/payment-info", origin=False
            )
            self.assertEqual(status, 200)
            self.assertEqual(info["bkashNumber"], "01900000000")
            self.assertEqual(info["coupons"]["CUSTOM25"]["discountPercent"], 25)

            status, result, _ = self.request(
                "POST",
                "/api/orders",
                {
                    "items": [{"id": course["id"], "type": "course", "quantity": 1}],
                    "couponCode": "CUSTOM25",
                    "senderMobile": "01800000001",
                    "transactionId": f"CFG{uuid.uuid4().hex[:10]}",
                },
                cookie=student_cookie,
            )
        self.assertEqual(status, 201)
        self.assertEqual(result["order"]["discount"], 500)
        self.assertEqual(result["order"]["totalAmount"], 1500)

    def test_digital_pdf_order_unlocks_product_after_admin_confirmation_and_products_edit(self):
        _, student, student_headers = self.register_student(
            email=f"pdf-order-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        student_cookie = student_headers["Set-Cookie"].split(";", 1)[0]
        student_id = student["user"]["id"]
        product = next(
            product for product in self.handler.content_store.list_resources("products")
            if product["id"] == "prod_ssc_pdf"
        )
        updated_product = {**product, "price": 125}

        admin = self.handler.auth_store.create_admin(
            "Store Editor",
            f"store-editor-{uuid.uuid4().hex}@example.com",
            f"016{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            "store-editor-pass-1",
        )
        admin_cookie = f"ja_session={self.handler.auth_store.create_session(admin['id'])}"
        status, saved, _ = self.request(
            "POST",
            "/api/admin/resources/products",
            updated_product,
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(saved["resource"]["price"], 125)

        with self.payment_config("01700000000"):
            status, submitted, _ = self.request(
                "POST",
                "/api/orders",
                {
                    "items": [{
                        "id": product["id"], "type": "digital", "quantity": 1
                    }],
                    "senderMobile": "01800000001",
                    "transactionId": f"PDF{uuid.uuid4().hex[:10]}",
                },
                cookie=student_cookie,
            )
        self.assertEqual(status, 201)
        self.assertEqual(submitted["order"]["items"][0]["price"], 125)
        self.assertNotIn(
            product["id"],
            self.handler.auth_store.get_user(student_id)["unlockedProducts"],
        )

        status, reviewed, _ = self.request(
            "POST",
            f"/api/admin/orders/{submitted['order']['id']}/review",
            {"status": "approved"},
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(reviewed["order"]["status"], "approved")
        self.assertIn(
            product["id"],
            self.handler.auth_store.get_user(student_id)["unlockedProducts"],
        )

    def test_cq_exam_submission_pdf_privacy_and_admin_grading(self):
        _, student, student_headers = self.register_student(
            email=f"cq-student-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        student_cookie = student_headers["Set-Cookie"].split(";", 1)[0]
        _, _, other_headers = self.register_student(
            email=f"cq-other-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        other_cookie = other_headers["Set-Cookie"].split(";", 1)[0]
        admin = self.handler.auth_store.create_admin(
            "CQ Reviewer",
            f"cq-reviewer-{uuid.uuid4().hex}@example.com",
            f"018{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            "reviewer-password",
        )
        admin_cookie = f"ja_session={self.handler.auth_store.create_session(admin['id'])}"

        suffix = uuid.uuid4().hex
        mcq = {
            "id": f"cq-mcq-{suffix}", "category": "SSC", "subject": "Math",
            "chapter": "Algebra", "questionType": "MCQ", "text": "2 + 2 = ?",
            "options": ["4", "3"], "correctIndex": 0,
        }
        cq = {
            "id": f"cq-question-{suffix}", "category": "SSC", "subject": "Math",
            "chapter": "Algebra", "questionType": "CQ", "stimulus": "উদ্দীপক",
            "parts": [{"label": "ক", "question": "প্রশ্ন"}],
        }
        exam = {
            "id": f"cq-exam-{suffix}", "category": "SSC", "title": "Mixed CQ Test",
            "questionIds": [mcq["id"], cq["id"]], "totalMarks": 6,
            "durationMinutes": 60, "negativeMarking": 0.25,
        }
        self.handler.content_store.save_resource("questions", mcq)
        self.handler.content_store.save_resource("questions", cq)
        self.handler.content_store.save_resource("exams", exam)

        status, missing_pdf = self.multipart_request(
            f"/api/exams/{exam['id']}/attempts",
            {"answers": json.dumps({mcq["id"]: 1}), "timeTaken": "05:12"},
            "",
            b"",
            student_cookie,
        )
        self.assertEqual(status, 400)
        self.assertIn("PDF আপলোড", missing_pdf["error"])

        status, submitted = self.multipart_request(
            f"/api/exams/{exam['id']}/attempts",
            {"answers": json.dumps({mcq["id"]: 1}), "timeTaken": "05:12"},
            "answer-sheet.pdf",
            b"%PDF-1.4\r\nstudent answer sheet",
            student_cookie,
        )
        self.assertEqual(status, 201)
        attempt = submitted["attempt"]
        self.assertEqual(attempt["cqStatus"], "pending")
        self.assertEqual(attempt["mcqScore"], 0)
        self.assertEqual(attempt["cqMaxMarks"], 5)
        self.assertEqual(attempt["timeTaken"], "05:12")

        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request("GET", attempt["cqPdfUrl"], headers={"Cookie": other_cookie})
        response = connection.getresponse()
        self.assertEqual(response.status, 404)
        response.read()
        connection.close()

        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request("GET", attempt["cqPdfUrl"], headers={"Cookie": student_cookie})
        response = connection.getresponse()
        self.assertEqual(response.status, 200)
        self.assertEqual(response.read(), b"%PDF-1.4\r\nstudent answer sheet")
        connection.close()

        status, _, _ = self.request(
            "GET", f"/api/exam-attempts/{attempt['id']}", cookie=other_cookie
        )
        self.assertEqual(status, 404)
        status, _, _ = self.request(
            "POST",
            f"/api/admin/exam-attempts/{attempt['id']}/grade",
            {"cqScore": 3, "feedback": ""},
            cookie=student_cookie,
        )
        self.assertEqual(status, 403)

        status, graded, _ = self.request(
            "POST",
            f"/api/admin/exam-attempts/{attempt['id']}/grade",
            {"cqScore": 3.5, "feedback": "ভালো হয়েছে"},
            cookie=admin_cookie,
        )
        self.assertEqual(status, 200)
        self.assertEqual(graded["attempt"]["score"], 3.5)
        self.assertEqual(graded["attempt"]["percentage"], 58)
        self.assertEqual(graded["attempt"]["cqStatus"], "reviewed")

        status, stored, _ = self.request(
            "GET", f"/api/exam-attempts/{attempt['id']}", cookie=student_cookie
        )
        self.assertEqual(status, 200)
        self.assertEqual(stored["attempt"]["cqFeedback"], "ভালো হয়েছে")
        self.assertEqual(stored["attempt"]["userId"], student["user"]["id"])

    def test_admin_uploaded_video_is_private_and_category_restricted(self):
        self.handler.auth_store.create_admin(
            "Upload Admin", "upload-admin@example.com", "01700000010", "admin-password-3"
        )
        _, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": "upload-admin@example.com", "password": "admin-password-3"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        boundary = "test-boundary"
        body = (
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"category\"\r\n\r\nHSC\r\n"
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"purpose\"\r\n\r\nvideo\r\n"
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"lesson.mp4\"\r\n"
            "Content-Type: video/mp4\r\n\r\n"
        ).encode() + b"\x00\x00\x00\x18ftypisom" + f"\r\n--{boundary}--\r\n".encode()
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(
            "POST", "/api/admin/upload", body=body,
            headers={
                "Cookie": admin_cookie,
                "Origin": f"http://127.0.0.1:{self.port}",
                "Content-Type": f"multipart/form-data; boundary={boundary}",
            },
        )
        response = connection.getresponse()
        result = json.loads(response.read())
        self.assertEqual(response.status, 201)
        connection.close()

        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request("GET", result["asset"]["url"], headers={"Cookie": admin_cookie})
        response = connection.getresponse()
        self.assertEqual(response.status, 200)
        self.assertTrue(response.read().startswith(b"\x00\x00\x00\x18ftypisom"))
        connection.close()

        _, _, student_headers = self.register_student(
            email="media-ssc@example.com",
            mobile="01700000011",
        )
        student_cookie = student_headers["Set-Cookie"].split(";", 1)[0]
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request("GET", result["asset"]["url"], headers={"Cookie": student_cookie})
        response = connection.getresponse()
        self.assertEqual(response.status, 404)
        connection.close()

    def test_admin_can_upload_chapter_pdf_and_students_are_category_restricted(self):
        email = f"course-pdf-admin-{uuid.uuid4().hex}@example.com"
        self.handler.auth_store.create_admin(
            "Course PDF Admin", email, "01700000012", "admin-password-4"
        )
        _, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": email, "password": "admin-password-4"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        pdf_data = b"%PDF-1.4\n% chapter handout\n"
        status, result = self.multipart_request(
            "/api/admin/upload",
            {"category": "HSC", "purpose": "course-pdf"},
            "chapter-notes.pdf",
            pdf_data,
            admin_cookie,
            file_field="file",
        )
        self.assertEqual(status, 201)
        self.assertEqual(result["asset"]["purpose"], "course-pdf")

        _, _, ssc_headers = self.register_student(
            email=f"course-pdf-ssc-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        ssc_cookie = ssc_headers["Set-Cookie"].split(";", 1)[0]
        status, _, _ = self.request(
            "GET", result["asset"]["url"], cookie=ssc_cookie, origin=False
        )
        self.assertEqual(status, 404)

        _, hsc_registration, hsc_headers = self.register_student(
            email=f"course-pdf-hsc-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            education_type="HSC",
        )
        hsc_cookie = hsc_headers["Set-Cookie"].split(";", 1)[0]
        course = {
            "id": f"hsc-pdf-course-{uuid.uuid4().hex}",
            "category": "HSC",
            "title": "HSC PDF access test",
            "price": 500,
            "chapters": [{
                "title": "Chapter 1",
                "lessons": [{"id": "lesson-1", "pdfUrl": result["asset"]["url"]}],
            }],
        }
        self.handler.content_store.save_resource("courses", course)
        self.handler.auth_store.update_user(
            hsc_registration["user"]["id"],
            {"enrolledCourses": [course["id"]]},
        )
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request("GET", result["asset"]["url"], headers={"Cookie": hsc_cookie})
        response = connection.getresponse()
        self.assertEqual(response.status, 200)
        self.assertEqual(response.read(), pdf_data)
        connection.close()

    def test_course_upload_size_limits_allow_5gb_video_and_cap_pdfs_at_100mb(self):
        video_header = b"\x00\x00\x00\x18ftypisom"
        with self.assertRaisesRegex(ValueError, "৫ GB"):
            self.handler.content_store.store_upload_stream(
                io.BytesIO(video_header),
                5 * 1024 * 1024 * 1024 + 1,
                "large-lecture.mp4",
                "video/mp4",
                "SSC",
                "video",
            )

        with self.assertRaisesRegex(ValueError, "১০০ MB"):
            self.handler.content_store.store_upload_stream(
                io.BytesIO(b"%PDF-1.4"),
                100 * 1024 * 1024 + 1,
                "large-notes.pdf",
                "application/pdf",
                "SSC",
                "course-pdf",
            )

    def test_admin_question_image_upload_is_private_and_validated(self):
        email = f"question-image-admin-{uuid.uuid4().hex}@example.com"
        self.handler.auth_store.create_admin(
            "Question Image Admin", email, "01700000013", "admin-password-5"
        )
        _, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": email, "password": "admin-password-5"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        image_bytes = b"\x89PNG\r\n\x1a\n" + b"sample-image-data"
        status, result = self.multipart_request(
            "/api/admin/upload",
            {"category": "SSC", "purpose": "question-image"},
            "mcq-diagram.png",
            image_bytes,
            admin_cookie,
            file_field="file",
        )
        self.assertEqual(status, 201)
        self.assertEqual(result["asset"]["purpose"], "question-image")
        self.assertEqual(result["asset"]["category"], "SSC")

        _, _, student_headers = self.register_student(
            email=f"question-image-ssc-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
        )
        student_cookie = student_headers["Set-Cookie"].split(";", 1)[0]
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(
            "GET", result["asset"]["url"], headers={"Cookie": student_cookie}
        )
        response = connection.getresponse()
        self.assertEqual(response.status, 200)
        self.assertEqual(response.read(), image_bytes)
        connection.close()

        _, _, hsc_headers = self.register_student(
            email=f"question-image-hsc-{uuid.uuid4().hex}@example.com",
            mobile=f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            education_type="HSC",
        )
        hsc_cookie = hsc_headers["Set-Cookie"].split(";", 1)[0]
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(
            "GET", result["asset"]["url"], headers={"Cookie": hsc_cookie}
        )
        response = connection.getresponse()
        self.assertEqual(response.status, 404)
        connection.close()

        with self.assertRaisesRegex(ValueError, "PNG, JPEG বা WebP"):
            self.handler.content_store.store_upload(
                b"not an image",
                "broken.png",
                "image/png",
                "SSC",
                "question-image",
            )

    def test_admin_can_upload_public_site_logo_and_branding_is_saved(self):
        admin_email = f"branding-{uuid.uuid4().hex}@example.com"
        self.handler.auth_store.create_admin(
            "Branding Admin", admin_email, "01700000018", "admin-password-3"
        )
        _, _, admin_headers = self.request(
            "POST",
            "/api/auth/login",
            {"identifier": admin_email, "password": "admin-password-3"},
        )
        admin_cookie = admin_headers["Set-Cookie"].split(";", 1)[0]
        boundary = "brand-logo-boundary"
        image_bytes = b"\x89PNG\r\n\x1a\n" + b"test-image"
        body = (
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"purpose\"\r\n\r\nbrand-logo\r\n"
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"logo.png\"\r\n"
            "Content-Type: image/png\r\n\r\n"
        ).encode() + image_bytes + f"\r\n--{boundary}--\r\n".encode()
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(
            "POST",
            "/api/admin/upload",
            body=body,
            headers={
                "Cookie": admin_cookie,
                "Origin": f"http://127.0.0.1:{self.port}",
                "Content-Type": f"multipart/form-data; boundary={boundary}",
            },
        )
        response = connection.getresponse()
        result = json.loads(response.read())
        self.assertEqual(response.status, 201)
        connection.close()

        status, branding, _ = self.request("GET", "/api/branding", origin=False)
        self.assertEqual(status, 200)
        self.assertEqual(branding["siteName"], "Geneseon Academy")
        self.assertEqual(branding["logoUrl"], "/api/branding/logo")

        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request("GET", branding["logoUrl"])
        response = connection.getresponse()
        self.assertEqual(response.status, 200)
        self.assertEqual(response.read(), image_bytes)
        connection.close()

    def test_cross_origin_authentication_request_is_rejected(self):
        connection = http.client.HTTPConnection("127.0.0.1", self.port, timeout=5)
        connection.request(
            "POST",
            "/api/auth/register",
            body=json.dumps({
                "name": "Cross Origin",
                "email": "cross@example.com",
                "mobile": "01700000004",
                "password": "correct-horse-1",
                "educationType": "HSC",
                "batchOrTarget": "HSC 2026",
            }),
            headers={
                "Content-Type": "application/json",
                "Origin": "http://attacker.example",
            },
        )
        response = connection.getresponse()
        self.assertEqual(response.status, 403)
        connection.close()

    def test_gemini_question_solution_requires_login_and_student_category(self):
        question_id = f"solution-{uuid.uuid4().hex}"
        saved_question = self.handler.content_store.save_resource("questions", {
            "id": question_id,
            "category": "HSC",
            "questionType": "MCQ",
            "text": "পানির রাসায়নিক সংকেত কী?",
            "options": ["CO2", "H2O", "O2", "N2"],
            "correctIndex": 1,
            "explanation": "পানির অণুতে দুটি হাইড্রোজেন ও একটি অক্সিজেন পরমাণু থাকে।",
        })

        status, _, _ = self.request(
            "POST",
            "/api/ai/question-solution",
            {"questionId": question_id},
        )
        self.assertEqual(status, 401)

        _, _, ssc_headers = self.register_student(
            email=f"solution-ssc-{uuid.uuid4().hex}@example.com",
            mobile=f"017{uuid.uuid4().int % 10**8:08d}",
        )
        ssc_cookie = ssc_headers["Set-Cookie"].split(";", 1)[0]
        with patch("server.generate_question_solution") as generate_solution:
            status, _, _ = self.request(
                "POST",
                "/api/ai/question-solution",
                {"questionId": question_id},
                cookie=ssc_cookie,
            )
        self.assertEqual(status, 404)
        generate_solution.assert_not_called()

        _, _, hsc_headers = self.register_student(
            email=f"solution-hsc-{uuid.uuid4().hex}@example.com",
            mobile=f"017{uuid.uuid4().int % 10**8:08d}",
            education_type="HSC",
        )
        hsc_cookie = hsc_headers["Set-Cookie"].split(";", 1)[0]
        _, _, second_hsc_headers = self.register_student(
            email=f"solution-hsc-second-{uuid.uuid4().hex}@example.com",
            mobile=f"017{uuid.uuid4().int % 10**8:08d}",
            education_type="HSC",
        )
        second_hsc_cookie = second_hsc_headers["Set-Cookie"].split(";", 1)[0]
        with patch(
            "server.generate_question_solution",
            return_value="H2O হলো পানির সংকেত।",
        ) as generate_solution:
            status, result, _ = self.request(
                "POST",
                "/api/ai/question-solution",
                {"questionId": question_id},
                cookie=second_hsc_cookie,
            )
            cached_status, cached_result, _ = self.request(
                "POST",
                "/api/ai/question-solution",
                {"questionId": question_id},
                cookie=hsc_cookie,
            )
        self.assertEqual(status, 200)
        self.assertEqual(result["solution"], "H2O হলো পানির সংকেত।")
        self.assertEqual(cached_status, 200)
        self.assertEqual(cached_result["solution"], result["solution"])
        generate_solution.assert_called_once_with(
            saved_question,
            "HSC",
        )

    def test_gemini_question_solution_returns_quota_limit_as_429(self):
        question_id = f"solution-limit-{uuid.uuid4().hex}"
        self.handler.content_store.save_resource("questions", {
            "id": question_id,
            "category": "HSC",
            "questionType": "MCQ",
            "text": "পানির সংকেত কী?",
            "options": ["CO2", "H2O"],
            "correctIndex": 1,
        })
        _, _, headers = self.register_student(
            email=f"solution-limit-{uuid.uuid4().hex}@example.com",
            mobile=f"017{uuid.uuid4().int % 10**8:08d}",
            education_type="HSC",
        )
        cookie = headers["Set-Cookie"].split(";", 1)[0]
        with patch(
            "server.generate_question_solution",
            side_effect=GeminiRateLimitError("Gemini quota শেষ হয়েছে।"),
        ):
            status, result, _ = self.request(
                "POST",
                "/api/ai/question-solution",
                {"questionId": question_id},
                cookie=cookie,
            )

        self.assertEqual(status, 429)
        self.assertEqual(result["error"], "Gemini quota শেষ হয়েছে।")

    def test_ai_assistant_accepts_multilingual_student_prompt(self):
        question = self.handler.content_store.save_resource("questions", {
            "id": f"assistant-{uuid.uuid4().hex}",
            "category": "HSC",
            "questionType": "WRITTEN",
            "text": "সালোকসংশ্লেষণ কী?",
            "answer": "উদ্ভিদ সূর্যালোক ব্যবহার করে খাদ্য তৈরি করে।",
        })
        _, _, headers = self.register_student(
            email=f"assistant-{uuid.uuid4().hex}@example.com",
            mobile=f"017{uuid.uuid4().int % 10**8:08d}",
            education_type="HSC",
        )
        cookie = headers["Set-Cookie"].split(";", 1)[0]

        with patch(
            "server.generate_study_assistant_response",
            return_value="Photosynthesis-এর বাংলা হলো সালোকসংশ্লেষণ।",
        ) as generate_response:
            status, result, _ = self.request(
                "POST",
                "/api/ai/assistant",
                {"prompt": "What is salokshongshleshon?"},
                cookie=cookie,
            )

        self.assertEqual(status, 200)
        self.assertIn("সালোকসংশ্লেষণ", result["answer"])
        generate_response.assert_called_once_with(
            "What is salokshongshleshon?",
            "HSC",
            [question],
        )

    def test_admin_creation_is_server_side_only(self):
        admin = self.handler.auth_store.create_admin(
            "Admin", "admin-test@example.com", "01700000005", "admin-password-1"
        )
        self.assertEqual(admin["role"], "ADMIN")
        self.assertTrue(admin["adminEligible"])
        self.assertEqual(
            self.handler.auth_store.authenticate(
                "admin-test@example.com", "admin-password-1"
            )["role"],
            "ADMIN",
        )

    def test_admin_creation_accepts_six_character_password(self):
        email = f"six-char-admin-{uuid.uuid4().hex}@example.com"
        with (
            patch("builtins.input", side_effect=[
                "Six Char Admin",
                email,
                f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            ]),
            patch("server.getpass", return_value="abc123"),
            patch("server.AUTH_STORE", self.handler.auth_store),
            patch("builtins.print"),
        ):
            create_admin()
        self.assertEqual(
            self.handler.auth_store.authenticate(
                email, "abc123"
            )["role"],
            "ADMIN",
        )

    def test_admin_creation_rejects_password_shorter_than_six_characters(self):
        with (
            patch("builtins.input", side_effect=[
                "Short Password Admin",
                f"short-admin-{uuid.uuid4().hex}@example.com",
                f"017{int(uuid.uuid4().hex[:8], 16) % 100_000_000:08d}",
            ]),
            patch("server.getpass", return_value="abc12"),
            patch("server.AUTH_STORE", self.handler.auth_store),
            patch("builtins.print"),
        ):
            with self.assertRaisesRegex(SystemExit, "৬ অক্ষরের"):
                create_admin()


if __name__ == "__main__":
    unittest.main()
