import type { GetServerSideProps } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { useRouter } from "next/router";
import { AlertCircle, ArrowLeft, Loader2, Pencil, Trash2 } from "lucide-react";

import { useRecipe, useDeleteRecipe } from "@/hooks/useRecipes";
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context);
};

export default function RecipeDetailPage() {
  const router = useRouter();
  const id = Number(router.query.id);

  const { data: recipe, isLoading, isError } = useRecipe(id);
  const deleteMutation = useDeleteRecipe();

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

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(recipe.id);
    await router.push("/recipes");
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

          {deleteMutation.isError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              レシピの削除に失敗しました。
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
                <Button
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="size-4" />
                  {deleteMutation.isPending ? "削除中..." : "削除する"}
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
