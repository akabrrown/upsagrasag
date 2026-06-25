'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadershipSchema, Leadership } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminLeadershipPage() {
  const { data: records, error, isLoading, mutate } = useSWR<Leadership[]>('/api/admin/leadership', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(leadershipSchema) as any,
    defaultValues: { name: '', role: '', type: 'executive', bio: '', image_url: '', display_order: 0, contactInfo: '' }
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  const openCreate = () => {
    reset({ name: '', role: '', type: 'executive', bio: '', image_url: '', display_order: 0 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Leadership) => {
    reset({
      ...item,
      contactInfo: item.contactInfo ? JSON.stringify(item.contactInfo, null, 2) : ''
    });
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Leadership) => {
    try {
      const res = await fetch(`/api/admin/leadership/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Leadership) => {
    // Parse contactInfo JSON if provided
    let parsed = data as any;
    if (parsed.contactInfo && typeof parsed.contactInfo === 'string' && parsed.contactInfo.trim()) {
      try {
        parsed.contactInfo = JSON.parse(parsed.contactInfo);
      } catch (e) {
        alert('Contact Info must be valid JSON');
        return;
      }
    }
    try {
      const url = editingId ? `/api/admin/leadership/${editingId}` : '/api/admin/leadership';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsModalOpen(false);
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const executors = Array.isArray(records) ? records.filter(r => r.type === 'executive') : [];
  const sortedRecords = executors.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const columns = [
    { 
      header: 'Photo', 
      accessor: (row: Leadership) => row.image_url ? (
        <img src={row.image_url} alt={row.name} className="w-10 h-10 object-cover rounded-full border" />
      ) : <span className="text-xs text-slate-400">None</span>
    },
    { header: 'Name', accessor: 'name' as keyof Leadership },
    { header: 'Role', accessor: 'role' as keyof Leadership },
    { header: 'Type', accessor: (row: Leadership) => <span className="capitalize">{row.type}</span> },
    { header: 'Order', accessor: 'display_order' as keyof Leadership }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leadership & Executives</h1>
          <p className="text-slate-500">Manage Executives.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Leader
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
        title={editingId ? 'Edit Leader' : 'Create Leader'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Role/Title</label>
              <input 
                {...register('role')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
              <input
                {...register('email')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message as string}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
              <input
                {...register('phone')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message as string}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select 
                {...register('type')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="executive">Executive</option>
              </select>
              {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
              <input 
                type="number"
                {...register('display_order', { valueAsNumber: true })} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Photo (Optional)</label>
            <CloudinaryUpload 
              onUpload={(url) => setValue('image_url', url, { shouldValidate: true })}
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-full border" />
              </div>
            )}
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
