import uuid
from typing import AsyncGenerator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import AsyncSessionLocal
from app.models.user import User

# Reads the Bearer token from the Authorization header
bearer_scheme = HTTPBearer()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a database session and ensure it is closed after the request."""
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate the current user from the JWT access token.

    Raises:
        401 Unauthorized: If token is missing, invalid, expired, or wrong type.
        401 Unauthorized: If user no longer exists or is inactive.
    """
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Nieprawidłowy lub wygasły token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(credentials.credentials)
    except JWTError:
        raise unauthorized

    # Reject refresh tokens used as access tokens
    if payload.get("type") != "access":
        raise unauthorized

    user_id: str | None = payload.get("sub")
    if not user_id:
        raise unauthorized

    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()

    if user is None or not user.is_active:
        raise unauthorized

    return user
