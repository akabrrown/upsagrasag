'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventProgrammeSchema, EventProgramme, EventProgrammeRecord } from '@/types/admin';



type EventProgrammeForm = Pick<EventProgramme, 'title' | 'description' | 'event_date' | 'location' | 'image_url' | 'url'> & { is_featured?: boolean };
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminEventsPage() {
  const { data: records, isLoading, mutate } = useSWR<EventProgrammeRecord[]>('/api/admin/events_programmes', fetcher);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<EventProgrammeForm>({
    resolver: zodResolver(eventProgrammeSchema)
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  const openCreate = () => {
    reset({ title: '', description: '', event_date: '', location: '', image_url: '', url: '', is_featured: false });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: EventProgrammeRecord) => {
    const { id, ...rest } = item;
    const formattedItem = { ...rest };
    if (formattedItem.event_date) {
      const d = new Date(formattedItem.event_date);
      formattedItem.event_date = d.toISOString().slice(0, 16);
    }
    reset(formattedItem as any);
    setEditingId(id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: EventProgrammeRecord) => {
    try {
      const res = await fetch(`/api/admin/events_programmes/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: EventProgrammeForm) => {
    try {
      const url = editingId ? `/api/admin/events_programmes/${editingId}` : '/api/admin/events_programmes';
      const method = editingId ? 'PATCH' : 'POST';
      
      const payload = {
        ...data,
        event_date: new Date(data.event_date).toISOString()
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsModalOpen(false);
      mutate();
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
    }
  };

  const columns = [
    {
      header: 'Cover',
      accessor: (row: EventProgrammeRecord) => row.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.image_url} alt={row.title} className="w-16 h-10 object-cover rounded-md border" />
      ) : (
        <span className="text-xs text-slate-400">None</span>
      ),
    },
    {
      header: 'Featured',
      accessor: (row: EventProgrammeRecord) => row.is_featured ? (
        <span className="bg-primary text-white px-2 py-1 rounded text-xs">Featured</span>
      ) : null,
    },
    { header: 'Title', accessor: 'title' as keyof EventProgrammeRecord },
    { header: 'Location', accessor: 'location' as keyof EventProgrammeRecord },
    {
      header: 'Event Date',
      accessor: (row: EventProgrammeRecord) => <span suppressHydrationWarning>{new Date(row.event_date).toLocaleString()}</span>
    }
];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events & Programmes</h1>
          <p className="text-slate-500">Manage upcoming association events and programmes.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Event
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
        title={editingId ? 'Edit Event' : 'Create Event'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
            <input 
              {...register('title')} 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="is_featured" {...register('is_featured')} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label htmlFor="is_featured" className="text-sm font-medium text-slate-700">Featured</label>
          </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input 
                type="datetime-local"
                {...register('event_date')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.event_date && <p className="text-sm text-red-600 mt-1">{errors.event_date.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input 
                {...register('location')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              {...register('description')} 
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

            <div className="pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (Optional)</label>
              <CloudinaryUpload 
                onUpload={(url: string) => setValue('image_url', url, { shouldValidate: true })}
              />
              {imageUrl && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded-md border" />
                </div>
              )}
            </div>
            <div className="pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Event URL (Optional)</label>
              <input 
                {...register('url')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.url && (
                <p className="text-sm text-red-600 mt-1">{errors.url.message as string}</p>
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
