'use client';

// app/admin/executives/edit/[id]/page.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { executiveSchema } from "@/types/admin";
import { executiveService } from "@/lib/supabase/admin";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

type FormData = z.input<typeof executiveSchema>;

export default function ExecutiveEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(executiveSchema) });

  useEffect(() => {
    if (!isNaN(id)) {
      executiveService.get(id).then((data) => {
        if (data) reset(data as any);
        else alert("Executive not found");
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      let photoUrl = data.photo_url;
      if (file) {
        const filePath = `executives/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabaseClient.storage
          .from('executive-photos')
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabaseClient.storage
          .from('executive-photos')
          .getPublicUrl(filePath);
        photoUrl = publicData.publicUrl || '';
      }
      await executiveService.update(id, { ...data, photo_url: photoUrl });
      router.push('/admin/executives');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Executive</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input {...register("name")} className="w-full border rounded p-2" />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Title</label>
          <input {...register("title")} className="w-full border rounded p-2" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Photo URL</label>
          <input {...register("photo_url")} className="w-full border rounded p-2" />
          {errors.photo_url && <p className="text-sm text-red-600">{errors.photo_url.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Display Order</label>
          <input type="number" {...register("display_order", { valueAsNumber: true })} className="w-full border rounded p-2" />
          {errors.display_order && <p className="text-sm text-red-600">{errors.display_order.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isSubmitting ? "Saving..." : "Update"}
        </button>
      </form>
    </div>
  );
}
