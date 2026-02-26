import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.dog import Dog
from app.models.user import User
from app.schemas.user import UserUpdate


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User:
    """Fetch a user by their UUID.

    Raises:
        ValueError: If user does not exist or is inactive.
    """
    result = await db.execute(
        select(User).where(User.id == user_id, User.is_active == True)  # noqa: E712
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise ValueError("Użytkownik nie istnieje")
    return user


async def update_user(db: AsyncSession, user: User, data: UserUpdate) -> User:
    """Apply partial update to a user's profile.

    Only fields explicitly sent in the request are updated (exclude_unset=True).
    """
    changes = data.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user


async def get_user_dogs(db: AsyncSession, user_id: uuid.UUID) -> list[Dog]:
    """Return all active dogs owned by a user."""
    result = await db.execute(
        select(Dog).where(Dog.owner_id == user_id, Dog.is_active == True)  # noqa: E712
    )
    return list(result.scalars().all())
