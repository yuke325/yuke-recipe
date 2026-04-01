import { createApiClient } from "@/api/client"
import type {
  Recipe,
  RecipeCreateRequest,
  RecipeUpdateRequest,
} from "@/openapi/api"

export const listRecipes = async (googleIdToken: string): Promise<Recipe[]> => {
  const client = createApiClient(googleIdToken)
  const response = await client.listRecipes()

  return response.data
}

export const getRecipe = async (googleIdToken: string, id: number): Promise<Recipe> => {
  const client = createApiClient(googleIdToken)
  const response = await client.getRecipe(id)

  return response.data
}

export const createRecipe = async (
  googleIdToken: string,
  recipeCreateRequest: RecipeCreateRequest,
): Promise<Recipe> => {
  const client = createApiClient(googleIdToken)
  const response = await client.createRecipe(recipeCreateRequest)

  return response.data
}

export const updateRecipe = async (
  googleIdToken: string,
  id: number,
  recipeUpdateRequest: RecipeUpdateRequest,
): Promise<Recipe> => {
  const client = createApiClient(googleIdToken)
  const response = await client.updateRecipe(id, recipeUpdateRequest)

  return response.data
}

export const deleteRecipe = async (googleIdToken: string, id: number): Promise<void> => {
  const client = createApiClient(googleIdToken)

  await client.deleteRecipe(id)
}
