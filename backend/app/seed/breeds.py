"""
Seed script: populates the breeds table with FCI breed data.
Run once after migrations: python -m app.seed.breeds
Idempotent — safe to run multiple times.
"""

import asyncio

from sqlalchemy import select

import app.models.dog  # noqa: F401 — registers Dog model so relationships resolve
import app.models.user  # noqa: F401 — registers User model so relationships resolve
from app.db.session import AsyncSessionLocal
from app.models.breed import Breed, SizeCategory

BREEDS_DATA = [
    # --- FCI Group 1: Sheepdogs and Cattledogs ---
    {
        "name_pl": "Border Collie",
        "name_en": "Border Collie",
        "fci_number": 297,
        "fci_group": 1,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Owczarek Niemiecki",
        "name_en": "German Shepherd Dog",
        "fci_number": 166,
        "fci_group": 1,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Owczarek Belgijski Malinois",
        "name_en": "Belgian Shepherd Malinois",
        "fci_number": 15,
        "fci_group": 1,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Owczarek Australijski",
        "name_en": "Australian Shepherd",
        "fci_number": 342,
        "fci_group": 1,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Polski Owczarek Nizinny",
        "name_en": "Polish Lowland Sheepdog",
        "fci_number": 251,
        "fci_group": 1,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Owczarek Podhalański",
        "name_en": "Tatra Shepherd Dog",
        "fci_number": 252,
        "fci_group": 1,
        "fci_section": 1,
        "size_category": SizeCategory.giant,
    },
    {
        "name_pl": "Collie Długowłosy",
        "name_en": "Rough Collie",
        "fci_number": 156,
        "fci_group": 1,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    # --- FCI Group 2: Pinscher, Schnauzer, Molossoid, Swiss Mountain ---
    {
        "name_pl": "Rottweiler",
        "name_en": "Rottweiler",
        "fci_number": 147,
        "fci_group": 2,
        "fci_section": 2,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Doberman",
        "name_en": "Dobermann",
        "fci_number": 143,
        "fci_group": 2,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Bokser",
        "name_en": "Boxer",
        "fci_number": 144,
        "fci_group": 2,
        "fci_section": 2,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Dog Niemiecki",
        "name_en": "Great Dane",
        "fci_number": 235,
        "fci_group": 2,
        "fci_section": 2,
        "size_category": SizeCategory.giant,
    },
    {
        "name_pl": "Berneński Pies Pasterski",
        "name_en": "Bernese Mountain Dog",
        "fci_number": 45,
        "fci_group": 2,
        "fci_section": 3,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Schnauzer Miniaturowy",
        "name_en": "Miniature Schnauzer",
        "fci_number": 183,
        "fci_group": 2,
        "fci_section": 1,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Schnauzer Średni",
        "name_en": "Standard Schnauzer",
        "fci_number": 182,
        "fci_group": 2,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Dog Argentyński",
        "name_en": "Dogo Argentino",
        "fci_number": 292,
        "fci_group": 2,
        "fci_section": 2,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Leonberger",
        "name_en": "Leonberger",
        "fci_number": 145,
        "fci_group": 2,
        "fci_section": 2,
        "size_category": SizeCategory.giant,
    },
    # --- FCI Group 3: Terriers ---
    {
        "name_pl": "West Highland White Terrier",
        "name_en": "West Highland White Terrier",
        "fci_number": 85,
        "fci_group": 3,
        "fci_section": 2,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Yorkshire Terrier",
        "name_en": "Yorkshire Terrier",
        "fci_number": 86,
        "fci_group": 3,
        "fci_section": 4,
        "size_category": SizeCategory.mini,
    },
    {
        "name_pl": "Jack Russell Terrier",
        "name_en": "Jack Russell Terrier",
        "fci_number": 345,
        "fci_group": 3,
        "fci_section": 2,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Bull Terrier",
        "name_en": "Bull Terrier",
        "fci_number": 11,
        "fci_group": 3,
        "fci_section": 3,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Cairn Terrier",
        "name_en": "Cairn Terrier",
        "fci_number": 64,
        "fci_group": 3,
        "fci_section": 2,
        "size_category": SizeCategory.small,
    },
    # --- FCI Group 4: Dachshunds ---
    {
        "name_pl": "Jamnik Standardowy Krótkowłosy",
        "name_en": "Standard Smooth-haired Dachshund",
        "fci_number": 148,
        "fci_group": 4,
        "fci_section": 1,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Jamnik Miniaturowy Krótkowłosy",
        "name_en": "Miniature Smooth-haired Dachshund",
        "fci_number": None,  # shares FCI 148 with standard variety
        "fci_group": 4,
        "fci_section": 1,
        "size_category": SizeCategory.mini,
    },
    {
        "name_pl": "Jamnik Standardowy Długowłosy",
        "name_en": "Standard Long-haired Dachshund",
        "fci_number": None,  # shares FCI 148 with smooth-haired variety
        "fci_group": 4,
        "fci_section": 1,
        "size_category": SizeCategory.small,
    },
    # --- FCI Group 5: Spitz and Primitive Types ---
    {
        "name_pl": "Siberian Husky",
        "name_en": "Siberian Husky",
        "fci_number": 270,
        "fci_group": 5,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Alaskan Malamute",
        "name_en": "Alaskan Malamute",
        "fci_number": 243,
        "fci_group": 5,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Akita",
        "name_en": "Akita",
        "fci_number": 255,
        "fci_group": 5,
        "fci_section": 5,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Shiba Inu",
        "name_en": "Shiba Inu",
        "fci_number": 257,
        "fci_group": 5,
        "fci_section": 5,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Szpic Miniaturowy",
        "name_en": "Pomeranian",
        "fci_number": 97,
        "fci_group": 5,
        "fci_section": 4,
        "size_category": SizeCategory.mini,
    },
    {
        "name_pl": "Szpic Średni",
        "name_en": "German Spitz Medium",
        "fci_number": 98,
        "fci_group": 5,
        "fci_section": 4,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Samoyed",
        "name_en": "Samoyed",
        "fci_number": 212,
        "fci_group": 5,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    # --- FCI Group 6: Scent Hounds ---
    {
        "name_pl": "Beagle",
        "name_en": "Beagle",
        "fci_number": 161,
        "fci_group": 6,
        "fci_section": 1,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Ogar Polski",
        "name_en": "Polish Hound",
        "fci_number": 52,
        "fci_group": 6,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Basset Hound",
        "name_en": "Basset Hound",
        "fci_number": 163,
        "fci_group": 6,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Dalmatyńczyk",
        "name_en": "Dalmatian",
        "fci_number": 153,
        "fci_group": 6,
        "fci_section": 3,
        "size_category": SizeCategory.medium,
    },
    # --- FCI Group 7: Pointing Dogs ---
    {
        "name_pl": "Wyżeł Niemiec Krótkowłosy",
        "name_en": "German Shorthaired Pointer",
        "fci_number": 119,
        "fci_group": 7,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Wyżeł Weimarski",
        "name_en": "Weimaraner",
        "fci_number": 99,
        "fci_group": 7,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Wyżeł Węgierski Krótkowłosy",
        "name_en": "Hungarian Shorthaired Pointer",
        "fci_number": 57,
        "fci_group": 7,
        "fci_section": 1,
        "size_category": SizeCategory.medium,
    },
    # --- FCI Group 8: Retrievers, Flushing Dogs, Water Dogs ---
    {
        "name_pl": "Golden Retriever",
        "name_en": "Golden Retriever",
        "fci_number": 111,
        "fci_group": 8,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Labrador Retriever",
        "name_en": "Labrador Retriever",
        "fci_number": 122,
        "fci_group": 8,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Cocker Spaniel Angielski",
        "name_en": "English Cocker Spaniel",
        "fci_number": 5,
        "fci_group": 8,
        "fci_section": 2,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Cocker Spaniel Amerykański",
        "name_en": "American Cocker Spaniel",
        "fci_number": 167,
        "fci_group": 8,
        "fci_section": 2,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Springer Spaniel Angielski",
        "name_en": "English Springer Spaniel",
        "fci_number": 125,
        "fci_group": 8,
        "fci_section": 2,
        "size_category": SizeCategory.medium,
    },
    # --- FCI Group 9: Companion and Toy Dogs ---
    {
        "name_pl": "Buldog Francuski",
        "name_en": "French Bulldog",
        "fci_number": 101,
        "fci_group": 9,
        "fci_section": 11,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Pudel Toy",
        "name_en": "Toy Poodle",
        "fci_number": 172,
        "fci_group": 9,
        "fci_section": 2,
        "size_category": SizeCategory.mini,
    },
    {
        "name_pl": "Pudel Miniaturowy",
        "name_en": "Miniature Poodle",
        "fci_number": None,  # shares FCI 172 with other poodle varieties
        "fci_group": 9,
        "fci_section": 2,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Pudel Średni",
        "name_en": "Medium Poodle",
        "fci_number": None,  # shares FCI 172 with other poodle varieties
        "fci_group": 9,
        "fci_section": 2,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Maltańczyk",
        "name_en": "Maltese",
        "fci_number": 65,
        "fci_group": 9,
        "fci_section": 1,
        "size_category": SizeCategory.mini,
    },
    {
        "name_pl": "Shih Tzu",
        "name_en": "Shih Tzu",
        "fci_number": 208,
        "fci_group": 9,
        "fci_section": 5,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Chihuahua Krótkowłosy",
        "name_en": "Short-haired Chihuahua",
        "fci_number": 218,
        "fci_group": 9,
        "fci_section": 6,
        "size_category": SizeCategory.mini,
    },
    {
        "name_pl": "Cavalier King Charles Spaniel",
        "name_en": "Cavalier King Charles Spaniel",
        "fci_number": 136,
        "fci_group": 9,
        "fci_section": 7,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Mops",
        "name_en": "Pug",
        "fci_number": 253,
        "fci_group": 9,
        "fci_section": 11,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Bichon Frisé",
        "name_en": "Bichon Frisé",
        "fci_number": 215,
        "fci_group": 9,
        "fci_section": 1,
        "size_category": SizeCategory.small,
    },
    {
        "name_pl": "Havanese",
        "name_en": "Havanese",
        "fci_number": 250,
        "fci_group": 9,
        "fci_section": 1,
        "size_category": SizeCategory.small,
    },
    # --- FCI Group 10: Sighthounds ---
    {
        "name_pl": "Greyhound",
        "name_en": "Greyhound",
        "fci_number": 158,
        "fci_group": 10,
        "fci_section": 3,
        "size_category": SizeCategory.large,
    },
    {
        "name_pl": "Whippet",
        "name_en": "Whippet",
        "fci_number": 162,
        "fci_group": 10,
        "fci_section": 3,
        "size_category": SizeCategory.medium,
    },
    {
        "name_pl": "Chart Afgan",
        "name_en": "Afghan Hound",
        "fci_number": 228,
        "fci_group": 10,
        "fci_section": 1,
        "size_category": SizeCategory.large,
    },
]


async def seed_breeds() -> None:
    async with AsyncSessionLocal() as session:
        # Check how many breeds already exist
        result = await session.execute(select(Breed))
        existing = result.scalars().all()

        if existing:
            print(f"Breeds already seeded ({len(existing)} records). Skipping.")
            return

        # Insert all breeds
        breeds = [Breed(**data) for data in BREEDS_DATA]
        session.add_all(breeds)
        await session.commit()
        print(f"Seeded {len(breeds)} breeds successfully.")


if __name__ == "__main__":
    asyncio.run(seed_breeds())
