'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui or similar exists, fallback to standard if not

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface CrudTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
}

export default function CrudTable<T extends { id?: string }>({
  data = [],
  columns,
  onEdit,
  onDelete,
  isLoading = false
}: CrudTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border shadow-sm p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border shadow-sm p-8 text-center text-slate-500">
        No records found. Click "Add New" to create one.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-medium">{col.header}</th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(Array.isArray(data) ? data : []).map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="px-6 py-4">
                    {typeof col.accessor === 'function' 
                      ? col.accessor(row) 
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right space-x-2">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors inline-flex"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to delete this record?')) {
                            onDelete(row);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors inline-flex"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
