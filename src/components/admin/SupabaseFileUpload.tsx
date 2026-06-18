'use client';

import React, { useState, ChangeEvent } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

interface SupabaseFileUploadProps {
  onUpload: (url: string) => void;
  bucket: string;
  accept?: string;
  placeholder?: string;
}

export default function SupabaseFileUpload({
  onUpload,
  bucket,
  accept = "application/pdf",
  placeholder = "Select File",
}: SupabaseFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      setFile(selected);
      setSuccess(false);
      setError("");
    }
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    
    const filePath = `${Date.now()}_${file.name}`;
    
    try {
      const { error: uploadError } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        onUpload(data.publicUrl);
        setSuccess(true);
      } else {
        setError("Failed to get public URL");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
        id={`supabase-upload-${bucket}`}
      />
      <div className="flex items-center gap-3">
        <label 
          htmlFor={`supabase-upload-${bucket}`} 
          className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {file ? "Change File" : placeholder}
        </label>
        {file && <span className="text-sm text-slate-500 truncate max-w-[200px]">{file.name}</span>}
      </div>
      
      {file && !uploading && !success && (
        <button 
          onClick={upload} 
          type="button"
          disabled={uploading} 
          className="w-max bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Upload File
        </button>
      )}
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      {success && <p className="text-sm text-green-600">Upload successful!</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
