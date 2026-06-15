import logging

from fastapi import Depends, Header, HTTPException

from .config import get_settings
from .database import fetch_one, get_conn

logger = logging.getLogger(__name__)

_initialized = False


def init_firebase() -> None:
    """Initialize the Firebase Admin SDK once. Safe to call repeatedly.

    Failures are logged (not raised) so the API can still boot and serve
    public/health routes even when credentials are absent in dev.
    """
    global _initialized
    if _initialized:
        return
    try:
        import firebase_admin
        from firebase_admin import credentials

        settings = get_settings()
        if settings.firebase_credentials_file:
            cred = credentials.Certificate(settings.firebase_credentials_file)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
        _initialized = True
        logger.info("Firebase Admin SDK initialized")
    except Exception as exc:  # pragma: no cover - depends on runtime config
        logger.warning("Firebase Admin SDK not initialized: %s", exc)


def verify_token(authorization: str | None) -> dict:
    """Verify a Firebase ID token from an Authorization: Bearer <token> header."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        init_firebase()
        from firebase_admin import auth as firebase_auth

        return firebase_auth.verify_id_token(token)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc


def get_current_user(
    authorization: str | None = Header(default=None),
    conn=Depends(get_conn),
) -> dict:
    """Resolve the authenticated user, creating a stub row on first sight."""
    decoded = verify_token(authorization)
    uid = decoded.get("uid")
    email = decoded.get("email")

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE firebase_uid = ?", (uid,))
    user = fetch_one(cursor)
    if user is None:
        cursor.execute(
            "INSERT INTO users (firebase_uid, email) VALUES (?, ?)",
            (uid, email),
        )
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE firebase_uid = ?", (uid,))
        user = fetch_one(cursor)
    return user
