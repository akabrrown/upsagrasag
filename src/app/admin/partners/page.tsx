// app/admin/partners/page.tsx
import React from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Partner } from "@/types/admin";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "website_url", label: "Website" },
  { key: "logo_url", label: "Logo" },
  { key: "display_order", label: "Order" },
  { key: "actions", label: "Actions" },
];

export default async function PartnersPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('partners').select('*').order('display_order');
  const partners = data || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Partners</h1>
      <AdminTable<Partner & { id: string }>
        entity="partners"
        columns={columns}
        data={partners as (Partner & { id: string })[]}
      />
    </div>
  );
}
