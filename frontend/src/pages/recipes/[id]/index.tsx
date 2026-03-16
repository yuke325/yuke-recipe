import { useState } from "react";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { deleteRecipe } from "@/api/recipes";
import { createApiClient } from "@/api/client";
import type { Recipe } from "@/openapi/api";

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
  } catch (error) {
    console.error("Failed to fetch recipe:", error);

    return {
      props: {
        recipe: null,
        hasError: true,
      },
    };
  }
};

export default function RecipeDetailPage({
  recipe,
  hasError,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (hasError || !recipe) {
    return (
      <main>
        <h1>レシピ詳細</h1>
        <p>レシピの取得に失敗しました。</p>
        <p>
          <Link href="/recipes">一覧に戻る</Link>
        </p>
      </main>
    );
  }

  const handleDelete = async () => {
    const shouldDelete = window.confirm("このレシピを削除しますか？");

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");
    setIsDeleting(true);

    try {
      await deleteRecipe(recipe.id);
      await router.push("/recipes");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      setErrorMessage("レシピの削除に失敗しました。");
      setIsDeleting(false);
    }
  };

  return (
    <main>
      <h1>{recipe.name}</h1>
      <p>{recipe.description || "説明はありません。"}</p>

      {errorMessage ? <p>{errorMessage}</p> : null}

      <p>
        <Link href={`/recipes/${recipe.id}/edit`}>編集する</Link>
      </p>
      <p>
        <button type="button" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "削除中..." : "削除する"}
        </button>
      </p>
      <p>
        <Link href="/recipes">一覧に戻る</Link>
      </p>
    </main>
  );
}
