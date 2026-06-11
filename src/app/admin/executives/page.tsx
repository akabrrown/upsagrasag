// app/admin/executives/page.tsx
import React from "react";
import CrudTable from "@/components/admin/CrudTable";
import { Executive } from "@/types/admin";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "photo_url", label: "Photo" },
  { key: "display_order", label: "Order" },
  { key: "actions", label: "Actions" },
];

const ExecutivesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Executives</h1>
      <CrudTable<Executive>
        entity="executives"
        columns={columns}
        pageSize={20}
      />
    </div>
  );
};

export default ExecutivesPage;
