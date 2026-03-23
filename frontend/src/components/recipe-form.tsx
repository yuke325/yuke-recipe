import Link from "next/link";
import { useForm } from "react-hook-form";

import type { RecipeFormValues } from "@/types/recipeForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RecipeFormProps = {
  title: string;
  defaultValues: RecipeFormValues;
  onSubmit: (data: RecipeFormValues) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
  serverErrorMessage: string;
  backHref: string;
  backLabel: string;
};

export function RecipeForm({
  title,
  defaultValues,
  onSubmit,
  submitLabel,
  submittingLabel,
  serverErrorMessage,
  backHref,
  backLabel,
}: RecipeFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<RecipeFormValues>({ defaultValues });

  const handleFormSubmit = async (data: RecipeFormValues) => {
    clearErrors("root");

    try {
      await onSubmit(data);
    } catch (e) {
      console.error("Form submission failed:", e);
      setError("root", {
        type: "server",
        message: serverErrorMessage,
      });
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "名前は必須です" })}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea id="description" rows={4} {...register("description")} />
          </div>

          {errors.root && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errors.root.message}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
            <Button asChild variant="outline">
              <Link href={backHref}>{backLabel}</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
