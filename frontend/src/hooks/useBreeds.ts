import { useQuery } from "@tanstack/react-query";

import { api, buildQuery } from "@/lib/api";
import type { BreedListResponse, FciGroupResponse } from "@/lib/types";

export function useBreeds(q?: string) {
  return useQuery({
    queryKey: ["breeds", q],
    queryFn: () =>
      api.get<BreedListResponse>(`/api/breeds/${buildQuery({ q, limit: 200 })}`),
    staleTime: 10 * 60 * 1000, // breeds rarely change — cache for 10 minutes
  });
}

export function useFciGroups() {
  return useQuery({
    queryKey: ["breeds", "groups"],
    queryFn: () => api.get<FciGroupResponse[]>("/api/breeds/groups"),
    staleTime: 10 * 60 * 1000,
  });
}
