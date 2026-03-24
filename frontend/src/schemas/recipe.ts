import { z } from "zod";

export const recipeFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "レシピ名は必須です" })
    .max(255, { message: "レシピ名は255文字以内で入力してください" }),
  description: z.string(),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
