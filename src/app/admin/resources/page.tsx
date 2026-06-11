// app/admin/resources/page.tsx
import React from "react";
import { CrudTable } from "@/components/admin/CrudTable";
import { resourceService } from "@/lib/supabase/admin";
import type { Resource } from "@/types/admin";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await resourceService.list();

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "file_type", label: "Type" },
    { key: "display_order", label: "Order" },
    { key: "actions", label: "Actions" },
  ];

  if (!resources || resources.length === 0) {
    return <p className="text-center text-gray-500">No resources found.</p>;
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resources</h1>
      <CrudTable<Resource>
        entity="resources"
        data={resources}
        columns={columns}
        pageSize={20}
      />
    </section>
  );
}
