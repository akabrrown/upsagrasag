'use client';

// app/admin/opportunities/edit/[id]/page.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { opportunitySchema } from "@/types/admin";
import { opportunityService } from "@/lib/supabase/admin";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

type FormData = z.input<typeof opportunitySchema>;

export default function OpportunityEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(opportunitySchema) });

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const opp = await opportunityService.get(id);
        if (!opp) {
          alert("Opportunity not found");
          router.push("/admin/opportunities");
          return;
        }
        reset(opp as any);
      } catch (e) {
        console.error(e);
        alert("Failed to load opportunity");
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: FormData) => {
    try {
      await opportunityService.update(id, data);
      router.push("/admin/opportunities");
    } catch (e) {
      console.error(e);
      alert("Failed to update opportunity");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Opportunity</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input {...register("title")} className="w-full border rounded p-2" />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register("description")} className="w-full border rounded p-2" />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Type</label>
          <select {...register("type")} className="w-full border rounded p-2">
            <option value="internship">Internship</option>
            <option value="full-time">Full‑Time</option>
            <option value="contract">Contract</option>
          </select>
          {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Location</label>
          <input {...register("location")} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Apply URL</label>
          <input {...register("apply_url")} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Image URL</label>
          <input {...register("image_url")} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Deadline</label>
          <input type="date" {...register("deadline")} className="w-full border rounded p-2" />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Saving..." : "Update"}
        </button>
      </form>
    </div>
  );
}
