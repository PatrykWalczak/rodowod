import uuid

from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import RegisterRequest, TokenResponse


async def register(db: AsyncSession, data: RegisterRequest) -> TokenResponse:
    """Register a new user and return JWT tokens.

    Raises:
        ValueError: If email is already taken.
    """
    # Check if email is already registered
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none() is not None:
        raise ValueError("Użytkownik z tym adresem email już istnieje")

    # Create new user with hashed password
    user = User(
        id=uuid.uuid4(),
        email=data.email,
        hashed_password=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Generate and return tokens
    return _build_tokens(str(user.id))


async def login(db: AsyncSession, email: str, password: str) -> TokenResponse:
    """Verify credentials and return JWT tokens.

    Raises:
        ValueError: If credentials are invalid.
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    # Use same error message for wrong email and wrong password (security best practice)
    if user is None or not verify_password(password, user.hashed_password):
        raise ValueError("Nieprawidłowy email lub hasło")

    if not user.is_active:
        raise ValueError("Konto jest nieaktywne")

    return _build_tokens(str(user.id))


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> TokenResponse:
    """Issue new token pair from a valid refresh token.

    Raises:
        ValueError: If token is invalid, expired, or wrong type.
    """
    try:
        payload = decode_token(refresh_token)
    except JWTError:
        raise ValueError("Nieprawidłowy lub wygasły token")

    # Ensure it's actually a refresh token, not an access token
    if payload.get("type") != "refresh":
        raise ValueError("Nieprawidłowy typ tokenu")

    user_id = payload.get("sub")
    if not user_id:
        raise ValueError("Nieprawidłowy token")

    # Verify user still exists and is active
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise ValueError("Użytkownik nie istnieje lub jest nieaktywny")

    return _build_tokens(user_id)


def _build_tokens(user_id: str) -> TokenResponse:
    """Create access + refresh token pair for a given user ID."""
    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )
