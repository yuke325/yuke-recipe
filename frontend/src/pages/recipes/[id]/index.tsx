import { useState } from "react";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AlertCircle, ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { deleteRecipe } from "@/api/recipes";
import { createApiClient } from "@/api/client";
import type { Recipe } from "@/openapi/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const handleDelete = async () => {
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
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{recipe.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">
              説明
            </h2>
            <p className="leading-relaxed whitespace-pre-wrap">
              {recipe.description || "説明はありません。"}
            </p>
          </div>

          <Separator />

          {errorMessage && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Pencil className="size-4" />
                編集する
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="size-4" />
                  {isDeleting ? "削除中..." : "削除する"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>レシピを削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    「{recipe.name}
                    」を削除します。この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    削除する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button asChild variant="outline">
              <Link href="/recipes">
                <ArrowLeft className="size-4" />
                一覧に戻る
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
