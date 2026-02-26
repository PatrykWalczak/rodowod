from pydantic import BaseModel

from app.models.breed import SizeCategory


class BreedResponse(BaseModel):
    id: int
    name_pl: str
    name_en: str | None
    fci_number: int | None
    fci_group: int | None
    fci_section: int | None
    size_category: SizeCategory | None
    description_pl: str | None
    image_url: str | None

    model_config = {"from_attributes": True}


class BreedListResponse(BaseModel):
    items: list[BreedResponse]
    total: int
    page: int
    limit: int
    pages: int


class FciGroupResponse(BaseModel):
    fci_group: int
    breed_count: int
