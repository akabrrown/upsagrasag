// app/admin/partners/create/page.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerSchema } from "@/types/admin";
import { partnerService } from "@/lib/supabase/admin";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

type FormData = z.infer<typeof partnerSchema>;

export default function PartnerCreatePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(partnerSchema) });

  const onSubmit = async (data: FormData) => {
    try {
      await partnerService.create(data);
      router.push("/admin/partners");
    } catch (e) {
      console.error(e);
      alert("Failed to create partner");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Partner</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input {...register("name")} className="w-full border rounded p-2" />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Website URL</label>
          <input {...register("website_url")} className="w-full border rounded p-2" />
          {errors.website_url && <p className="text-sm text-red-600">{errors.website_url.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Logo URL</label>
          <input {...register("logo_url")} className="w-full border rounded p-2" />
          {errors.logo_url && <p className="text-sm text-red-600">{errors.logo_url.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Display Order</label>
          <input type="number" {...register("display_order", { valueAsNumber: true })} className="w-full border rounded p-2" />
          {errors.display_order && <p className="text-sm text-red-600">{errors.display_order.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isSubmitting ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}
