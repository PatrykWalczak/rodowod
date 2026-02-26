import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db
from app.models.dog import DogSex
from app.models.user import User
from app.schemas.dog import DogCreate, DogListResponse, DogResponse, DogUpdate, PedigreeNode
from app.services import dog_service

router = APIRouter(prefix="/api/dogs", tags=["dogs"])


@router.get("/", response_model=DogListResponse)
async def list_dogs(
    breed_id: int | None = Query(None, description="Filter by breed ID"),
    sex: DogSex | None = Query(None, description="Filter by sex"),
    is_available_for_breeding: bool | None = Query(None, description="Filter by breeding availability"),  # noqa: E501
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    db: AsyncSession = Depends(get_db),
):
    """Return paginated list of dogs with optional filters."""
    return await dog_service.list_dogs(
        db,
        breed_id=breed_id,
        sex=sex,
        is_available_for_breeding=is_available_for_breeding,
        page=page,
        limit=limit,
    )


@router.post("/", response_model=DogResponse, status_code=status.HTTP_201_CREATED)
async def create_dog(
    data: DogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new dog profile for the authenticated user."""
    try:
        return await dog_service.create_dog(db, current_user.id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{dog_id}", response_model=DogResponse)
async def get_dog(dog_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return a public dog profile by ID."""
    try:
        return await dog_service.get_dog_by_id(db, dog_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{dog_id}", response_model=DogResponse)
async def update_dog(
    dog_id: uuid.UUID,
    data: DogUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a dog profile. Only the owner can edit."""
    try:
        return await dog_service.update_dog(db, dog_id, current_user.id, data)
    except ValueError as e:
        status_code = (
            status.HTTP_403_FORBIDDEN
            if "uprawnień" in str(e)
            else status.HTTP_404_NOT_FOUND
        )
        raise HTTPException(status_code=status_code, detail=str(e))


@router.delete("/{dog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dog(
    dog_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soft-delete a dog. Only the owner can delete."""
    try:
        await dog_service.delete_dog(db, dog_id, current_user.id)
    except ValueError as e:
        status_code = (
            status.HTTP_403_FORBIDDEN
            if "uprawnień" in str(e)
            else status.HTTP_404_NOT_FOUND
        )
        raise HTTPException(status_code=status_code, detail=str(e))


@router.get("/{dog_id}/pedigree", response_model=PedigreeNode)
async def get_pedigree(
    dog_id: uuid.UUID,
    generations: int = Query(3, ge=1, le=5, description="Number of generations to load"),
    db: AsyncSession = Depends(get_db),
):
    """Return the pedigree tree for a dog up to N generations."""
    dog = await dog_service.get_pedigree(db, dog_id, generations)
    if dog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pies nie istnieje")
    return dog
