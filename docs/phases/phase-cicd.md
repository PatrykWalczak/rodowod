# CI/CD — ✅ UKOŃCZONE

## Zrobione
- `.github/workflows/ci.yml` — pipeline Backend + Frontend (równolegle)
- Backend: `ruff check` + `pytest` (5 testów)
- Frontend: `npm run lint` + `npm run build`
- `backend/tests/test_health.py` — test health check
- `backend/tests/test_auth_schemas.py` — 4 testy walidacji schematów
- Repo: https://github.com/PatrykWalczak/rodowod.git

## Workflow
```
git checkout -b feature/nazwa
# praca...
git add . && git commit -m "feat: opis"
git push origin feature/nazwa
# GitHub → PR → CI → merge → git pull origin main → git branch -d feature/nazwa
```

## Konwencja commitów
- `feat:` nowa funkcja
- `fix:` naprawa błędu
- `chore:` konfiguracja/tooling
- `test:` testy
- `docs:` dokumentacja

## Uwagi
- `alembic/` wykluczony z ruff (auto-generowany kod)
- F821 ignorowane globalnie (forward references w SQLAlchemy)
- `[tool.setuptools.packages.find]` wymagane dla `pip install -e` w CI
