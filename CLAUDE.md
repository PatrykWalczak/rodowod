# RodoWod

## Project Overview
Platforma społecznościowa dla właścicieli i hodowców psów rasowych w Polsce.
"LinkedIn meets Tinder for pedigree dogs" - profesjonalne profile z inteligentnym wyszukiwaniem.
Zastępuje rozproszone grupy na Facebooku i przestarzałe fora hodowlane.
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
| UI | Tailwind CSS + shadcn/ui |
| Auth | JWT (access + refresh tokens) |

## Project Structure
```
RodoWod/
├── docker-compose.yml
├── CLAUDE.md
├── .gitignore
├── backend/
│   ├── pyproject.toml
│   ├── alembic.ini
│   ├── alembic/versions/
│   └── app/
│       ├── main.py              # FastAPI entry point, CORS
│       ├── config.py            # Pydantic Settings (.env)
│       ├── dependencies.py      # get_db, get_current_user
│       ├── db/
│       │   ├── base.py          # DeclarativeBase
│       │   └── session.py       # async engine + session
│       ├── models/              # SQLAlchemy ORM models
│       │   ├── user.py
│       │   ├── dog.py
│       │   └── breed.py
│       ├── schemas/             # Pydantic request/response
│       │   ├── auth.py
│       │   ├── user.py
│       │   ├── dog.py
│       │   └── breed.py
│       ├── routers/             # API route handlers
│       │   ├── auth.py
│       │   ├── users.py
│       │   ├── dogs.py
│       │   └── breeds.py
│       ├── services/            # Business logic layer
│       │   ├── auth_service.py
│       │   ├── user_service.py
│       │   └── dog_service.py
│       ├── core/
│       │   ├── security.py      # JWT + password hashing
│       │   └── exceptions.py
│       └── seed/
│           └── breeds.py        # FCI breed data (50+ ras)
└── frontend/
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    └── src/
        ├── app/
        │   ├── layout.tsx       # Root layout
        │   ├── page.tsx         # Landing page "/"
        │   ├── (auth)/
        │   │   ├── logowanie/page.tsx
        │   │   └── rejestracja/page.tsx
        │   └── (main)/
        │       ├── layout.tsx   # Navbar + Footer
        │       ├── psy/
        │       │   ├── page.tsx       # Wyszukiwarka psów
        │       │   └── [id]/page.tsx  # Profil psa
        │       ├── profil/
        │       │   ├── page.tsx       # Mój profil
        │       │   └── edycja/page.tsx
        │       └── moje-psy/
        │           ├── page.tsx       # Lista moich psów
        │           ├── dodaj/page.tsx # Dodaj psa
        │           └── [id]/edycja/page.tsx
        ├── components/
        │   ├── ui/              # shadcn/ui
        │   ├── layout/          # Navbar, Footer
        │   ├── dogs/            # DogCard, DogFilters, DogGrid, PedigreeTree
        │   ├── auth/            # LoginForm, RegisterForm
        │   └── profile/         # UserProfileCard
        ├── lib/
        │   ├── api.ts           # Fetch wrapper + auth interceptor
        │   ├── auth.ts          # Token management
        │   └── validations.ts   # Zod schemas
        ├── hooks/               # useAuth, useDogs, useDebounce
        ├── contexts/            # AuthContext
        └── types/               # TypeScript interfaces
```

## Tryb Współpracy (Learning Mode)
Ten projekt służy nauce - nie "vibe coding". Zasady współpracy:
1. **Claude wyjaśnia** - przed napisaniem kodu tłumaczy co, dlaczego i jak działa
2. **Użytkownik akceptuje** - dopiero po zrozumieniu daje zielone światło na implementację
3. **Pytania mile widziane** - każda wątpliwość to okazja do nauki
4. **Krok po kroku** - implementacja w małych, zrozumiałych fragmentach

Cel: po zakończeniu projektu użytkownik rozumie każdą linijkę kodu i potrafi samodzielnie rozwijać aplikację.

## Development Guidelines
- Komunikacja w języku polskim
- Komentarze w kodzie w języku angielskim
- Polskie URL-e (/psy, /logowanie) - user-friendly; angielski kod - standard branżowy
- Layer-based backend: models → schemas → services → routers
- Async SQLAlchemy - unika blokowania event loop FastAPI
- Self-referential pedigree (sire_id/dam_id) - recursive CTE w PostgreSQL
- Brak upload plików w MVP - zdjęcia jako URL

