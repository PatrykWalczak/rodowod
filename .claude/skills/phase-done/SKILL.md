# Skill: /phase-done

Uruchamiany po ukończeniu fazy (np. Fazy 5). Automatyzuje aktualizację dokumentacji projektu.

## Co zrobić

### 1. Ustal nazwę fazy
Sprawdź, która faza właśnie się skończyła (z kontekstu rozmowy lub argumentu komendy).

### 2. Utwórz/zaktualizuj docs/phases/phase-N.md

Plik powinien zawierać:
```markdown
# Faza N: Nazwa — ✅ UKOŃCZONA

## Zrobione
- lista plików/komponentów z krótkim opisem co robią

## Uwagi
- pułapki napotkane w tej fazie
- nieoczywiste decyzje implementacyjne
- co trzeba pamiętać przy modyfikacji
```

### 3. Zaktualizuj docs/gotchas.md

Jeśli w tej fazie napotkano nowe pułapki techniczne (niekompatybilności, edge cases, dziwne zachowania), dodaj je do odpowiedniej sekcji w `docs/gotchas.md`.

### 4. Zaktualizuj CLAUDE.md — sekcja Implementation Status

Znajdź linię z tą fazą i zmień `⏳` na `✅`:
```
### ✅ FAZA N: Nazwa — UKOŃCZONA
Szczegóły: docs/phases/phase-N.md
```

Następna faza: zmień `🔜` na `⏳ ... — NASTĘPNA`.

### 5. Zaktualizuj MEMORY.md

Znajdź sekcję `## Status faz` i zaktualizuj status tej fazy z `⏳` na `✅`.

## Przykład użycia

Użytkownik: `/phase-done` (po ukończeniu Fazy 5)

Claude:
1. Tworzy `docs/phases/phase-5.md` z podsumowaniem
2. Uzupełnia `docs/gotchas.md` jeśli były nowe pułapki
3. W `CLAUDE.md`: `⏳ FAZA 5` → `✅ FAZA 5`, `🔜 FAZA 6` → `⏳ FAZA 6 — NASTĘPNA`
4. W `MEMORY.md`: aktualizuje status faz
5. Potwierdza co zostało zaktualizowane
