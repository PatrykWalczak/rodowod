# Faza 2: System Autentykacji — ✅ UKOŃCZONA

## Zrobione
- `backend/app/core/security.py` — bcrypt (bezpośrednio, bez passlib) + JWT
- `backend/app/schemas/auth.py` — RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
- `backend/app/schemas/user.py` — UserResponse, UserUpdate
- `backend/app/services/auth_service.py` — register, login, refresh_tokens
- `backend/app/dependencies.py` — get_db (yield session), get_current_user (JWT → User)
- `backend/app/routers/auth.py` — POST /register, POST /login, POST /refresh, GET /me
- `backend/app/models/__init__.py` — importuje wszystkie modele

## Uwagi
- passlib niekompatybilny z bcrypt 5.x — używamy bcrypt bezpośrednio
- models/__init__.py importuje wszystkie modele — SQLAlchemy musi widzieć wszystkie przy starcie
- main.py importuje `app.models` na starcie (fix relationship resolution)
- Ten sam błąd dla złego emaila i złego hasła (security best practice)
- Refresh token weryfikuje typ `type == "refresh"`
