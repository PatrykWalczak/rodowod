import uuid
from datetime import date

from pydantic import BaseModel

from app.models.dog import DogSex


class DogResponse(BaseModel):
    id: uuid.UUID
    name: str
    call_name: str | None
    sex: DogSex
    date_of_birth: date
    color: str | None
    breed_id: int
    owner_id: uuid.UUID
    is_available_for_breeding: bool | None
    photo_url: str | None
    registration_number: str | None

    model_config = {"from_attributes": True}
