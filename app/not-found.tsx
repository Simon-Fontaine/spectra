"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h1 className="text-[8rem] md:text-[10rem] font-extrabold leading-none bg-clip-text text-transparent bg-gradient-to-b from-primary/80 to-primary/20">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
            Something's missing
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
