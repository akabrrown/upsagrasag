'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceSchema, Resource } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload'; // can be used for files if configured, or just generic URL

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminResourcesPage() {
  const { data: records, error, isLoading, mutate } = useSWR<Resource[]>('/api/admin/resources', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<Resource>({
    resolver: zodResolver(resourceSchema)
  });

  const fileUrl = useWatch({ control, name: 'file_url' });

  const openCreate = () => {
    reset({ title: '', description: '', file_url: '', link_url: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Resource) => {
    reset(item);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Resource) => {
    try {
      const res = await fetch(`/api/admin/resources/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Resource) => {
    try {
      const url = editingId ? `/api/admin/resources/${editingId}` : '/api/admin/resources';
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
    { header: 'Title', accessor: 'title' as keyof Resource },
    { 
      header: 'Has File', 
      accessor: (row: Resource) => row.file_url ? 'Yes' : 'No' 
    },
    { 
      header: 'Has Link', 
      accessor: (row: Resource) => row.link_url ? 'Yes' : 'No' 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resources</h1>
          <p className="text-slate-500">Manage downloadable files and external links.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Resource
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
        title={editingId ? 'Edit Resource' : 'Create Resource'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              {...register('title')} 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              {...register('description')} 
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">External Link URL (Optional)</label>
            <input 
              {...register('link_url')} 
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.link_url && <p className="text-sm text-red-600 mt-1">{errors.link_url.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">File URL (Optional)</label>
            <div className="flex gap-2 mb-2">
              <input 
                {...register('file_url')} 
                placeholder="Direct file URL or upload via Cloudinary below"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <CloudinaryUpload 
              onUpload={(url) => setValue('file_url', url, { shouldValidate: true })}
            />
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
              disabled={isSubmitting}
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
