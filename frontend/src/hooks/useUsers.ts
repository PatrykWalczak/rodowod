import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, buildQuery } from "@/lib/api";
import type { DogResponse, UserFilters, UserListResponse, UserResponse, UserUpdate } from "@/lib/types";

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () =>
      api.get<UserListResponse>(`/api/users/${buildQuery(filters as Record<string, unknown>)}`),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => api.get<UserResponse>(`/api/users/${id}`),
    enabled: !!id,
  });
}

export function useUserDogs(userId: string) {
  return useQuery({
    queryKey: ["users", userId, "dogs"],
    queryFn: () => api.get<DogResponse[]>(`/api/users/${userId}/dogs`),
    enabled: !!userId,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserUpdate) => api.put<UserResponse>("/api/users/me", data),
    onSuccess: (updated) => {
      // Update cached user data everywhere
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["users", updated.id], updated);
    },
  });
}
