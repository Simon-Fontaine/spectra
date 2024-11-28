"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Match {
  code: string;
  map: string;
  result: "Victory" | "Defeat" | "Draw";
}

export default function DashboardTeamReplaysPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const MAX_FILE_SIZE_MB = 10;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File size exceeds the ${MAX_FILE_SIZE_MB} MB limit.`);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/extract-codes", {
          method: "POST",
          body: formData,
        });

        const { replays, error } = await response.json();
        if (!response.ok || error) {
          throw new Error(error || "Failed to extract codes.");
        }

        toast({
          title: "Success!",
          description: `Successfully extracted ${replays.length} replay code${replays.length === 1 ? "" : "s"}`,
        });

        // Redirect to the history page
        router.push("/dashboard/team/replays-history");
      } catch (err: any) {
        setError(
          err.message || "An error occurred while processing the image."
        );
      } finally {
        setLoading(false);
      }
    },
    [router, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Overwatch Replay Code Extractor</PageHeaderHeading>
        <PageHeaderDescription>
          Upload a screenshot of your match history to extract replay codes
        </PageHeaderDescription>
      </div>

      <Button
        variant="outline"
        className="w-fit"
        onClick={() => router.push("/dashboard/team/replays-history")}
      >
        View Replay History
      </Button>

      <div
        {...getRootProps()}
        className={cn(
          "mt-8 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer",
          "transition-colors duration-200 ease-in-out",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragActive && "border-primary bg-accent"
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-primary">Drop the image here</p>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-muted-foreground/80">
                PNG, JPG up to {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Processing image...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
