import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { updateRecipe } from "@/api/recipes";
import { createApiClient } from "@/api/client";
import type { Recipe } from "@/openapi/api";
import type { RecipeFormValues } from "@/types/recipeForm";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/recipe-form";

type Props = {
  recipe: Recipe | null;
  hasError: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const id = Number(params?.id);

  if (Number.isNaN(id)) {
    return {
      props: {
        recipe: null,
        hasError: true,
      },
    };
  }

  try {
    const apiClient = createApiClient();
    const response = await apiClient.getRecipe(id);

    return {
      props: {
        recipe: response.data,
        hasError: false,
      },
    };
  } catch (e) {
    console.error("Failed to fetch recipe for edit:", e);

    return {
      props: {
        recipe: null,
        hasError: true,
      },
    };
  }
};

export default function EditRecipePage({
  recipe,
  hasError,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (hasError || !recipe) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/5 p-12 text-center">
          <AlertCircle className="size-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">
            レシピが見つかりません
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            レシピの取得に失敗しました。
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/recipes">
              <ArrowLeft className="size-4" />
              一覧に戻る
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: RecipeFormValues) => {
    await updateRecipe(recipe.id, data);
    await router.push(`/recipes/${recipe.id}`);
  };

  return (
    <RecipeForm
      title="レシピを編集"
      defaultValues={{
        name: recipe.name,
        description: recipe.description ?? "",
      }}
      onSubmit={handleSubmit}
      submitLabel="更新する"
      submittingLabel="更新中..."
      serverErrorMessage="レシピの更新に失敗しました。"
      backHref={`/recipes/${recipe.id}`}
      backLabel="詳細に戻る"
    />
  );
}
