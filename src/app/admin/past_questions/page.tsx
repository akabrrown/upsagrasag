'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pastQuestionSchema, PastQuestion } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import SupabaseFileUpload from '@/components/admin/SupabaseFileUpload';
import { Plus, Download } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminPastQuestionsPage() {
  const { data: records, error, isLoading, mutate } = useSWR<PastQuestion[]>('/api/admin/past_questions', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<PastQuestion>({
    resolver: zodResolver(pastQuestionSchema)
  });

  const fileUrl = useWatch({ control, name: 'file_url' });

  const openCreate = () => {
    reset({ course_code: '', course_title: '', year: '', file_url: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: PastQuestion) => {
    reset(item);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: PastQuestion) => {
    try {
      const res = await fetch(`/api/admin/past_questions/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: PastQuestion) => {
    try {
      const url = editingId ? `/api/admin/past_questions/${editingId}` : '/api/admin/past_questions';
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
    { header: 'Course Code', accessor: 'course_code' as keyof PastQuestion },
    { header: 'Course Title', accessor: 'course_title' as keyof PastQuestion },
    { header: 'Year', accessor: 'year' as keyof PastQuestion },
    { 
      header: 'File', 
      accessor: (row: PastQuestion) => (
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
          <h1 className="text-2xl font-bold text-slate-900">Past Questions</h1>
          <p className="text-slate-500">Manage past questions for academic support.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Past Question
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
        title={editingId ? 'Edit Past Question' : 'Upload Past Question'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
              <input 
                {...register('course_code')} 
                placeholder="e.g., MKTG 601"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.course_code && <p className="text-sm text-red-600 mt-1">{errors.course_code.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <input 
                {...register('year')} 
                placeholder="e.g., 2022/2023"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.year && <p className="text-sm text-red-600 mt-1">{errors.year.message as string}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
            <input 
              {...register('course_title')} 
              placeholder="e.g., Strategic Marketing Management"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.course_title && <p className="text-sm text-red-600 mt-1">{errors.course_title.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload PDF</label>
            <SupabaseFileUpload 
              bucket="past_questions"
              accept="application/pdf"
              onUpload={(url) => setValue('file_url', url, { shouldValidate: true })}
            />
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
