"use client";

import { useState } from "react";

import DogCard from "@/components/dogs/DogCard";
import DogFilters from "@/components/dogs/DogFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDogs } from "@/hooks/useDogs";
import type { DogFilters as DogFiltersType } from "@/lib/types";

export default function PsyPage() {
  const [filters, setFilters] = useState<DogFiltersType>({ page: 1, limit: 20 });
  const { data, isLoading, isError } = useDogs(filters);

  const dogs = data?.items ?? [];
  const totalPages = data?.pages ?? 1;
  const currentPage = filters.page ?? 1;

  return (
    <div className="flex gap-6">
      {/* Sidebar filters */}
      <aside className="w-64 shrink-0">
        <DogFilters filters={filters} onChange={setFilters} />
      </aside>

      {/* Main content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Psy</h1>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.total} {data.total === 1 ? "wynik" : data.total < 5 ? "wyniki" : "wyników"}
            </p>
          )}
        </div>

        {/* Error state */}
        {isError && (
          <p className="text-sm text-destructive">
            Błąd wczytywania. Sprawdź czy backend jest uruchomiony.
          </p>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && dogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-4xl">🐾</p>
            <p className="mt-3 font-medium">Brak psów spełniających kryteria</p>
            <p className="text-sm text-muted-foreground">Spróbuj zmienić filtry</p>
          </div>
        )}

        {/* Dog grid */}
        {!isLoading && dogs.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: currentPage - 1 }))}
            >
              ← Poprzednia
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: currentPage + 1 }))}
            >
              Następna →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
