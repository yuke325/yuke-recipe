import type { GetServerSideProps } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { useRouter } from "next/router";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { useRecipe, useUpdateRecipe } from "@/hooks/useRecipes";
import type { RecipeFormValues } from "@/schemas/recipe";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/recipe-form";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context);
};

export default function EditRecipePage() {
  const router = useRouter();
  const id = Number(router.query.id);

  const { data: recipe, isLoading, isError } = useRecipe(id);
  const updateMutation = useUpdateRecipe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !recipe) {
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
    await updateMutation.mutateAsync({ id: recipe.id, data });
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
