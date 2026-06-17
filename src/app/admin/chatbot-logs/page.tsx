// app/admin/chatbot-logs/page.tsx
import React from "react";
import { CrudTable } from "@/components/admin/CrudTable";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ChatbotLog } from "@/types/admin";

const columns = [
  { key: "id", label: "ID" },
  { key: "user_id", label: "User ID" },
  { key: "session_id", label: "Session" },
  { key: "message_role", label: "Role" },
  { key: "content", label: "Content" },
  { key: "created_at", label: "Created" },
  { key: "actions", label: "Actions" },
];

export default async function ChatbotLogsPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('chatbot_logs').select('*').order('created_at', { ascending: false });
  const logs = data || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chatbot Logs</h1>
      <CrudTable<ChatbotLog & { id: string }>
        entity="chatbot_logs"
        columns={columns}
        data={logs as (ChatbotLog & { id: string })[]}
      />
    </div>
  );
}
