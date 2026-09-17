'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { pastExecutiveSchema, PastExecutive } from '@/types/admin';
import Image from 'next/image';
import { Plus, Search, Filter, Pencil, Trash2, ArrowLeft, Copy, X, User } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit';

export default function PastExecutivesManagement() {
  const { data: records, isLoading, mutate } = useSWR<PastExecutive[]>('/api/admin/past_executives', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [selectedItem, setSelectedItem] = useState<PastExecutive | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PastExecutive>({
    resolver: zodResolver(pastExecutiveSchema) as any,
    defaultValues: {
      name: '', role: '', term: '', bio: '', image_url: '', display_order: 0
    }
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  const handleOpenAdd = () => {
    reset({ name: '', role: '', term: '', bio: '', image_url: '', display_order: 0 });
    setSelectedItem(null);
    setView('add');
  };

  const handleOpenEdit = (item: PastExecutive) => {
    reset(item);
    setSelectedItem(item);
    setView('edit');
  };

  const handleDelete = async (item: PastExecutive) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/admin/past_executives/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: z.input<typeof pastExecutiveSchema>) => {
    try {
      const isEditing = view === 'edit' && selectedItem;
      const url = isEditing ? `/api/admin/past_executives/${selectedItem.id}` : '/api/admin/past_executives';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const payload = { ...data };
      if (!payload.image_url) delete payload.image_url;

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
    }
  };

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Past Executives</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Leadership &gt; Past Executives</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" /> Add Past Executive
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Name & Role</th>
                <th className="px-6 py-4 font-medium">Term (Year)</th>
                <th className="px-6 py-4 font-medium">Display Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <AdminTableSkeleton columns={4} />
              ) : records?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
              ) : (
                records?.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {record.image_url ? (
                            <Image src={record.image_url} alt={record.name} width={100} height={100} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-5 h-5"/></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{record.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{record.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {record.term}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{record.display_order}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenEdit(record)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(record)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FormView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Record' : 'Add New Record'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input 
                  {...register('name')} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
                <input 
                  {...register('role')} 
                  placeholder="e.g. President"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term (Academic Year) <span className="text-red-500">*</span></label>
                <input 
                  {...register('term')} 
                  placeholder="e.g. 2024/2025"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
                {errors.term && <p className="text-xs text-red-500 mt-1">{errors.term.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input 
                  type="number"
                  {...register('display_order', { valueAsNumber: true })} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
              <textarea 
                {...register('bio')} 
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Portrait</h2>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <CloudinaryUpload onUpload={(url: string) => setValue('image_url', url, { shouldValidate: true })} />
              {imageUrl && (
                <div className="mt-4 w-32 h-32 rounded-full overflow-hidden border border-gray-200 relative">
                  <Image src={imageUrl} alt="Preview" width={200} height={200} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setValue('image_url', '')} className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {view === 'list' && <ListView />}
      {(view === 'add' || view === 'edit') && <FormView />}
    </>
  );
}
