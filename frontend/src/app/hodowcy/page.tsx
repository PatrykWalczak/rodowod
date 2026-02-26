"use client";

import { useState } from "react";

import UserCard from "@/components/users/UserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "@/hooks/useUsers";
import type { UserFilters } from "@/lib/types";

const EMPTY = "__all__";

export default function HodowcyPage() {
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 20 });
  const { data, isLoading, isError } = useUsers(filters);

  const users = data?.items ?? [];
  const totalPages = data?.pages ?? 1;
  const currentPage = filters.page ?? 1;

  const set = (key: keyof UserFilters, value: unknown) =>
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));

  const clear = () => setFilters({ page: 1, limit: 20 });

  return (
    <div className="flex gap-6">
      {/* Sidebar filters */}
      <aside className="w-64 shrink-0">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Filtry</p>
            <Button variant="ghost" size="sm" onClick={clear}>
              Wyczyść
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label>Szukaj</Label>
            <Input
              placeholder="Imię, nazwisko lub hodowla…"
              value={filters.q ?? ""}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Typ konta</Label>
            <Select
              value={
                filters.is_breeder === undefined ? EMPTY : filters.is_breeder ? "true" : "false"
              }
              onValueChange={(v) =>
                set("is_breeder", v === EMPTY ? undefined : v === "true")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszyscy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY}>Wszyscy</SelectItem>
                <SelectItem value="true">Tylko hodowcy</SelectItem>
                <SelectItem value="false">Tylko właściciele</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Województwo</Label>
            <Input
              placeholder="np. małopolskie"
              value={filters.voivodeship ?? ""}
              onChange={(e) => set("voivodeship", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Miasto</Label>
            <Input
              placeholder="np. Kraków"
              value={filters.city ?? ""}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hodowcy i właściciele</h1>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.total}{" "}
              {data.total === 1 ? "osoba" : data.total < 5 ? "osoby" : "osób"}
            </p>
          )}
        </div>

        {isError && (
          <p className="text-sm text-destructive">
            Błąd wczytywania. Sprawdź czy backend jest uruchomiony.
          </p>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-4xl">👤</p>
            <p className="mt-3 font-medium">Brak wyników</p>
            <p className="text-sm text-muted-foreground">Spróbuj zmienić filtry</p>
          </div>
        )}

        {!isLoading && users.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

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
