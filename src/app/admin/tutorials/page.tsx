'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tutorialSchema, Tutorial } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus, PlayCircle } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminTutorialsPage() {
  const { data: records, error, isLoading, mutate } = useSWR<Tutorial[]>('/api/admin/tutorials', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<Tutorial>({
    resolver: zodResolver(tutorialSchema)
  });

  const videoUrl = useWatch<Tutorial>({ control, name: 'video_url' });

  const openCreate = () => {
    reset({ title: '', description: '', video_url: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Tutorial) => {
    reset(item);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Tutorial) => {
    try {
      const res = await fetch(`/api/admin/tutorials/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Tutorial) => {
    try {
      const url = editingId ? `/api/admin/tutorials/${editingId}` : '/api/admin/tutorials';
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
    { header: 'Title', accessor: 'title' as keyof Tutorial },
    { 
      header: 'Description', 
      accessor: (row: Tutorial) => <span className="truncate max-w-xs block text-slate-500">{row.description}</span>
    },
    { 
      header: 'Video', 
      accessor: (row: Tutorial) => (
        <a href={row.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
          <PlayCircle className="w-4 h-4" /> Watch
        </a>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tutorials</h1>
          <p className="text-slate-500">Manage instructional videos and tutorials.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Tutorial
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
        title={editingId ? 'Edit Tutorial' : 'Add Tutorial'}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
            <textarea 
              {...register('description')} 
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Video Source</label>
            <p className="text-xs text-slate-500 mb-2">You can paste a YouTube URL or upload an MP4 file.</p>
            <input 
              {...register('video_url')} 
              placeholder="https://youtube.com/..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">OR UPLOAD:</span>
              <CloudinaryUpload 
                onUpload={(url) => setValue('video_url', url, { shouldValidate: true })}
              />
            </div>
            {errors.video_url && <p className="text-sm text-red-600 mt-1">{errors.video_url.message as string}</p>}
            {videoUrl && videoUrl.includes('cloudinary') && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                ✓ Video selected/uploaded
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
