import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { createApiClient } from "@/lib/apiClient";
import type { Recipe } from "@/openapi/api";

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
    return <p>レシピの取得に失敗しました。</p>;
  }

  if (recipes.length === 0) {
    return <p>レシピがありません。</p>;
  }

  return (
    <main>
      <h1>レシピ一覧</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.name}</li>
        ))}
      </ul>
    </main>
  );
}
