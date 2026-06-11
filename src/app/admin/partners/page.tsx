// app/admin/partners/page.tsx
import React from "react";
import CrudTable from "@/components/admin/CrudTable";
import { Partner } from "@/types/admin";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "website_url", label: "Website" },
  { key: "logo_url", label: "Logo" },
  { key: "display_order", label: "Order" },
  { key: "actions", label: "Actions" },
];

export default function PartnersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Partners</h1>
      <CrudTable<Partner>
        entity="partners"
        columns={columns}
        pageSize={20}
      />
    </div>
  );
}
