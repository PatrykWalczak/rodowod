import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, buildQuery } from "@/lib/api";
import type { DogCreate, DogFilters, DogListResponse, DogResponse } from "@/lib/types";

export function useDogs(filters: DogFilters = {}) {
  return useQuery({
    queryKey: ["dogs", filters],
    queryFn: () =>
      api.get<DogListResponse>(`/api/dogs/${buildQuery(filters as Record<string, unknown>)}`),
  });
}

export function useDog(id: string) {
  return useQuery({
    queryKey: ["dogs", id],
    queryFn: () => api.get<DogResponse>(`/api/dogs/${id}`),
    enabled: !!id,
  });
}

export function useCreateDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DogCreate) => api.post<DogResponse>("/api/dogs/", data),
    onSuccess: () => {
      // Invalidate dog list so it refetches with the new dog
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    },
  });
}

export function useDeleteDog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/api/dogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    },
  });
}
