'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { researchOpportunitySchema, ResearchOpportunity } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminResearchOpportunitiesPage() {
  const { data: records, error, isLoading, mutate } = useSWR<ResearchOpportunity[]>('/api/admin/research_opportunities', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ResearchOpportunity>({
    resolver: zodResolver(researchOpportunitySchema),
    defaultValues: { sub_type: 'scholarships' }
  });

  const openCreate = () => {
    reset({ title: '', description: '', sub_type: 'scholarships', link_url: '', deadline: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: ResearchOpportunity) => {
    const formattedItem = { ...item };
    if (formattedItem.deadline) {
      const d = new Date(formattedItem.deadline);
      formattedItem.deadline = d.toISOString().slice(0, 16);
    }
    reset(formattedItem);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: ResearchOpportunity) => {
    try {
      const res = await fetch(`/api/admin/research_opportunities/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: ResearchOpportunity) => {
    try {
      const url = editingId ? `/api/admin/research_opportunities/${editingId}` : '/api/admin/research_opportunities';
      const method = editingId ? 'PATCH' : 'POST';
      
      const payload = { ...data };
      if (data.deadline) {
        payload.deadline = new Date(data.deadline).toISOString();
      } else {
        delete payload.deadline;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsModalOpen(false);
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' as keyof ResearchOpportunity },
    { header: 'Category', accessor: (row: ResearchOpportunity) => <span className="capitalize">{row.sub_type}</span> },
    { 
      header: 'Deadline', 
      accessor: (row: ResearchOpportunity) => row.deadline ? (
        <span suppressHydrationWarning>{new Date(row.deadline).toLocaleDateString()}</span>
      ) : <span className="text-slate-400">N/A</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Research & Grants</h1>
          <p className="text-slate-500">Manage scholarships, calls for papers, publications, and careers.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Record
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
        title={editingId ? 'Edit Record' : 'Create Record'}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                {...register('sub_type')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="scholarships">Scholarships</option>
                <option value="calls">Calls for Papers</option>
                <option value="publications">Publications</option>
                <option value="careers">Careers</option>
              </select>
              {errors.sub_type && <p className="text-sm text-red-600 mt-1">{errors.sub_type.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline (Optional)</label>
              <input 
                type="datetime-local"
                {...register('deadline')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
            <textarea 
              {...register('description')} 
              rows={3}
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
