'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsUpdateSchema, NewsUpdate } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminNewsPage() {
  const { data: records, error, isLoading, mutate } = useSWR<NewsUpdate[]>('/api/admin/news_updates', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<NewsUpdate>({
    resolver: zodResolver(newsUpdateSchema),
    defaultValues: { category: 'notices' }
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  const openCreate = () => {
    reset({ title: '', content: '', category: 'notices', image_url: '', published_at: new Date().toISOString() });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: NewsUpdate) => {
    const formattedItem = { ...item };
    if (formattedItem.published_at) {
      const d = new Date(formattedItem.published_at);
      formattedItem.published_at = d.toISOString().slice(0, 16);
    }
    reset(formattedItem);
    setEditingId(item.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: NewsUpdate) => {
    try {
      const res = await fetch(`/api/admin/news_updates/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: NewsUpdate) => {
    try {
      const url = editingId ? `/api/admin/news_updates/${editingId}` : '/api/admin/news_updates';
      const method = editingId ? 'PATCH' : 'POST';
      
      const payload = { ...data };
      if (data.published_at) {
        payload.published_at = new Date(data.published_at).toISOString();
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
    { 
      header: 'Cover', 
      accessor: (row: NewsUpdate) => row.image_url ? (
        <img src={row.image_url} alt={row.title} className="w-16 h-10 object-cover rounded-md border" />
      ) : <span className="text-xs text-slate-400">None</span>
    },
    { header: 'Title', accessor: 'title' as keyof NewsUpdate },
    { header: 'Category', accessor: (row: NewsUpdate) => <span className="capitalize">{row.category}</span> },
    { 
      header: 'Published', 
      accessor: (row: NewsUpdate) => row.published_at ? (
        <span suppressHydrationWarning>{new Date(row.published_at).toLocaleDateString()}</span>
      ) : <span className="text-slate-400">Draft</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">News & Updates</h1>
          <p className="text-slate-500">Manage notices, press releases, reports, accountability info, and galleries.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Post
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
        title={editingId ? 'Edit Post' : 'Create Post'}
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
                {...register('category')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="notices">Notice</option>
                <option value="press">Press Release</option>
                <option value="reports">Report</option>
                <option value="accountability">Accountability</option>
                <option value="gallery">Gallery</option>
              </select>
              {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
              <input 
                type="datetime-local"
                {...register('published_at')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (Supports HTML/Markdown or plain text)</label>
            <textarea 
              {...register('content')} 
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (Optional)</label>
            <CloudinaryUpload 
              onUpload={(url) => setValue('image_url', url, { shouldValidate: true })}
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded-md border" />
              </div>
            )}
            {errors.image_url && <p className="text-sm text-red-600 mt-1">{errors.image_url.message as string}</p>}
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
