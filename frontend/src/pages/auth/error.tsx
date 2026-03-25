import Link from "next/link";
import { useRouter } from "next/router";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "このドメインのメールアドレスではログインできません",
};

const DEFAULT_ERROR_MESSAGE = "認証中にエラーが発生しました。もう一度お試しください。";

export default function ErrorPage() {
  const { query } = useRouter();
  const error = typeof query.error === "string" ? query.error : "";
  const message = ERROR_MESSAGES[error] ?? DEFAULT_ERROR_MESSAGE;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <AlertCircle className="size-10 text-destructive" />
          </div>
          <CardTitle>サインインエラー</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter>
          <Button asChild className="w-full" variant="outline">
            <Link href="/auth/signin">サインインページへ戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
