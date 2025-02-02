"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="bg-gradient-to-b from-primary/80 to-primary/20 bg-clip-text font-extrabold text-[8rem] text-transparent leading-none md:text-[10rem]">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="font-bold font-heading text-2xl tracking-tight md:text-3xl">
            Something's missing
          </h2>
          <p className="mx-auto max-w-sm text-muted-foreground">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => router.back()}
            size="lg"
            className="w-full sm:w-auto"
          >
            Go back
          </Button>
          <Button
            onClick={() => router.push("/")}
            size="lg"
            variant="ghost"
            className="w-full sm:w-auto "
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
