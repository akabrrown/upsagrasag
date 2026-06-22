'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { executiveSchema, Executive } from '@/types/admin';
import { zodResolver } from '@hookform/resolvers/zod';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminExecutivesPage() {
  const { data: records, error, isLoading, mutate } = useSWR<Executive[]>('/api/admin/executives', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<Executive>({
    resolver: zodResolver(executiveSchema) as any,
    defaultValues: { name: '', title: '', bio: '', photo_url: '', display_order: 0 }
  });

  const photoUrl = useWatch({ control, name: 'photo_url' });

  const openCreate = () => {
    reset({ name: '', title: '', bio: '', photo_url: '', display_order: 0 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Executive) => {
    reset(item);
    setEditingId(String(item.id));
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Executive) => {
    try {
      const res = await fetch(`/api/admin/executives/${String(item.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Executive) => {
    try {
      const url = editingId ? `/api/admin/executives/${editingId}` : '/api/admin/executives';
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

  const sortedRecords = records ? [...records].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)) : [];

  const columns = [
    { 
      header: 'Photo', 
      accessor: (row: Executive) => (
                  <img src={row.photo_url || '/placeholder.png'} alt={row.name} className="w-10 h-10 object-cover rounded-full border" />
      )
    },
    { header: 'Name', accessor: 'name' as keyof Executive },
    { header: 'Title', accessor: 'title' as keyof Executive },
    { header: 'Order', accessor: 'display_order' as keyof Executive }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Council</h1>
          <p className="text-slate-500">Manage current executives.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Executive
        </button>
      </div>

      <CrudTable 
        data={sortedRecords} 
        columns={columns} 
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Edit Executive' : 'Create Executive'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input 
                {...register('name')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input 
                {...register('title')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
            <input 
              type="number"
              {...register('display_order', { valueAsNumber: true })} 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio (Optional)</label>
            <textarea 
              {...register('bio')} 
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Photo URL</label>
            <input 
              {...register('photo_url')} 
              placeholder="Paste photo URL or upload below"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-sm"
            />
            <CloudinaryUpload 
              onUpload={(url) => setValue('photo_url', url, { shouldValidate: true })}
            />
            {photoUrl && (
              <div className="mt-2">
                <img src={photoUrl} alt="Preview" className="w-16 h-16 object-cover rounded-full border" />
              </div>
            )}
            {errors.photo_url && <p className="text-sm text-red-600 mt-1">{errors.photo_url.message as string}</p>}
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
