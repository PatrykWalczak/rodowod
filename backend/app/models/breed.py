import enum

from sqlalchemy import Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SizeCategory(str, enum.Enum):
    mini = "mini"
    small = "small"
    medium = "medium"
    large = "large"
    giant = "giant"


class Breed(Base):
    __tablename__ = "breeds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name_pl: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    name_en: Mapped[str | None] = mapped_column(String(200), nullable=True)
    fci_number: Mapped[int | None] = mapped_column(Integer, unique=True, nullable=True)
    fci_group: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fci_section: Mapped[int | None] = mapped_column(Integer, nullable=True)
    size_category: Mapped[SizeCategory | None] = mapped_column(
        Enum(SizeCategory), nullable=True
    )
    description_pl: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # One breed can have many dogs
    dogs: Mapped[list["Dog"]] = relationship("Dog", back_populates="breed")
