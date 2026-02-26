import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.dog import Dog
from app.models.user import User
from app.schemas.user import UserListResponse, UserUpdate


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


async def list_users(
    db: AsyncSession,
    q: str | None = None,
    is_breeder: bool | None = None,
    city: str | None = None,
    voivodeship: str | None = None,
    page: int = 1,
    limit: int = 20,
) -> UserListResponse:
    """Return paginated list of active users with optional filters."""
    query = (
        select(User)
        .where(User.is_active == True)  # noqa: E712
        .order_by(User.last_name.asc(), User.first_name.asc())
    )

    if q is not None:
        term = f"%{q}%"
        query = query.where(
            User.first_name.ilike(term)
            | User.last_name.ilike(term)
            | User.kennel_name.ilike(term)
        )
    if is_breeder is not None:
        query = query.where(User.is_breeder == is_breeder)
    if city is not None:
        query = query.where(User.city.ilike(f"%{city}%"))
    if voivodeship is not None:
        query = query.where(User.voivodeship == voivodeship)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    offset = (page - 1) * limit
    result = await db.execute(query.offset(offset).limit(limit))
    users = list(result.scalars().all())

    return UserListResponse(
        items=users,
        total=total,
        page=page,
        limit=limit,
        pages=max(1, -(-total // limit)),
    )


async def get_user_dogs(db: AsyncSession, user_id: uuid.UUID) -> list[Dog]:
    """Return all active dogs owned by a user."""
    result = await db.execute(
        select(Dog).where(Dog.owner_id == user_id, Dog.is_active == True)  # noqa: E712
    )
    return list(result.scalars().all())
