// Admin Opportunities Management Page
'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { opportunitySchema, Opportunity } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { opportunityService } from '@/lib/supabase/admin';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminOpportunitiesPage() {
  const { data: records, error, isLoading, mutate } = useSWR<Opportunity[]>('/api/admin/opportunities', fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: { title: '', company: '', type: 'Full-time', category: '', image_url: '' },
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  const openCreate = () => {
    reset({ title: '', company: '', type: 'Full-time', category: '', image_url: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Opportunity) => {
    reset(item);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Opportunity) => {
    try {
      const res = await fetch(`/api/admin/opportunities/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Opportunity) => {
    try {
      const url = editingId ? `/api/admin/opportunities/${editingId}` : '/api/admin/opportunities';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsModalOpen(false);
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const columns = [
    {
      header: 'Company',
      accessor: 'company' as keyof Opportunity,
    },
    { header: 'Title', accessor: 'title' as keyof Opportunity },
    { header: 'Type', accessor: 'type' as keyof Opportunity },
    { header: 'Category', accessor: 'category' as keyof Opportunity },
    {
      header: 'Cover',
      accessor: (row: Opportunity) =>
        row.image_url ? (
          <img src={row.image_url} alt={row.title} className="w-16 h-10 object-cover rounded-md border" />
        ) : (
          <span className="text-xs text-slate-400">None</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Opportunities</h1>
          <p className="text-slate-500">Manage graduate and internship opportunities.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Opportunity
        </button>
      </div>

      <CrudTable data={records || []} columns={columns} isLoading={isLoading} onEdit={openEdit} onDelete={handleDelete} />

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Opportunity' : 'Create Opportunity'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <input {...register('company')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input {...register('title')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select {...register('type')} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
              {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input {...register('category')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message as string}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (Optional)</label>
            <CloudinaryUpload onUpload={(url) => setValue('image_url', url, { shouldValidate: true })} />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded-md border" />
              </div>
            )}
            {errors.image_url && <p className="text-sm text-red-600 mt-1">{errors.image_url.message as string}</p>}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
