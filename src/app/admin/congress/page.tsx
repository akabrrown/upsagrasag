'use client';
// src/app/admin/congress/page.tsx

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { congressSchema, CongressEvent, SubEvent } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import SubEventModal from '@/components/admin/SubEventModal';
import '@/app/admin/congress/admin.css';

// Simple fetcher for SWR
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminCongressPage() {
  // Data fetching
  const { data: records, error, isLoading, mutate } = useSWR<CongressEvent[]>('/api/admin/congress', fetcher);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subEventModalOpen, setSubEventModalOpen] = useState(false);
  const [editingSubEvent, setEditingSubEvent] = useState<SubEvent | null>(null);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(congressSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      event_date: '',
      location: '',
      image_url: '',
      is_featured: false,
    },
  });

  const imageUrl = watch('image_url');

  // Helper functions
  const openCreate = () => {
    reset();
    setEditingId(null);
    setCurrentEventId(null);
    setSubEvents([]);
    setIsModalOpen(true);
  };

  const openEdit = async (item: CongressEvent) => {
    const formatted = { ...item } as any;
    if (formatted.event_date) {
      const d = new Date(formatted.event_date);
      formatted.event_date = d.toISOString().slice(0, 16);
    }
    reset(formatted);
    setEditingId(item.id!);
    setCurrentEventId(item.id!);
    try {
      const res = await fetch(`/api/admin/sub_events?event_id=${item.id}`);
      if (res.ok) setSubEvents(await res.json());
    } catch (_) {}
    setIsModalOpen(true);
  };

  const openAddSubEvent = () => {
    if (!currentEventId) {
      alert('Save the event before adding sub‑events.');
      return;
    }
    setEditingSubEvent(null);
    setSubEventModalOpen(true);
  };

  const openEditSubEvent = (se: SubEvent) => {
    setEditingSubEvent(se);
    setSubEventModalOpen(true);
  };

  const refreshSubEvents = async () => {
    if (!currentEventId) return;
    const res = await fetch(`/api/admin/sub_events?event_id=${currentEventId}`);
    if (res.ok) setSubEvents(await res.json());
  };

  const handleDelete = async (item: CongressEvent) => {
    // UI already asked for confirmation via CrudTable
    try {
      const res = await fetch(`/api/admin/congress/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      // Some delete endpoints return 204 No Content (no JSON body)
      if (!res.ok) {
        let errMsg = res.statusText;
        try {
          const payload = await res.json();
          if (payload?.error) errMsg = payload.error;
        } catch (_) {
          // No JSON payload – keep default status text
        }
        throw new Error(`Delete failed: ${errMsg}`);
      }
      // Successful delete – refresh list and inform user
      mutate();
      alert('Event deleted successfully');
      console.log('Deleted congress event', item.id);
    } catch (e: any) {
      console.error('Delete error:', e);
      alert(e.message);
    }
  };

  const columns = [
    {
      header: 'Image',
      accessor: (row: CongressEvent) =>
        row.image_url ? (
          <img src={row.image_url} alt={row.title} className="w-16 h-10 object-cover rounded-md border" />
        ) : (
          <span className="text-xs text-slate-380">None</span>
        ),
    },
    { header: 'Title', accessor: 'title' as keyof CongressEvent },
    {
      header: 'Event Date',
      accessor: (row: CongressEvent) => (
        <span suppressHydrationWarning>{new Date(row.event_date).toLocaleString()}</span>
      ),
    },
    { header: 'Location', accessor: (row: CongressEvent) => row.location ?? '' },
    { header: 'Featured', accessor: (row: CongressEvent) => (row.is_featured ? 'Yes' : 'No') },
  ];

  const onSubmit = async (data: CongressEvent) => {
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/congress/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update');
      } else {
        const res = await fetch('/api/admin/congress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create');
        const created: CongressEvent = await res.json();
        setCurrentEventId(created.id ?? null);
        setEditingId(created.id ?? null);
      }
      mutate();
      refreshSubEvents();
      setIsModalOpen(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Congress Events</h1>
          <p className="text-slate-500">Manage upcoming and past congress events.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <CrudTable data={records || []} columns={columns} onEdit={openEdit} onDelete={handleDelete} />

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Event' : 'Add Event'}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input {...register('title')} className="w-full p-2 border rounded-md" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Event Date</label>
            <input type="datetime-local" {...register('event_date')} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input {...register('location')} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Featured</label>
            <input type="checkbox" {...register('is_featured')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <CloudinaryUpload onUpload={(url) => setValue('image_url', url, { shouldValidate: true })} />
            {imageUrl && <img src={imageUrl} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />}
          </div>

          {currentEventId && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Sub-events</h3>
                <button type="button" onClick={openAddSubEvent} className="text-sm bg-slate-100 px-2 py-1 rounded">
                  Add Sub-event
                </button>
              </div>
              <ul className="space-y-2">
                {subEvents.map((se) => (
                  <li key={se.id} className="flex justify-between p-2 border rounded text-sm">
                    {se.title}
                    <button type="button" onClick={() => openEditSubEvent(se)} className="text-blue-600">
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md hover:bg-slate-50">
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

      <SubEventModal
        isOpen={subEventModalOpen}
        onClose={() => setSubEventModalOpen(false)}
        eventId={currentEventId || ''}
        subEvent={editingSubEvent || undefined}
        onSuccess={() => {
          refreshSubEvents();
          setSubEventModalOpen(false);
        }}
      />

      <button className="fab" onClick={openCreate} aria-label="Add Event">
        <Plus />
      </button>
    </div>
  );
}
