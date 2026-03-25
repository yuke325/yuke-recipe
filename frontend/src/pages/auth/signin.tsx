import { signIn } from "next-auth/react";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/auth";
import type { GetServerSideProps } from "next";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <ChefHat className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">ゆけレシピ</CardTitle>
          <CardDescription>
            社内アカウントでサインインしてください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/recipes" })}
          >
            Googleでサインイン
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await requireAuth(context);
  if ("session" in result) {
    return { redirect: { destination: "/recipes", permanent: false } };
  }
  return { props: {} };
};
