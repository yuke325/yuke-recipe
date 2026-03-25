import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChefHat, LogOut, User } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/recipes"
            className="flex items-center gap-2 text-lg font-bold tracking-tight transition-colors hover:text-primary"
          >
            <ChefHat className="size-6 text-primary" />
            ゆけレシピ
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="size-4" />
                    <span className="hidden sm:inline">{session.user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
                    <LogOut className="size-4" />
                    サインアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <Separator />
      </header>
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-4xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </>
  );
}
