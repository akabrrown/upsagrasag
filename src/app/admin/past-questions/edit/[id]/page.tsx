// app/admin/past-questions/edit/[id]/page.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pastQuestionSchema } from "@/types/admin";
import { pastQuestionService } from "@/lib/supabase/admin";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";

export const dynamic = "force-dynamic";

type FormData = z.infer<typeof pastQuestionSchema>;

export default function PastQuestionEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(pastQuestionSchema) });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const q = await pastQuestionService.get(id);
        if (!q) {
          alert("Question not found");
          router.push("/admin/past-questions");
          return;
        }
        reset(q as any);
      } catch (e) {
        console.error(e);
        alert("Failed to load question");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id, router, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await pastQuestionService.update(id, data);
      router.push("/admin/past-questions");
    } catch (e) {
      console.error(e);
      alert("Failed to update question");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Past Question</h1>
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
          {isSubmitting ? "Saving..." : "Update"}
        </button>
      </form>
    </div>
  );
}
