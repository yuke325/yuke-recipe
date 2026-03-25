import type { GetServerSideProps } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { AlertCircle, ChefHat, Loader2, Plus } from "lucide-react";

import { useRecipes } from "@/hooks/useRecipes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await requireAuth(context);
  if ("redirect" in result) return result;
  return { props: {} };
};

export default function RecipesPage() {
  const { data: recipes, isLoading, isError } = useRecipes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/5 p-12 text-center">
        <AlertCircle className="size-12 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">エラーが発生しました</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          レシピの取得に失敗しました。
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">レシピ一覧</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {recipes?.length ?? 0}件のレシピ
          </p>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="size-4" />
            新しいレシピ
          </Link>
        </Button>
      </div>

      {recipes?.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <ChefHat className="size-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">レシピがありません</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            最初のレシピを作成してみましょう
          </p>
          <Button asChild className="mt-4">
            <Link href="/recipes/new">
              <Plus className="size-4" />
              新しいレシピを作成
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes?.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group"
            >
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="transition-colors group-hover:text-primary">
                    {recipe.name}
                  </CardTitle>
                  {recipe.description && (
                    <CardDescription className="line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
