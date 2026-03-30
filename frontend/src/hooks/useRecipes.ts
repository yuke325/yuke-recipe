import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: recipeKeys.all,
    queryFn: async () => {
      if (!session?.googleIdToken) {
        throw new Error("Google ID token is missing");
      }

      return listRecipes(session.googleIdToken);
    },
    enabled: status === "authenticated" && !!session?.googleIdToken,
  });
}

export function useRecipe(id: number) {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: async () => {
      if (!session?.googleIdToken) {
        throw new Error("Google ID token is missing");
      }

      return getRecipe(session.googleIdToken, id);
    },
    enabled:
      status === "authenticated" &&
      !!session?.googleIdToken &&
      !Number.isNaN(id),
  });
}

export function useCreateRecipe() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecipeCreateRequest) => {
      if (!session?.googleIdToken) {
        throw new Error("Google ID token is missing");
      }

      return createRecipe(session.googleIdToken, data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}

export function useUpdateRecipe() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: RecipeUpdateRequest;
    }) => {
      if (!session?.googleIdToken) {
        throw new Error("Google ID token is missing");
      }

      return updateRecipe(session.googleIdToken, id, data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}

export function useDeleteRecipe() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!session?.googleIdToken) {
        throw new Error("Google ID token is missing");
      }

      return deleteRecipe(session.googleIdToken, id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}
