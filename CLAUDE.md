# RodoWod

## Project Overview
Platforma społecznościowa dla właścicieli i hodowców psów rasowych w Polsce.
"LinkedIn meets Tinder for pedigree dogs" — profesjonalne profile z inteligentnym wyszukiwaniem.
MVP: rejestracja, profile psów z rodowodem, przeglądanie i wyszukiwanie z filtrami.

## Context7
Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Tech Stack
| Warstwa | Technologia |
|---------|------------|
| Backend | Python 3.14 + FastAPI |
| ORM | SQLAlchemy 2.0 (async) + Alembic |
| Baza danych | PostgreSQL 16 (Docker) |
| Frontend | Next.js (React) + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui |
| Auth | JWT (access + refresh tokens) |
| State | TanStack Query v5 + React Hook Form |

## Tryb Współpracy (Learning Mode)
Ten projekt służy nauce — nie "vibe coding". Zasady:
1. **Claude wyjaśnia** — przed napisaniem kodu tłumaczy co, dlaczego i jak działa
2. **Użytkownik akceptuje** — dopiero po zrozumieniu daje zielone światło
3. **Krok po kroku** — implementacja w małych, zrozumiałych fragmentach

## Development Guidelines
- Komunikacja w języku **polskim**, komentarze w kodzie w **angielskim**
- Polskie URL-e (/psy, /logowanie) — user-friendly; angielski kod — standard
- Layer-based backend: models → schemas → services → routers
- Brak upload plików w MVP — zdjęcia jako URL string

## Kluczowe ścieżki
- venv: `backend/env/` (NIE `.venv/`)
- Alembic: `backend/env/Scripts/alembic`
- Docs faz: `docs/phases/phase-N.md`
- Pułapki techniczne: `docs/gotchas.md`
- Skills: `.claude/skills/`

## Commands

### Backend (z venv)
```bash
cd backend && env\Scripts\activate
pip install -e ".[dev]"
uvicorn app.main:app --reload   # http://localhost:8000/docs
pytest -v
```

### Frontend
```bash
cd frontend
npm install && npm run dev      # http://localhost:3000
npm run build && npm run lint
```

### Database (bez venv)
```bash
docker compose up -d
cd backend
env\Scripts\alembic upgrade head
env\Scripts\alembic revision --autogenerate -m "description"
env\Scripts\python -m app.seed.breeds
```

## API Endpoints
- `POST /api/auth/register|login|refresh` + `GET /api/auth/me`
- `GET|PUT /api/users/{id}` + `GET /api/users/{id}/dogs`
- `GET|POST /api/dogs/` + `GET|PUT|DELETE /api/dogs/{id}` + `GET /api/dogs/{id}/pedigree`
- `GET /api/breeds/` + `GET /api/breeds/{id}` + `GET /api/breeds/groups`

## Database Tables
- `users` — UUID PK, email, hashed_password, first_name, last_name, phone, city, voivodeship, bio, kennel_name, is_breeder, avatar_url, is_active
- `breeds` — INTEGER PK, name_pl, name_en, fci_number (UNIQUE), fci_group (1-10), fci_section, size_category ENUM, description_pl
- `dogs` — UUID PK, owner_id→users, breed_id→breeds, name, sex ENUM, date_of_birth, registration_number, microchip_number, sire_id→dogs, dam_id→dogs (self-ref pedigree), is_active (soft-delete)

## Implementation Status
- ✅ FAZA 0: Scaffolding — `docs/phases/phase-0.md`
- ✅ FAZA 1: Baza Danych — `docs/phases/phase-1.md`
- ✅ FAZA 2: Autentykacja — `docs/phases/phase-2.md`
- ✅ FAZA 3: Profile Użytkowników — `docs/phases/phase-3.md`
- ✅ CI/CD — `docs/phases/phase-cicd.md`
- ✅ FAZA 4: Profile Psów — `docs/phases/phase-4.md`
- ✅ FAZA 5: Wyszukiwanie i Odkrywanie — `docs/phases/phase-5.md`
- ⏳ FAZA 6: Frontend UI — NASTĘPNA
- 🔜 FAZA 7: Testy i Jakość
