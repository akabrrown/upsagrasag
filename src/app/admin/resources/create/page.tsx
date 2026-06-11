// app/admin/resources/create/page.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema } from "@/types/admin";
import { resourceService } from "@/lib/supabase/admin";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

type FormData = z.infer<typeof resourceSchema>;

export default function ResourceCreatePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(resourceSchema) });

  const onSubmit = async (data: FormData) => {
    try {
      await resourceService.create(data);
      router.push("/admin/resources");
    } catch (e) {
      console.error(e);
      alert("Failed to create resource");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Resource</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input {...register("title")} className="w-full border rounded p-2" />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register("description")} className="w-full border rounded p-2" />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">File URL</label>
          <input {...register("file_url")} className="w-full border rounded p-2" />
          {errors.file_url && (
            <p className="text-sm text-red-600">{errors.file_url.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">File Type</label>
          <select {...register("file_type")} className="w-full border rounded p-2">
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="pptx">PPTX</option>
            <option value="xlsx">XLSX</option>
          </select>
          {errors.file_type && (
            <p className="text-sm text-red-600">{errors.file_type.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}
