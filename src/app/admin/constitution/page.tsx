'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { constitutionSchema, ConstitutionFile } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import SupabaseFileUpload from '@/components/admin/SupabaseFileUpload';
import { Plus, Download } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminConstitutionPage() {
  const { data: records, error, isLoading, mutate } = useSWR<ConstitutionFile[]>('/api/admin/constitution', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<ConstitutionFile>({
    resolver: zodResolver(constitutionSchema)
  });

  const fileUrl = useWatch({ control, name: 'file_url' });

  const openCreate = () => {
    reset({ title: '', file_url: '', version: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: ConstitutionFile) => {
    reset(item);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: ConstitutionFile) => {
    try {
      const res = await fetch(`/api/admin/constitution/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: ConstitutionFile) => {
    try {
      const url = editingId ? `/api/admin/constitution/${editingId}` : '/api/admin/constitution';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsModalOpen(false);
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' as keyof ConstitutionFile },
    { header: 'Version', accessor: 'version' as keyof ConstitutionFile },
    { 
      header: 'File', 
      accessor: (row: ConstitutionFile) => (
        <a href={row.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
          <Download className="w-4 h-4" /> Download
        </a>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Constitution Files</h1>
          <p className="text-slate-500">Manage uploaded PDF files for the association's constitution.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add File
        </button>
      </div>

      <CrudTable 
        data={records || []} 
        columns={columns} 
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Edit Constitution File' : 'Upload Constitution File'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              {...register('title')} 
              placeholder="e.g., GRASAG-UPSA Constitution"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Version (Optional)</label>
            <input 
              {...register('version')} 
              placeholder="e.g., 2024 Revised"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload PDF</label>
            <SupabaseFileUpload 
              bucket="constitution_files"
              accept="application/pdf"
              onUpload={(url) => setValue('file_url', url, { shouldValidate: true })}
            />
            <input type="hidden" {...register('file_url')} />
            {fileUrl && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                ✓ File selected/uploaded
              </div>
            )}
            {errors.file_url && <p className="text-sm text-red-600 mt-1">{errors.file_url.message as string}</p>}
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!fileUrl || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
