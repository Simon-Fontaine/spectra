"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavigationButtonsProps {
  loginButton?: boolean;
}

export default function NavigationButtons({
  loginButton = true,
}: NavigationButtonsProps) {
  const router = useRouter();

  return (
    <>
      <Button
        className="group absolute left-4 top-4 md:left-8 md:top-8"
        onClick={() => router.back()}
        variant="ghost"
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>
      {loginButton ? (
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "group absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
          <Icons.chevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </>
  );
}
