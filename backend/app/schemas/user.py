import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    city: str | None
    voivodeship: str | None
    bio: str | None
    kennel_name: str | None
    is_breeder: bool
    avatar_url: str | None
    is_active: bool
    created_at: datetime

    # Tell Pydantic to read data from ORM object attributes (not just dicts)
    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    city: str | None = None
    voivodeship: str | None = None
    bio: str | None = None
    kennel_name: str | None = None
    is_breeder: bool | None = None
    avatar_url: str | None = None
