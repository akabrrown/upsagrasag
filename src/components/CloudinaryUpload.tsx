'use client';

import React, { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
}

export default function CloudinaryUpload({ onUpload, accept = 'image/*,video/*' }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    // Use the NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET from environment or fallback
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
    formData.append('upload_preset', preset);

    const resourceType = file.type.startsWith('video') ? 'video' : 'image';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      onUpload(data.secure_url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unknown error occurred during upload.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          ) : (
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
          )}
          <p className="text-sm text-slate-500">
            {uploading ? (
              <span className="font-semibold text-blue-600">Uploading...</span>
            ) : (
              <><span className="font-semibold">Click to upload</span> or drag and drop</>
            )}
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {errorMsg && <p className="text-sm text-red-600 mt-2">{errorMsg}</p>}
    </div>
  );
}
