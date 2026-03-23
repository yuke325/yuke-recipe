import Link from "next/link";
import { ChefHat } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
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
          <ModeToggle />
        </div>
        <Separator />
      </header>
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-4xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </>
  );
}
