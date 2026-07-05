import * as React from 'react';
import { Edit, Trash2, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Column definition used by the Table component.
 */
export interface Column<T> {
  /** Header title displayed in the table head */
  header: string;
  /** Accessor can be a key of the row object or a render function */
  accessor: keyof T | ((row: T) => React.ReactNode);
}

export interface TableProps<T extends { id?: string | number }> {
  /** Data rows */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Loading state */
  isLoading?: boolean;
  /** Optional edit handler */
  onEdit?: (row: T) => void;
  /** Optional delete handler */
  onDelete?: (row: T) => void;
}

/**
 * Premium styled table component (brand‑aware) used across the admin UI.
 * It replaces the previous `CrudTable` component while keeping the same API.
 */
export default function Table<T extends { id?: string | number }>({
  data = [],
  columns,
  isLoading = false,
  onEdit,
  onDelete,
}: TableProps<T>) {
  // Loading state – centered spinner with brand color
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Empty state – friendly message with brand accent
  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col justify-center items-center min-h-[300px] text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Inbox className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">No records found</h3>
        <p className="text-slate-500 max-w-sm">
          There is no data to display here yet. Use the button above to create the first record.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-primary-foreground uppercase tracking-wider bg-primary/5 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-semibold">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                className="group hover:bg-primary/5 transition-colors"
              >
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
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all inline-flex border border-transparent hover:border-primary/20"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this record?')) {
                            onDelete(row);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-10 rounded-lg transition-all inline-flex border border-transparent hover:border-red-200"
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
