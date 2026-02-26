import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.dog import DogResponse
from app.schemas.user import UserListResponse, UserResponse, UserUpdate
from app.services import user_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/", response_model=UserListResponse)
async def list_users(
    q: str | None = Query(None, description="Search by name or kennel name (partial match)"),
    is_breeder: bool | None = Query(None, description="Filter by breeder status"),
    city: str | None = Query(None, description="Filter by city (partial match)"),
    voivodeship: str | None = Query(None, description="Filter by voivodeship"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    db: AsyncSession = Depends(get_db),
):
    """Return paginated list of users with optional filters."""
    return await user_service.list_users(
        db, q=q, is_breeder=is_breeder, city=city, voivodeship=voivodeship, page=page, limit=limit
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return a public user profile by ID."""
    try:
        return await user_service.get_user_by_id(db, user_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the currently authenticated user's profile."""
    return await user_service.update_user(db, current_user, data)


@router.get("/{user_id}/dogs", response_model=list[DogResponse])
async def get_user_dogs(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return all active dogs owned by a user."""
    try:
        await user_service.get_user_by_id(db, user_id)  # verify user exists
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return await user_service.get_user_dogs(db, user_id)
