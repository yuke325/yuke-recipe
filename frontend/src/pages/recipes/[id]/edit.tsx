import { useState } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { updateRecipe } from "@/api/recipes";
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
    console.error("Failed to fetch recipe for edit:", error);

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
  const [name, setName] = useState(recipe?.name ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (hasError || !recipe) {
    return (
      <main>
        <h1>レシピ編集</h1>
        <p>レシピの取得に失敗しました。</p>
        <p>
          <Link href="/recipes">一覧に戻る</Link>
        </p>
      </main>
    );
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await updateRecipe(recipe.id, {
        name,
        description,
      });
      await router.push(`/recipes/${recipe.id}`);
    } catch (error) {
      console.error("Failed to update recipe:", error);
      setErrorMessage("レシピの更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>レシピを編集</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">説明</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        {errorMessage ? <p>{errorMessage}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "更新中..." : "更新する"}
        </button>
      </form>

      <p>
        <Link href={`/recipes/${recipe.id}`}>詳細に戻る</Link>
      </p>
    </main>
  );
}
