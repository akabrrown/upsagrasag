// app/admin/past-questions/page.tsx
import React from "react";
import { CrudTable } from "@/components/admin/CrudTable";
import { pastQuestionService } from "@/lib/supabase/admin";
import type { PastQuestion } from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function PastQuestionsPage() {
  const questions = await pastQuestionService.list();

  const columns = [
    { key: "id", label: "ID" },
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer" },
    { key: "display_order", label: "Order" },
    { key: "actions", label: "Actions" },
  ];

  if (!questions || questions.length === 0) {
    return <p className="text-center text-gray-500">No past questions found.</p>;
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Past Questions</h1>
      <CrudTable<PastQuestion>
        entity="past_questions"
        data={questions}
        columns={columns}
        pageSize={20}
      />
    </section>
  );
}
