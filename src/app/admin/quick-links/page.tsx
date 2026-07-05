'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';

// Define schema for a quick link
const quickLinkSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL').optional(),
  description: z.string().optional()
});

type QuickLink = z.infer<typeof quickLinkSchema>;

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminQuickLinksPage() {
  const { data: records, error, isLoading, mutate } = useSWR<QuickLink[]>('/api/admin/quick-links', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<QuickLink>({
    resolver: zodResolver(quickLinkSchema),
    defaultValues: { title: '', url: '', description: '' }
  });

  const openCreate = () => {
    reset({ title: '', url: '', description: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: QuickLink) => {
    reset(item);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: QuickLink) => {
    try {
      const res = await fetch(`/api/admin/quick-links/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e:any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: QuickLink) => {
    try {
      const url = editingId ? `/api/admin/quick-links/${editingId}` : '/api/admin/quick-links';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsModalOpen(false);
      mutate();
    } catch (e:any) {
      alert(e.message);
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' as keyof QuickLink },
    { header: 'URL', accessor: (row: QuickLink) => row.url ? (
        <a href={row.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{row.url}</a>
      ) : '—' },
    { header: 'Description', accessor: (row: QuickLink) => (
        <span className="text-sm text-slate-500 line-clamp-2">{row.description}</span>
      ) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quick Links</h1>
          <p className="text-slate-500">Manage frequently used navigation shortcuts for admin users.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Link
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
        title={editingId ? 'Edit Link' : 'Add Quick Link'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input {...register('title')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL (Optional)</label>
            <input {...register('url')} placeholder="https://..." className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.url && <p className="text-sm text-red-600 mt-1">{errors.url.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
            <textarea {...register('description')} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
