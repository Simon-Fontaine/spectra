"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Copy, CheckCircle2 } from "lucide-react";
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { cn } from "@/lib/utils";

interface Match {
  code: string;
  map: string;
  result: "Victory" | "Defeat" | "Draw";
}

export default function DashboardTeamReplaysPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 10;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
    setSuccess(null);

    try {
      const response = await fetch("/api/extract-codes", {
        method: "POST",
        body: formData,
      });

      const { replays, error } = await response.json();
      if (!response.ok || error) {
        throw new Error(error || "Failed to extract codes.");
      }

      setMatches(replays || []);
      setSuccess("Replay codes extracted successfully!");
    } catch (err: any) {
      setError(err.message || "An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: false,
  });

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getResultStyles = (result: string) => {
    switch (result) {
      case "Victory":
        return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
      case "Defeat":
        return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30";
      default:
        return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Overwatch Replay Code Extractor</PageHeaderHeading>
        <PageHeaderDescription>
          Upload a screenshot of your match history to extract replay codes
        </PageHeaderDescription>
      </div>

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

      {success && (
        <Alert className="mt-8">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {matches.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            Detected Matches ({matches.length})
          </h2>
          <div className="space-y-4">
            {matches.map((match, index) => (
              <Card
                key={index}
                className={cn(
                  "transition-all duration-200 ease-in-out",
                  copiedCode === match.code && "bg-primary/5"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <code className="text-lg font-mono">{match.code}</code>
                        <Button
                          onClick={() => handleCopy(match.code)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          {copiedCode === match.code ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="sr-only">Copy code</span>
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {match.map}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-semibold border",
                        getResultStyles(match.result)
                      )}
                    >
                      {match.result}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mt-12">Detected Matches</h2>
          <div className="mt-4 p-4 bg-primary/5 rounded-lg text-primary dark:text-primary/80">
            No matches detected yet. Upload a screenshot to extract replay
            codes.
          </div>
        </div>
      )}
    </div>
  );
}
