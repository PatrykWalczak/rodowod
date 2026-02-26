import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.breed import Breed
from app.models.dog import Dog, DogSex
from app.schemas.dog import DogCreate, DogListResponse, DogUpdate


async def create_dog(db: AsyncSession, owner_id: uuid.UUID, data: DogCreate) -> Dog:
    """Create a new dog profile.

    Raises:
        ValueError: If breed doesn't exist or parent sex is wrong.
    """
    # Verify breed exists
    breed = await db.get(Breed, data.breed_id)
    if breed is None:
        raise ValueError("Podana rasa nie istnieje")

    # Verify sire is male
    if data.sire_id:
        sire = await db.get(Dog, data.sire_id)
        if sire is None or sire.sex != DogSex.male:
            raise ValueError("Ojciec (sire) musi być psem płci męskiej")

    # Verify dam is female
    if data.dam_id:
        dam = await db.get(Dog, data.dam_id)
        if dam is None or dam.sex != DogSex.female:
            raise ValueError("Matka (dam) musi być psem płci żeńskiej")

    dog = Dog(id=uuid.uuid4(), owner_id=owner_id, **data.model_dump())
    db.add(dog)
    await db.commit()

    # Reload with breed relationship
    return await get_dog_by_id(db, dog.id)


async def get_dog_by_id(db: AsyncSession, dog_id: uuid.UUID) -> Dog:
    """Fetch an active dog by ID with breed loaded.

    Raises:
        ValueError: If dog doesn't exist or is inactive.
    """
    result = await db.execute(
        select(Dog)
        .options(joinedload(Dog.breed))
        .where(Dog.id == dog_id, Dog.is_active == True)  # noqa: E712
    )
    dog = result.scalar_one_or_none()
    if dog is None:
        raise ValueError("Pies nie istnieje")
    return dog


async def update_dog(
    db: AsyncSession, dog_id: uuid.UUID, owner_id: uuid.UUID, data: DogUpdate
) -> Dog:
    """Apply partial update to a dog. Only the owner can edit.

    Raises:
        ValueError: If dog not found or user is not the owner.
    """
    dog = await get_dog_by_id(db, dog_id)

    if dog.owner_id != owner_id:
        raise ValueError("Nie masz uprawnień do edycji tego psa")

    changes = data.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(dog, field, value)

    await db.commit()
    return await get_dog_by_id(db, dog_id)


async def delete_dog(
    db: AsyncSession, dog_id: uuid.UUID, owner_id: uuid.UUID
) -> None:
    """Soft-delete a dog (sets is_active=False). Only the owner can delete.

    Raises:
        ValueError: If dog not found or user is not the owner.
    """
    dog = await get_dog_by_id(db, dog_id)

    if dog.owner_id != owner_id:
        raise ValueError("Nie masz uprawnień do usunięcia tego psa")

    dog.is_active = False
    await db.commit()


async def list_dogs(
    db: AsyncSession,
    breed_id: int | None = None,
    sex: DogSex | None = None,
    is_available_for_breeding: bool | None = None,
    page: int = 1,
    limit: int = 20,
) -> DogListResponse:
    """Return paginated list of dogs with optional filters."""
    # Base query — only active dogs with breed loaded
    query = (
        select(Dog)
        .options(joinedload(Dog.breed))
        .where(Dog.is_active == True)  # noqa: E712
    )

    # Apply filters dynamically — only add WHERE clauses for provided params
    if breed_id is not None:
        query = query.where(Dog.breed_id == breed_id)
    if sex is not None:
        query = query.where(Dog.sex == sex)
    if is_available_for_breeding is not None:
        query = query.where(Dog.is_available_for_breeding == is_available_for_breeding)

    # Count total matching records (for pagination metadata)
    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    # Apply pagination
    offset = (page - 1) * limit
    result = await db.execute(query.offset(offset).limit(limit))
    dogs = list(result.scalars().unique().all())

    return DogListResponse(
        items=dogs,
        total=total,
        page=page,
        limit=limit,
        pages=max(1, -(-total // limit)),  # ceiling division
    )


async def get_pedigree(
    db: AsyncSession, dog_id: uuid.UUID, generations: int = 3
) -> Dog | None:
    """Recursively load pedigree tree up to N generations.

    Fetches sire and dam for each dog, going back `generations` levels.
    Returns the root dog with nested sire/dam attributes populated.
    """
    if generations <= 0:
        return None

    result = await db.execute(
        select(Dog)
        .options(joinedload(Dog.breed))
        .where(Dog.id == dog_id)
    )
    dog = result.scalar_one_or_none()
    if dog is None:
        return None

    # Recursively load parents
    if dog.sire_id:
        dog.sire = await get_pedigree(db, dog.sire_id, generations - 1)
    if dog.dam_id:
        dog.dam = await get_pedigree(db, dog.dam_id, generations - 1)

    return dog
