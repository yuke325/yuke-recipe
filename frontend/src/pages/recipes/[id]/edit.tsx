import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { updateRecipe } from "@/api/recipes";
import { createApiClient } from "@/api/client";
import type { Recipe } from "@/openapi/api";
import type { RecipeFormValues } from "@/types/recipeForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<RecipeFormValues>({
    defaultValues: {
      name: recipe?.name ?? "",
      description: recipe?.description ?? "",
    },
  });

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

  const onSubmit = async (data: RecipeFormValues) => {
    clearErrors("root");

    try {
      await updateRecipe(recipe.id, data);
      await router.push(`/recipes/${recipe.id}`);
    } catch (e) {
      console.error("Failed to update recipe:", e);
      setError("root", {
        type: "server",
        message: "レシピの更新に失敗しました。",
      });
    }
  };

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>レシピを編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                type="text"
                {...register("name", { required: "名前は必須です" })}
              />
              {errors.name ? <p>{errors.name.message}</p> : null}
            </div>

            <div>
              <Label htmlFor="description">説明</Label>
              <Textarea id="description" {...register("description")} />
            </div>

            {errors.root ? <p>{errors.root.message}</p> : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "更新中..." : "更新する"}
            </Button>
          </form>

          <Button asChild variant="outline">
            <Link href={`/recipes/${recipe.id}`}>詳細に戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
