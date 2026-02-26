from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.models.breed import SizeCategory
from app.schemas.breed import BreedListResponse, BreedResponse, FciGroupResponse
from app.services import breed_service

router = APIRouter(prefix="/api/breeds", tags=["breeds"])


@router.get("/", response_model=BreedListResponse)
async def list_breeds(
    q: str | None = Query(None, description="Search by Polish or English breed name"),
    fci_group: int | None = Query(None, ge=1, le=10, description="Filter by FCI group (1-10)"),
    size_category: SizeCategory | None = Query(None, description="Filter by size category"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=200, description="Results per page"),
    db: AsyncSession = Depends(get_db),
):
    """Return paginated list of dog breeds with optional filters."""
    return await breed_service.list_breeds(
        db, q=q, fci_group=fci_group, size_category=size_category, page=page, limit=limit
    )


@router.get("/groups", response_model=list[FciGroupResponse])
async def list_fci_groups(db: AsyncSession = Depends(get_db)):
    """Return all FCI groups with breed counts."""
    return await breed_service.list_fci_groups(db)


@router.get("/{breed_id}", response_model=BreedResponse)
async def get_breed(breed_id: int, db: AsyncSession = Depends(get_db)):
    """Return a single breed by ID."""
    try:
        return await breed_service.get_breed_by_id(db, breed_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
