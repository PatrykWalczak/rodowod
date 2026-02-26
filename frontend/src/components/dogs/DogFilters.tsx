"use client";

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
import { useBreeds } from "@/hooks/useBreeds";
import type { DogFilters } from "@/lib/types";

interface DogFiltersProps {
  filters: DogFilters;
  onChange: (filters: DogFilters) => void;
}

const EMPTY = "__all__";

export default function DogFilters({ filters, onChange }: DogFiltersProps) {
  const { data: breedsData } = useBreeds();
  const breeds = breedsData?.items ?? [];

  const set = (key: keyof DogFilters, value: unknown) =>
    onChange({ ...filters, [key]: value || undefined, page: 1 });

  const clear = () => onChange({ page: 1 });

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">Filtry</p>
        <Button variant="ghost" size="sm" onClick={clear}>
          Wyczyść
        </Button>
      </div>

      {/* Dog name search */}
      <div className="space-y-1.5">
        <Label>Imię psa</Label>
        <Input
          placeholder="Szukaj po imieniu…"
          value={filters.name ?? ""}
          onChange={(e) => set("name", e.target.value)}
        />
      </div>

      {/* Breed */}
      <div className="space-y-1.5">
        <Label>Rasa</Label>
        <Select
          value={filters.breed_id?.toString() ?? EMPTY}
          onValueChange={(v) => set("breed_id", v === EMPTY ? undefined : Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wszystkie rasy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY}>Wszystkie rasy</SelectItem>
            {breeds.map((b) => (
              <SelectItem key={b.id} value={b.id.toString()}>
                {b.name_pl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sex */}
      <div className="space-y-1.5">
        <Label>Płeć</Label>
        <Select
          value={filters.sex ?? EMPTY}
          onValueChange={(v) => set("sex", v === EMPTY ? undefined : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Obie płcie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY}>Obie płcie</SelectItem>
            <SelectItem value="male">Pies</SelectItem>
            <SelectItem value="female">Suka</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Available for breeding */}
      <div className="space-y-1.5">
        <Label>Dostępność do rozrodu</Label>
        <Select
          value={
            filters.is_available_for_breeding === undefined
              ? EMPTY
              : filters.is_available_for_breeding
              ? "true"
              : "false"
          }
          onValueChange={(v) =>
            set("is_available_for_breeding", v === EMPTY ? undefined : v === "true")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Wszystkie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY}>Wszystkie</SelectItem>
            <SelectItem value="true">Dostępny do rozrodu</SelectItem>
            <SelectItem value="false">Niedostępny</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Voivodeship */}
      <div className="space-y-1.5">
        <Label>Województwo</Label>
        <Input
          placeholder="np. mazowieckie"
          value={filters.voivodeship ?? ""}
          onChange={(e) => set("voivodeship", e.target.value)}
        />
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <Label>Sortowanie</Label>
        <Select
          value={filters.sort_by ?? "newest"}
          onValueChange={(v) => set("sort_by", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Najnowsze</SelectItem>
            <SelectItem value="name">Alfabetycznie</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
