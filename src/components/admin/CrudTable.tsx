'use client';

import React from 'react';
import { Edit, Trash2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function CrudTable<T extends { id?: string | number }>({
  data = [],
  columns,
  onEdit,
  onDelete,
  isLoading = false
}: CrudTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col justify-center items-center min-h-[300px] text-center">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <Inbox className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">No records found</h3>
        <p className="text-slate-500 max-w-sm">There is no data to display here yet. Click "Add New" to create the first record.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-500 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-semibold">{col.header}</th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(Array.isArray(data) ? data : []).map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-50/80 transition-colors group">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="px-6 py-4 text-slate-700">
                    {typeof col.accessor === 'function' 
                      ? col.accessor(row) 
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(row)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex border border-transparent hover:border-blue-100"
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
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all inline-flex border border-transparent hover:border-red-100"
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
