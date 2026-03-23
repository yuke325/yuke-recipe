import { useRouter } from "next/router";

import { createRecipe } from "@/api/recipes";
import type { RecipeFormValues } from "@/types/recipeForm";
import { RecipeForm } from "@/components/recipe-form";

export default function NewRecipePage() {
  const router = useRouter();

  const handleSubmit = async (data: RecipeFormValues) => {
    await createRecipe(data);
    await router.push("/recipes");
  };

  return (
    <RecipeForm
      title="新しいレシピを作成"
      defaultValues={{ name: "", description: "" }}
      onSubmit={handleSubmit}
      submitLabel="作成する"
      submittingLabel="作成中..."
      serverErrorMessage="レシピの作成に失敗しました。"
      backHref="/recipes"
      backLabel="一覧に戻る"
    />
  );
}
