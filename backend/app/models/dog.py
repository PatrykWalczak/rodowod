import enum
import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class DogSex(str, enum.Enum):
    male = "male"
    female = "female"


class Dog(Base):
    __tablename__ = "dogs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    # Foreign keys
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    breed_id: Mapped[int] = mapped_column(ForeignKey("breeds.id"), nullable=False)

    # Basic info
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    call_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sex: Mapped[DogSex] = mapped_column(Enum(DogSex), nullable=False)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    color: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Registry
    registration_number: Mapped[str | None] = mapped_column(
        String(100), unique=True, nullable=True
    )
    microchip_number: Mapped[str | None] = mapped_column(
        String(50), unique=True, nullable=True
    )

    # Self-referential pedigree — sire (father) and dam (mother)
    # A dog can reference other dogs in the same table as parents
    sire_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("dogs.id"), nullable=True
    )
    dam_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("dogs.id"), nullable=True
    )

    # Additional info
    health_tests: Mapped[str | None] = mapped_column(Text, nullable=True)
    titles: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_available_for_breeding: Mapped[bool | None] = mapped_column(
        Boolean, nullable=True
    )
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="dogs")
    breed: Mapped["Breed"] = relationship("Breed", back_populates="dogs")

    # Self-referential relationships for pedigree
    # foreign_keys needed because SQLAlchemy sees two FK pointing to same table
    sire: Mapped["Dog | None"] = relationship(
        "Dog", foreign_keys=[sire_id], remote_side="Dog.id"
    )
    dam: Mapped["Dog | None"] = relationship(
        "Dog", foreign_keys=[dam_id], remote_side="Dog.id"
    )
