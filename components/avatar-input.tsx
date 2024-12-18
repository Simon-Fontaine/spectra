"use client";

import React, { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/getCroppedImg";
import { Slider } from "./ui/slider";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type AvatarProps = {
  uid: string | null;
  url: string | null;
  username: string;
  setUploading: (uploading: boolean) => void;
  uploading: boolean;
  onUpload: (url: string) => void;
};

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function AvatarInput({
  uid,
  url,
  username,
  setUploading,
  uploading,
  onUpload,
}: AvatarProps) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onCropComplete = useCallback(
    (croppedArea: CroppedArea, croppedAreaPx: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPx);
    },
    []
  );

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result) {
        setPreviewUrl(fileReader.result as string);
        setOpen(true);
      }
    };
    fileReader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uid || !selectedFile || !croppedAreaPixels) return;

    setUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(
        previewUrl!,
        croppedAreaPixels
      );

      if (!croppedImageBlob) {
        throw new Error("Failed to crop image.");
      }

      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, croppedImageBlob);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      onUpload(publicUrl);

      if (url && url !== publicUrl) {
        const oldFileName = url.split("/avatars/")[1];
        if (oldFileName) {
          await supabase.storage.from("avatars").remove([oldFileName]);
        }
      }

      setOpen(false);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="avatar-input" className="sr-only">
          Choose a new avatar
        </Label>
        <Input
          id="avatar-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
          aria-label="Select a new avatar to upload"
        />
        <Avatar
          className="rounded-lg h-20 w-20 cursor-pointer"
          onClick={() => {
            const input = document.getElementById("avatar-input");
            if (input) {
              input.click();
            }
          }}
        >
          <AvatarImage src={url || undefined} alt="Your current avatar" />
          <AvatarFallback className="rounded-lg">
            {username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg"
          aria-busy={uploading ? "true" : "false"}
        >
          <DialogHeader>
            <DialogTitle>Crop your avatar</DialogTitle>
            <DialogDescription>
              Use the slider and drag your image to crop your avatar into a
              square. When you are done, press the "Save changes" button.
            </DialogDescription>
          </DialogHeader>

          <div
            className="relative w-full h-64 bg-black"
            aria-label="Image cropping area"
            role="region"
          >
            {previewUrl && (
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                restrictPosition={false}
                showGrid={false}
              />
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Label htmlFor="avatar-zoom" className="sr-only">
              Zoom level
            </Label>
            <Slider
              id="avatar-zoom"
              aria-label="Zoom level"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>

          <DialogFooter>
            <Button
              className="mt-2 sm:mt-0"
              variant="outline"
              onClick={() => setOpen(false)}
              aria-label="Cancel and close the crop dialog"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              aria-label="Save cropped avatar"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? "Saving changes..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
