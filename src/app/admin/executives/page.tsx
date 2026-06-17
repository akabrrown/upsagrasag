// app/admin/executives/page.tsx
import React from "react";
import { CrudTable } from "@/components/admin/CrudTable";
import { executiveService } from "@/lib/supabase/admin/executiveService";

const columns: ColumnConfig<Executive>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "photo_url", label: "Photo" },
  { key: "display_order", label: "Order" },
];

export default async function ExecutivesPage() {
  const executives = await executiveService.list();

  const columns: ColumnConfig<Executive>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "photo_url", label: "Photo" },
    { key: "display_order", label: "Order" },
  ];
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Executives</h1>
      <CrudTable<Executive> data={executives as Executive[]} columns={columns} entity="executives" />
    </div>
  );
}

