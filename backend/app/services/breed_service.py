from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.breed import Breed, SizeCategory
from app.schemas.breed import BreedListResponse, FciGroupResponse


async def list_breeds(
    db: AsyncSession,
    q: str | None = None,
    fci_group: int | None = None,
    size_category: SizeCategory | None = None,
    page: int = 1,
    limit: int = 50,
) -> BreedListResponse:
    """Return paginated list of breeds with optional filters."""
    query = select(Breed).order_by(Breed.name_pl)

    if q is not None:
        term = f"%{q}%"
        query = query.where(
            Breed.name_pl.ilike(term) | Breed.name_en.ilike(term)
        )
    if fci_group is not None:
        query = query.where(Breed.fci_group == fci_group)
    if size_category is not None:
        query = query.where(Breed.size_category == size_category)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    offset = (page - 1) * limit
    result = await db.execute(query.offset(offset).limit(limit))
    breeds = list(result.scalars().all())

    return BreedListResponse(
        items=breeds,
        total=total,
        page=page,
        limit=limit,
        pages=max(1, -(-total // limit)),
    )


async def get_breed_by_id(db: AsyncSession, breed_id: int) -> Breed:
    """Fetch a single breed by ID.

    Raises:
        ValueError: If breed does not exist.
    """
    breed = await db.get(Breed, breed_id)
    if breed is None:
        raise ValueError("Rasa nie istnieje")
    return breed


async def list_fci_groups(db: AsyncSession) -> list[FciGroupResponse]:
    """Return all FCI groups that have at least one breed, with breed counts."""
    result = await db.execute(
        select(Breed.fci_group, func.count(Breed.id).label("breed_count"))
        .where(Breed.fci_group.is_not(None))
        .group_by(Breed.fci_group)
        .order_by(Breed.fci_group)
    )
    rows = result.all()
    return [
        FciGroupResponse(fci_group=row.fci_group, breed_count=row.breed_count)
        for row in rows
    ]
