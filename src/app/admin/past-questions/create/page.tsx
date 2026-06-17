'use client';

// app/admin/past-questions/create/page.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pastQuestionSchema } from "@/types/admin";
import { pastQuestionService } from "@/lib/supabase/admin";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

type FormData = z.input<typeof pastQuestionSchema>;

export default function PastQuestionCreatePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(pastQuestionSchema) });

  const onSubmit = async (data: FormData) => {
    try {
      await pastQuestionService.create(data);
      router.push("/admin/past-questions");
    } catch (e) {
      console.error(e);
      alert("Failed to create past question");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Past Question</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Question</label>
          <textarea {...register("question")} className="w-full border rounded p-2" />
          {errors.question && (
            <p className="text-sm text-red-600">{errors.question.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Answer</label>
          <textarea {...register("answer")} className="w-full border rounded p-2" />
          {errors.answer && (
            <p className="text-sm text-red-600">{errors.answer.message}</p>
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
