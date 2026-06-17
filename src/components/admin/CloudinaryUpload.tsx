// src/components/admin/CloudinaryUpload.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CloudinaryUploadProps {
  /** Callback with the uploaded file URL */
  onUpload: (url: string) => void;
  /** Accepted mime types, e.g. "image/*" */
  accept?: string;
  /** Optional placeholder text */
  placeholder?: string;
}

export default function CloudinaryUpload({
  onUpload,
  accept = "image/*",
  placeholder = "Select media",
}: CloudinaryUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const upload = async () => {
    if (!file) return;
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing.");
      return;
    }
    setUploading(true);
    setError("");
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
        // reset state
        setFile(null);
        setPreview("");
      } else {
        setError(data.error?.message || "Upload failed");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {preview && (
        <div className="relative w-32 h-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="object-cover w-full h-full rounded" />
        </div>
      )}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
        id="cloudinary-upload-input"
      />
      <label htmlFor="cloudinary-upload-input" className="cursor-pointer">
        <Button variant="outline" disabled={uploading}>
          {preview ? "Change Media" : placeholder}
        </Button>
      </label>
      {file && !uploading && (
        <Button onClick={upload} disabled={uploading} className="w-max">
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
