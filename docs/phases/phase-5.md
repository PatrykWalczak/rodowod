# Faza 5: Wyszukiwanie i Odkrywanie — ✅ UKOŃCZONA

## Zrobione

### Nowe pliki
- `backend/app/schemas/breed.py` — schematy Pydantic: `BreedResponse`, `BreedListResponse`, `FciGroupResponse`
- `backend/app/services/breed_service.py` — logika: `list_breeds()`, `get_breed_by_id()`, `list_fci_groups()`
- `backend/app/routers/breeds.py` — 3 endpointy REST dla ras

### Zmodyfikowane pliki
- `backend/app/main.py` — rejestracja `breeds.router`
- `backend/app/services/dog_service.py` — rozszerzenie `list_dogs()` o 6 nowych filtrów + sortowanie
- `backend/app/routers/dogs.py` — nowe Query() parametry dla rozszerzonego wyszukiwania
- `backend/app/schemas/user.py` — dodany `UserListResponse`
- `backend/app/services/user_service.py` — nowa funkcja `list_users()`
- `backend/app/routers/users.py` — nowy endpoint `GET /api/users/`

### Nowe endpointy

**Rasy:**
```
GET /api/breeds/         — lista ras (q, fci_group, size_category, page, limit)
GET /api/breeds/groups   — grupy FCI z liczbą ras
GET /api/breeds/{id}     — szczegóły rasy
```

**Psy — rozszerzone filtry:**
```
GET /api/dogs/?name=...&voivodeship=...&city=...&size_category=...&fci_group=...&sort_by=newest|name
```

**Użytkownicy:**
```
GET /api/users/          — lista użytkowników (q, is_breeder, city, voivodeship, page, limit)
```

## Uwagi

### Filtrowanie przez relacje — subquery zamiast JOIN
Filtry po atrybutach rasy (`size_category`, `fci_group`) i lokalizacji właściciela (`city`, `voivodeship`)
używają subquery zamiast explicit JOIN:
```python
# Zamiast .join(Breed) — koliduje z joinedload(Dog.breed)
query = query.where(Dog.breed_id.in_(select(Breed.id).where(Breed.size_category == size_category)))
```
Powód: `joinedload(Dog.breed)` już robi LEFT OUTER JOIN dla eager loading. Dodanie explicit `.join(Breed)`
tworzyłoby zduplikowany JOIN. Subquery omija ten problem całkowicie.

### Kolejność tras w routerze breeds
`GET /api/breeds/groups` musi być zdefiniowany PRZED `GET /api/breeds/{breed_id}`.
Inaczej FastAPI próbowałby rzutować "groups" na `int` → błąd 422 zamiast 200.

### Wyszukiwanie tekstowe — OR na nullable kolumnach
W `list_users()` wyszukiwanie `q` używa OR na trzech polach, z których `kennel_name` może być NULL.
SQLAlchemy poprawnie obsługuje `ilike` na NULL (zwraca NULL, nie False), więc filtr działa prawidłowo.
