"""Email delivery through the Resend HTTP API."""

import html
import json
import os
import re
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlsplit
from urllib.request import Request, urlopen


class EmailDeliveryError(Exception):
    """Raised when Resend is not configured or rejects an email."""


class ResendEmailService:
    API_URL = "https://api.resend.com/emails"

    @property
    def configured(self):
        return all(
            os.environ.get(key, "").strip()
            for key in ("RESEND_API_KEY", "JA_EMAIL_FROM")
        )

    def send_password_reset(self, recipient, name, token):
        api_key = os.environ.get("RESEND_API_KEY", "").strip()
        sender = os.environ.get("JA_EMAIL_FROM", "").strip()
        base_url = os.environ.get(
            "JA_PUBLIC_BASE_URL", "http://localhost:8000"
        ).strip().rstrip("/")
        parsed_base = urlsplit(base_url)
        if not api_key or not sender:
            raise EmailDeliveryError("Resend API key and sender are required.")
        if (
            "\r" in sender
            or "\n" in sender
            or not re.search(r"[^@\s]+@[^@\s]+\.[^@\s]+", sender)
        ):
            raise EmailDeliveryError("JA_EMAIL_FROM must be a valid sender address.")
        if (
            parsed_base.scheme not in {"http", "https"}
            or not parsed_base.netloc
            or parsed_base.username
            or parsed_base.password
            or parsed_base.query
            or parsed_base.fragment
        ):
            raise EmailDeliveryError("JA_PUBLIC_BASE_URL must be a valid site URL.")

        reset_url = (
            f"{base_url}/#/reset-password?token={quote(token, safe='')}"
        )
        safe_name = html.escape(name)
        safe_url = html.escape(reset_url, quote=True)
        payload = {
            "from": sender,
            "to": [recipient],
            "subject": "Reset your Geneseon Academy password",
            "text": (
                f"Hello {name},\n\nUse this link to reset your Geneseon Academy "
                f"password. It expires in 30 minutes and can only be used once:\n"
                f"{reset_url}\n\nIf you did not request a reset, ignore this email."
            ),
            "html": (
                f"<p>Hello {safe_name},</p><p>Use the link below to reset your "
                "Geneseon Academy password. It expires in 30 minutes and can only be "
                f"used once:</p><p><a href=\"{safe_url}\">Reset password</a></p>"
                "<p>If you did not request a reset, ignore this email.</p>"
            ),
        }
        request = Request(
            self.API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=10) as response:
                if not 200 <= response.status < 300:
                    raise EmailDeliveryError(
                        f"Resend returned HTTP {response.status}."
                    )
                response.read()
        except HTTPError as exc:
            raise EmailDeliveryError(
                f"Resend returned HTTP {exc.code}."
            ) from exc
        except (URLError, TimeoutError, OSError) as exc:
            raise EmailDeliveryError("Could not connect to Resend.") from exc
