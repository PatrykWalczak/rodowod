# Faza 0: Scaffolding i Dev Environment — ✅ UKOŃCZONA

## Zrobione
- `.gitignore` — Python, Node, .env, IDE
- `docker-compose.yml` — PostgreSQL 16-alpine, port 5432, named volume `pgdata`
- `backend/pyproject.toml` — FastAPI, SQLAlchemy async, Alembic, JWT, bcrypt, ruff, pytest
- `backend/env/` — wirtualne środowisko Python (`pip install -e ".[dev]"`)
- `backend/.env` — DATABASE_URL, SECRET_KEY, tokeny, CORS
- `backend/app/main.py` — FastAPI app + CORS + health check `/api/health`
- `backend/app/config.py` — Pydantic Settings czytający `.env`
- `frontend/` — Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui
- `frontend/src/app/layout.tsx`, `page.tsx`, `globals.css` — bazowy szkielet

## Uwagi
- venv jest w `backend/env/` (NIE `.venv/`)
- Docker uruchamiany BEZ venv: `docker compose up -d`
- W katalogu głównym istnieje plik `nul` (Windows artifact)
