'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { welfareStepSchema, WelfareStep } from '@/types/admin';
import { 
  Plus, Search, Eye, Pencil, Trash2, 
  ArrowLeft
} from 'lucide-react';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminWelfareStepsPage() {
  const { data: records, isLoading, mutate } = useSWR<WelfareStep[]>('/api/admin/welfare-steps', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [selectedRecord, setSelectedRecord] = useState<WelfareStep | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<WelfareStep>({
    resolver: zodResolver(welfareStepSchema) as any,
    defaultValues: { step_number: 1, title: '', description: '', display_order: 0 }
  });

  // --- Handlers ---
  
  const handleOpenAdd = () => {
    reset({ step_number: 1, title: '', description: '', display_order: 0 });
    setSelectedRecord(null);
    setView('add');
  };

  const handleOpenEdit = (raw_item: WelfareStep) => {
    const item = Object.fromEntries(Object.entries(raw_item).map(([k, v]) => [k, v === null ? '' : v])) as any;
    reset(item);
    setSelectedRecord(item);
    setView('edit');
  };

  const handleOpenDetails = (item: WelfareStep) => {
    setSelectedRecord(item);
    setView('details');
  };

  const handleDelete = async (item: WelfareStep) => {
    if(!confirm(`Are you sure you want to remove this welfare step?`)) return;
    try {
      const res = await fetch(`/api/admin/welfare-steps/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: WelfareStep) => {
    try {
      const isEditing = view === 'edit' && selectedRecord;
      const url = isEditing ? `/api/admin/welfare-steps/${selectedRecord.id}` : '/api/admin/welfare-steps';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filteredRecords = Array.isArray(records) ? [...records].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)) : [];

  // --- Views ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welfare Steps</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Welfare Steps</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-6 py-4 font-medium">Step</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <AdminTableSkeleton columns={4} />
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No welfare steps found.</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Step {record.step_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{record.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{record.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.display_order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenDetails(record as any)} className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
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
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Welfare Step' : 'Add New Welfare Step'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Welfare Steps &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
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

      <form className="grid grid-cols-1 gap-6 max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Step Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Step Number <span className="text-red-500">*</span></label>
              <input 
                type="number"
                {...register('step_number', { valueAsNumber: true })} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
              {errors.step_number && <p className="text-xs text-red-500 mt-1">{errors.step_number.message as string}</p>}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input 
              {...register('title')} 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea 
                {...register('description')} 
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm resize-none"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>}
          </div>
        </div>
      </form>
    </div>
  );

  const DetailsView = () => {
    if (!selectedRecord) return null;
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Step Details</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <div>
                 <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">Step {selectedRecord.step_number}: {selectedRecord.title}</h2>
                 <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{selectedRecord.description}</p>
               </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
               <h3 className="font-semibold text-gray-900">Actions</h3>
               <div className="space-y-2">
                 <button onClick={() => handleOpenEdit(selectedRecord)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                   <Pencil className="w-4 h-4 text-gray-400" /> Edit Details
                 </button>
                 <button onClick={() => handleDelete(selectedRecord)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
                   <Trash2 className="w-4 h-4" /> Delete Record
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {view === 'list' && <ListView />}
      {(view === 'add' || view === 'edit') && <FormView />}
      {view === 'details' && <DetailsView />}
    </>
  );
}
