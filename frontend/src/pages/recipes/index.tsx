import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { createApiClient } from "@/api/client";
import type { Recipe } from "@/openapi/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  recipes: Recipe[];
  hasError: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.listRecipes();

    return {
      props: {
        recipes: response.data,
        hasError: false,
      },
    };
  } catch (error) {
    console.error("Failed to fetch recipes:", error);

    return {
      props: {
        recipes: [],
        hasError: true,
      },
    };
  }
};

export default function RecipesPage({
  recipes,
  hasError,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (hasError) {
    return (
      <main>
        <h1>レシピ一覧</h1>
        <p>レシピの取得に失敗しました。</p>
      </main>
    );
  }

  return (
    <main>
      <h1>レシピ一覧</h1>
      <Button asChild>
        <Link href="/recipes/new">新しいレシピを作成</Link>
      </Button>

      {recipes.length === 0 ? (
        <p>レシピがありません。</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Card>
                <CardContent>
                  <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
