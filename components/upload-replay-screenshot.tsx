"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

const MAX_FILE_SIZE_MB = 10;

export default function UploadReplayScreenshot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/extract-codes", {
          method: "POST",
          body: formData,
        });

        const json = await response.json();
        if (!response.ok || json.error) {
          throw new Error(json.error || "Failed to extract codes.");
        }

        const { replays } = json;
        toast({
          title: "Success!",
          description: `Successfully extracted ${replays.length} replay code${replays.length === 1 ? "" : "s"}`,
        });

        // Refresh to show the newly uploaded codes
        router.refresh();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [router, toast, supabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "p-8 border-2 border-dashed rounded-lg text-center cursor-pointer",
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
