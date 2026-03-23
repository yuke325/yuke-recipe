import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { createRecipe } from "@/api/recipes";
import type { RecipeFormValues } from "@/types/recipeForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewRecipePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<RecipeFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: RecipeFormValues) => {
    clearErrors("root");

    try {
      await createRecipe(data);
      await router.push("/recipes");
    } catch (e) {
      console.error("Failed to create recipe:", e);
      setError("root", {
        type: "server",
        message: "レシピの作成に失敗しました。",
      });
    }
  };

  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>新しいレシピを作成</CardTitle>
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
              {isSubmitting ? "作成中..." : "作成する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
