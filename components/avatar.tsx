"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null;
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      onUpload(publicUrl);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {url ? (
        <Label htmlFor="avatar">
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadAvatar}
            disabled={uploading}
          />
          <Image
            width={size}
            height={size}
            src={url}
            alt="Avatar"
            className="rounded-full cursor-pointer"
          />
        </Label>
      ) : (
        <>
          <Label htmlFor="avatar" className="sr-only">
            Avatar
          </Label>
          <Input
            id="avatar"
            type="file"
            disabled={uploading}
            accept="image/*"
            onChange={uploadAvatar}
          />
        </>
      )}
    </div>
  );
}
