import uuid
from datetime import date, datetime

from pydantic import BaseModel, field_validator

from app.models.dog import DogSex


class BreedInfo(BaseModel):
    id: int
    name_pl: str
    name_en: str | None
    fci_group: int | None

    model_config = {"from_attributes": True}


class DogCreate(BaseModel):
    name: str
    call_name: str | None = None
    sex: DogSex
    date_of_birth: date
    breed_id: int
    color: str | None = None
    registration_number: str | None = None
    microchip_number: str | None = None
    sire_id: uuid.UUID | None = None
    dam_id: uuid.UUID | None = None
    health_tests: str | None = None
    titles: str | None = None
    description: str | None = None
    is_available_for_breeding: bool | None = None
    photo_url: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Imię psa nie może być puste")
        return v.strip()


class DogUpdate(BaseModel):
    name: str | None = None
    call_name: str | None = None
    color: str | None = None
    registration_number: str | None = None
    microchip_number: str | None = None
    sire_id: uuid.UUID | None = None
    dam_id: uuid.UUID | None = None
    health_tests: str | None = None
    titles: str | None = None
    description: str | None = None
    is_available_for_breeding: bool | None = None
    photo_url: str | None = None


class DogResponse(BaseModel):
    id: uuid.UUID
    name: str
    call_name: str | None
    sex: DogSex
    date_of_birth: date
    color: str | None
    breed: BreedInfo
    owner_id: uuid.UUID
    registration_number: str | None
    microchip_number: str | None
    sire_id: uuid.UUID | None
    dam_id: uuid.UUID | None
    health_tests: str | None
    titles: str | None
    description: str | None
    is_available_for_breeding: bool | None
    photo_url: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class DogListResponse(BaseModel):
    items: list[DogResponse]
    total: int
    page: int
    limit: int
    pages: int


class PedigreeNode(BaseModel):
    id: uuid.UUID
    name: str
    sex: DogSex
    date_of_birth: date
    breed: BreedInfo
    registration_number: str | None
    photo_url: str | None
    # Recursive — sire and dam are also PedigreeNodes (or None)
    sire: "PedigreeNode | None" = None
    dam: "PedigreeNode | None" = None

    model_config = {"from_attributes": True}


# Required for recursive Pydantic model
PedigreeNode.model_rebuild()
