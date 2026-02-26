# Faza 4: Profile Psów — ✅ UKOŃCZONA

## Zrobione
- `backend/app/schemas/dog.py` — DogCreate, DogUpdate, DogResponse (z BreedInfo), DogListResponse, PedigreeNode
- `backend/app/services/dog_service.py` — create_dog, get_dog_by_id, update_dog, delete_dog, list_dogs, get_pedigree
- `backend/app/routers/dogs.py` — GET /, POST /, GET /{id}, PUT /{id}, DELETE /{id}, GET /{id}/pedigree

## Uwagi
- Soft-delete: `is_active=False` zamiast usuwania rekordu
- Paginacja: `-(-total // limit)` ceiling division bez math.ceil
- PedigreeNode rekurencyjny wymaga `model_rebuild()` po definicji klasy
- Swagger UI auto-wypełnia UUID — przy testach wysyłaj minimalny JSON bez opcjonalnych pól
- Filtry dynamiczne: WHERE dodawane tylko dla podanych parametrów
