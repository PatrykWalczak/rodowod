# Faza 1: Baza Danych — ✅ UKOŃCZONA

## Zrobione
- `backend/app/db/base.py` — SQLAlchemy `DeclarativeBase`
- `backend/app/db/session.py` — async engine (`asyncpg`) + `AsyncSessionLocal`
- `backend/app/models/breed.py` — model `Breed` z enum `SizeCategory`
- `backend/app/models/user.py` — model `User` z UUID PK
- `backend/app/models/dog.py` — model `Dog` z self-referential pedigree (sire_id/dam_id)
- `backend/alembic/` — Alembic z szablonem `async`, skonfigurowany env.py
- `backend/alembic/versions/9855948d5c2a_initial_schema.py` — pierwsza migracja
- `backend/app/seed/breeds.py` — 57 ras FCI (wszystkie 10 grup), zweryfikowane z fci.be
- Tabele w PostgreSQL: `users`, `breeds`, `dogs`, `alembic_version`

## Dodane do frontendu
- `@tanstack/react-query` + `@tanstack/react-query-devtools`
- `react-hook-form` + `@hookform/resolvers`
- `frontend/src/app/providers.tsx` — `QueryClientProvider` + devtools
- `frontend/src/app/layout.tsx` — lang="pl", title="RodoWod", Providers

## Uwagi
- Seed wymaga importu WSZYSTKICH modeli (user, dog) — SQLAlchemy musi rozwiązać relacje
- fci_number=None dla odmian dzielących numer FCI (jamniki, pudel miniaturowy/średni)
- Owczarek Australijski = FCI 342 (nie 338)
