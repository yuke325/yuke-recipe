import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  listRecipes,
  updateRecipe,
} from "@/api/recipes";
import type { RecipeCreateRequest, RecipeUpdateRequest } from "@/openapi/api";

export const recipeKeys = {
  all: ["recipes"] as const,
  detail: (id: number) => ["recipes", id] as const,
};

export function useRecipes() {
  return useQuery({
    queryKey: recipeKeys.all,
    queryFn: listRecipes,
  });
}

export function useRecipe(id: number) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipe(id),
    enabled: !Number.isNaN(id),
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipeCreateRequest) => createRecipe(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RecipeUpdateRequest }) =>
      updateRecipe(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRecipe(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}
