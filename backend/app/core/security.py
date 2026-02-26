from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.config import settings


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare plain-text password against its bcrypt hash."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(subject: str) -> str:
    """Create a short-lived JWT access token.

    Args:
        subject: The user ID to embed in the token payload.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": subject, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def create_refresh_token(subject: str) -> str:
    """Create a long-lived JWT refresh token.

    Args:
        subject: The user ID to embed in the token payload.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload = {"sub": subject, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict:
    """Decode and verify a JWT token.

    Returns the payload dict if valid.
    Raises JWTError if token is invalid or expired.
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
