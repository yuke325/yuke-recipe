import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { requireAuth } from "@/lib/auth";

import { useCreateRecipe } from "@/hooks/useRecipes";
import type { RecipeFormValues } from "@/schemas/recipe";
import { RecipeForm } from "@/components/recipe-form";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await requireAuth(context);
  if ("redirect" in result) return result;
  return result;
};

export default function NewRecipePage() {
  const router = useRouter();
  const createMutation = useCreateRecipe();

  const handleSubmit = async (data: RecipeFormValues) => {
    await createMutation.mutateAsync(data);
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
