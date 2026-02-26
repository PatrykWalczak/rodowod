# Faza 3: Profile Użytkowników — ✅ UKOŃCZONA

## Zrobione
- `backend/app/schemas/dog.py` — minimalny DogResponse (rozbudowany w Fazie 4)
- `backend/app/services/user_service.py` — get_user_by_id, update_user, get_user_dogs
- `backend/app/routers/users.py` — GET /{user_id}, PUT /me, GET /{user_id}/dogs

## Uwagi
- Partial update: `model_dump(exclude_unset=True)` — aktualizuje tylko przesłane pola