## Commands

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -e ".[dev]"
uvicorn app.main:app --reload   # Dev server: http://localhost:8000
# Swagger UI: http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev                     # Dev server: http://localhost:3000
npm run build                   # Production build
npm run lint                    # ESLint
```

### Database
```bash
docker compose up -d            # Start PostgreSQL
docker compose down             # Stop PostgreSQL
cd backend
alembic upgrade head            # Run migrations
alembic revision --autogenerate -m "description"  # New migration
python -m app.seed.breeds       # Seed breed data
```

### Testing
```bash
cd backend
pytest -v                       # Run all tests
cd ../frontend
npm run lint                    # Lint check
```

## API Endpoints

### Auth: `/api/auth`
- `POST /register` - rejestracja
- `POST /login` - logowanie (zwraca JWT)
- `POST /refresh` - odświeżenie tokenu
- `GET /me` - aktualny użytkownik

### Users: `/api/users`
- `GET /{id}` - profil publiczny
- `PUT /me` - edycja profilu (auth)
- `GET /{id}/dogs` - psy użytkownika

### Dogs: `/api/dogs`
- `GET /` - wyszukiwanie z filtrami + paginacja
- `POST /` - dodaj psa (auth)
- `GET /{id}` - profil psa
- `PUT /{id}` - edytuj psa (owner only)
- `DELETE /{id}` - soft-delete (owner only)
- `GET /{id}/pedigree?generations=3` - drzewo rodowodowe

### Breeds: `/api/breeds`
- `GET /` - lista ras (z wyszukiwaniem)
- `GET /{id}` - szczegóły rasy
- `GET /groups` - grupy FCI

## Database Schema

### `users`
- `id` UUID PK, `email` VARCHAR(255) UNIQUE NOT NULL, `hashed_password` VARCHAR(255) NOT NULL
- `first_name`, `last_name` VARCHAR(100) NOT NULL
- `phone` VARCHAR(20), `city` VARCHAR(100), `voivodeship` VARCHAR(50)
- `bio` TEXT, `kennel_name` VARCHAR(200), `is_breeder` BOOLEAN DEFAULT false
- `avatar_url` VARCHAR(500), `is_active` BOOLEAN DEFAULT true
- `created_at`, `updated_at` TIMESTAMP

### `breeds`
- `id` INTEGER PK SERIAL
- `name_pl` VARCHAR(200) UNIQUE NOT NULL, `name_en` VARCHAR(200)
- `fci_number` INTEGER UNIQUE, `fci_group` INTEGER (1-10), `fci_section` INTEGER
- `size_category` ENUM ('mini','small','medium','large','giant')
- `description_pl` TEXT, `image_url` VARCHAR(500)

### `dogs`
- `id` UUID PK, `owner_id` UUID FK→users, `breed_id` INTEGER FK→breeds
- `name` VARCHAR(200) NOT NULL, `call_name` VARCHAR(100)
- `sex` ENUM ('male','female') NOT NULL, `date_of_birth` DATE NOT NULL
- `color` VARCHAR(100), `registration_number` VARCHAR(100) UNIQUE (PKR/ZKwP)
- `microchip_number` VARCHAR(50) UNIQUE
- `sire_id` UUID FK→dogs (ojciec, self-referential), `dam_id` UUID FK→dogs (matka, self-referential)
- `health_tests` TEXT, `titles` VARCHAR(500), `description` TEXT
- `is_available_for_breeding` BOOLEAN, `photo_url` VARCHAR(500)
- `is_active` BOOLEAN DEFAULT true, `created_at`, `updated_at` TIMESTAMP

## Implementation Status

### ✅ FAZA 0: Scaffolding i Dev Environment — UKOŃCZONA
Wszystko zweryfikowane i działa.

**Zrobione:**
- `.gitignore` — Python, Node, .env, IDE
- `docker-compose.yml` — PostgreSQL 16-alpine, port 5432, named volume `pgdata`
- `backend/pyproject.toml` — FastAPI, SQLAlchemy async, Alembic, JWT, bcrypt, ruff, pytest
- `backend/.venv/` — wirtualne środowisko Python, zależności zainstalowane (`pip install -e ".[dev]"`)
- `backend/.env` — DATABASE_URL, SECRET_KEY, tokeny, CORS
- `backend/app/main.py` — FastAPI app + CORS middleware + health check `/api/health`
- `backend/app/config.py` — Pydantic Settings czytający `.env`
- `frontend/` — Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui (node_modules zainstalowane)
- `frontend/src/app/layout.tsx`, `page.tsx`, `globals.css` — bazowy szkielet
- `frontend/src/lib/utils.ts` — funkcja `cn()` dla shadcn/ui
- `CLAUDE.md` — pełna dokumentacja projektu

**Uwaga:** W katalogu głównym istnieje plik `nul` (Windows artifact, można usunąć).

**Weryfikacja:**
- Backend startuje: `cd backend && env\Scripts\activate && uvicorn app.main:app --reload`
- Frontend startuje: `cd frontend && npm run dev`
- Docker: `docker compose up -d` (bez venv!)
- venv jest w `backend/env/` (nie `.venv/`)

### ✅ FAZA 1: Baza Danych — UKOŃCZONA

**Zrobione:**
- `backend/app/db/base.py` — SQLAlchemy `DeclarativeBase`
- `backend/app/db/session.py` — async engine (`asyncpg`) + `AsyncSessionLocal`
- `backend/app/models/breed.py` — model `Breed` z enum `SizeCategory`
- `backend/app/models/user.py` — model `User` z UUID PK
- `backend/app/models/dog.py` — model `Dog` z self-referential pedigree (sire_id/dam_id)
- `backend/alembic/` — Alembic zainicjowany z szablonem `async`
- `backend/alembic/env.py` — skonfigurowany: importuje modele, URL z `config.py`
- `backend/alembic/versions/9855948d5c2a_initial_schema_users_breeds_dogs.py` — pierwsza migracja
- `backend/app/seed/breeds.py` — 57 ras FCI (wszystkie 10 grup), zweryfikowane z fci.be
- Tabele w PostgreSQL: `users`, `breeds`, `dogs`, `alembic_version`

**Dodane do frontendu (między Fazą 0 a 1):**
- `@tanstack/react-query` + `@tanstack/react-query-devtools`
- `react-hook-form` + `@hookform/resolvers`
- `frontend/src/app/providers.tsx` — `QueryClientProvider` + devtools
- `frontend/src/app/layout.tsx` — zaktualizowany: lang="pl", title="RodoWod", Providers

**Uwagi implementacyjne:**
- Seed wymaga importu wszystkich modeli (`user`, `dog`) aby SQLAlchemy rozwiązał relacje
- Odmiany ras dzielące numer FCI mają `fci_number=None` (jamniki, pudel miniaturowy/średni)
- Alembic uruchamiany z: `backend/env/Scripts/alembic`

### ✅ FAZA 2: System Autentykacji — UKOŃCZONA

**Zrobione:**
- `backend/app/core/security.py` — hashowanie haseł (bcrypt bezpośrednio, bez passlib) + JWT
- `backend/app/schemas/auth.py` — RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
- `backend/app/schemas/user.py` — UserResponse, UserUpdate
- `backend/app/services/auth_service.py` — register, login, refresh_tokens
- `backend/app/dependencies.py` — get_db (yield session), get_current_user (JWT → User)
- `backend/app/routers/auth.py` — POST /register, POST /login, POST /refresh, GET /me
- `backend/app/models/__init__.py` — importuje wszystkie modele (fix SQLAlchemy relationship resolution)
- `backend/app/main.py` — podpięty router auth, import app.models na starcie

**Uwagi implementacyjne:**
- passlib niekompatybilny z bcrypt 5.x — używamy bcrypt bezpośrednio
- models/__init__.py musi importować wszystkie modele — inaczej SQLAlchemy nie rozwiąże relacji
- Ten sam komunikat błędu dla złego emaila i złego hasła (security best practice)
- Refresh token weryfikuje typ (`type == "refresh"`) — nie można użyć access tokenu jako refresh

### ✅ FAZA 3: Profile Użytkowników — UKOŃCZONA

**Zrobione:**
- `backend/app/schemas/dog.py` — minimalny DogResponse (rozbudowany w Fazie 4)
- `backend/app/services/user_service.py` — get_user_by_id, update_user, get_user_dogs
- `backend/app/routers/users.py` — GET /{user_id}, PUT /me, GET /{user_id}/dogs
- `backend/app/main.py` — podpięty router users

### ⏳ CI/CD — NASTĘPNE (przed Fazą 4)
### 🔜 FAZA 3: Profile Użytkowników
### 🔜 FAZA 4: Profile Psów - CRUD
### 🔜 FAZA 5: Wyszukiwanie i Odkrywanie
### 🔜 FAZA 6: Polish i Responsive Design
### 🔜 FAZA 7: Testy i Jakość

## Architectural Decisions
- **Async SQLAlchemy** — best practice dla FastAPI, unika blokowania event loop
- **JWT w localStorage** — prostsze dla MVP; produkcja: HttpOnly cookies
- **Self-referential pedigree** (sire_id/dam_id na tabeli dogs) — naturalny model domeny, recursive CTE w PostgreSQL
- **Polskie URL-e** (/psy, /logowanie) — user-friendly; angielski kod — standard branżowy
- **Layer-based backend** (models→schemas→services→routers) — mapuje się na dokumentację FastAPI, łatwiejsze do nauki
- **shadcn/ui** — kopiuje źródła komponentów do projektu, pełna kontrola, zero runtime overhead
- **Brak upload plików w MVP** — zdjęcia jako URL string, upload (S3/MinIO) w post-MVP

