// src/components/admin/AdminTable.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { ColumnConfig } from "@/types/admin";

interface AdminTableProps<T extends { id: string | number }> {
  data: T[];
  columns: ColumnConfig<T>[];
  entity: string; // e.g. "partners"
  pageSize?: number;
  loading?: boolean;
  error?: string | null;
}

export function AdminTable<T extends { id: string | number }>({
  data,
  columns,
  entity,
  pageSize = 20,
  loading = false,
  error = null,
}: AdminTableProps<T>) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set());
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = String(item[col.key as keyof T] ?? "");
        return val.toLowerCase().includes(lower);
      })
    );
  }, [search, data, columns]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, pageSize, filtered]);

  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return alert("No rows selected");
    if (!confirm(`Delete ${selectedIds.size} records?`)) return;
    const res = await fetch(`/api/admin/${entity}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });
    if (res.ok) {
      router.refresh();
      setSelectedIds(new Set());
    } else {
      alert("Bulk delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center">Error: {error}</p>;
  }

  if (filtered.length === 0) {
    return <p className="text-center text-gray-500">No data found.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={bulkDelete}
            disabled={selectedIds.size === 0}
          >
            Delete ({selectedIds.size})
          </Button>
          <Button onClick={() => router.push(`/admin/${entity}/create`)}>
            Create New
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selectedIds.size === paginated.length && paginated.length > 0}
                onChange={(e) => {
                  if (e.target.checked) setSelectedIds(new Set(paginated.map((i) => i.id)));
                  else setSelectedIds(new Set());
                }}
              />
            </TableHead>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>{col.label}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {String(item[col.key as keyof T] ?? "")}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/${entity}/edit/${item.id}`)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-2">
          <Button
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span className="px-2 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
