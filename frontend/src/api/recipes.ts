import { createApiClient } from "@/api/client"
import type {
  Recipe,
  RecipeCreateRequest,
  RecipeUpdateRequest,
} from "@/openapi/api"

export const listRecipes = async (): Promise<Recipe[]> => {
  const client = createApiClient()
  const response = await client.listRecipes()

  return response.data
}

export const getRecipe = async (id: number): Promise<Recipe> => {
  const client = createApiClient()
  const response = await client.getRecipe(id)

  return response.data
}

export const createRecipe = async (
  recipeCreateRequest: RecipeCreateRequest,
): Promise<Recipe> => {
  const client = createApiClient()
  const response = await client.createRecipe(recipeCreateRequest)

  return response.data
}

export const updateRecipe = async (
  id: number,
  recipeUpdateRequest: RecipeUpdateRequest,
): Promise<Recipe> => {
  const client = createApiClient()
  const response = await client.updateRecipe(id, recipeUpdateRequest)

  return response.data
}

export const deleteRecipe = async (id: number): Promise<void> => {
  const client = createApiClient()

  await client.deleteRecipe(id)
}
