// components/admin/CrudTable.tsx
import * as React from 'react';
import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import type { ColumnConfig } from '@/types/admin';

interface CrudTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  entity: string; // e.g., 'executives'
}

export function CrudTable<T extends { id: number | string }>({ data, columns, entity }: CrudTableProps<T>) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const toggleSelect = (id: string | number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return alert('No rows selected');
    if (!confirm(`Delete ${selectedIds.size} selected records?`)) return;
    const idsArray = Array.from(selectedIds);
    const res = await fetch(`/api/admin/${entity}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: idsArray }),
    });
    if (res.ok) {
      router.refresh();
      setSelectedIds(new Set());
    } else alert('Bulk delete failed');
  };

  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key as string}>{col.label}</TableHead>
          ))}
            <TableHead>
              <input
                type="checkbox"
                checked={selectedIds.size === data.length && data.length > 0}
                onChange={e => {
                  if (e.target.checked) setSelectedIds(new Set(data.map(item => item.id)));
                  else setSelectedIds(new Set());
                }}
              />
            </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((col) => (
              <TableCell key={col.key as string}>
                {String(item[col.key])}
              </TableCell>
            ))}
            <TableCell>
              <input
                type="checkbox"
                checked={selectedIds.has(item.id)}
                onChange={() => toggleSelect(item.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <div className="flex justify-between mb-4 mt-4">
        <Button onClick={handleBulkDelete} variant="destructive" disabled={selectedIds.size === 0}>
          Delete Selected ({selectedIds.size})
        </Button>
        <Button onClick={() => router.push(`/admin/${entity}/create`)}>
          Create New
        </Button>
      </div>
    </>
  );
}
