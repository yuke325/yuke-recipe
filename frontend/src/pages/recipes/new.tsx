import { useState } from "react";
import { useRouter } from "next/router";

import { createRecipe } from "@/api/recipes";

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createRecipe({
        name,
        description: description,
      });
      await router.push("/recipes");
    } catch (error) {
      console.error("Failed to create recipe:", error);
      setErrorMessage("レシピの作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>新しいレシピを作成</h1>

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
          {isSubmitting ? "作成中..." : "作成する"}
        </button>
      </form>
    </main>
  );
}
