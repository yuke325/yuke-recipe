import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { createRecipe } from "@/api/recipes";
import type { RecipeFormValues } from "@/types/recipeForm";

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
      <h1>新しいレシピを作成</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "名前は必須です" })}
          />
          {errors.name ? <p>{errors.name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="description">説明</label>
          <textarea id="description" {...register("description")} />
        </div>

        {errors.root ? <p>{errors.root.message}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "作成中..." : "作成する"}
        </button>
      </form>
    </main>
  );
}
