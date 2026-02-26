# Gotchas — Pułapki Techniczne

## Python / Backend

### passlib + bcrypt 5.x
passlib jest niekompatybilny z bcrypt >= 4.x. Używamy bcrypt bezpośrednio:
```python
import bcrypt
bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
```

### SQLAlchemy — rozwiązywanie relacji
models/__init__.py musi importować WSZYSTKIE modele. Inaczej SQLAlchemy nie rozwiąże forward references ("Dog", "User").
main.py musi importować `app.models` na starcie.

### Alembic — ścieżki
- Uruchamiać z: `backend/env/Scripts/alembic`
- alembic/ wykluczony z ruff (auto-generowany kod)

### Seed data
Seed wymaga importu wszystkich modeli przed uruchomieniem.
fci_number=None dla odmian dzielących numer FCI (jamniki, pudel miniaturowy/średni).

## Git / CI

### ruff w CI
- F821 ignorowane globalnie (forward references w SQLAlchemy)
- `[tool.setuptools.packages.find]` wymagane dla `pip install -e` w CI

### Swagger UI
Auto-wypełnia UUID placeholdery dla opcjonalnych pól. Przy testach używać minimalnego JSON.

## SQLAlchemy — wyszukiwanie przez relacje

### joinedload + explicit JOIN → konflikt
Gdy `list_dogs()` używa `options(joinedload(Dog.breed))` do eager loading, dodanie `.join(Breed)` dla filtrowania tworzy zduplikowany JOIN. Zamiast tego używaj subquery:
```python
# ŹLE — duplikuje JOIN
query = query.join(Breed).where(Breed.size_category == ...)

# DOBRZE — subquery
query = query.where(Dog.breed_id.in_(select(Breed.id).where(Breed.size_category == ...)))
```

### FastAPI — kolejność tras ze statycznym i dynamicznym segmentem
Trasy statyczne MUSZĄ być zdefiniowane przed dynamicznymi w tym samym routerze:
```python
@router.get("/groups")        # NAJPIERW statyczna
@router.get("/{breed_id}")    # POTEM dynamiczna (int)
```
Inaczej FastAPI próbuje rzutować "groups" → int → 422 zamiast dopasować statyczną trasę.

## Środowisko

### venv
- Lokalizacja: `backend/env/` (NIE `.venv/`)
- Docker uruchamiany BEZ venv
- Backend uruchamiany Z venv
