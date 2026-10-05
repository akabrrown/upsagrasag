'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subEventSchema, SubEvent } from '@/types/admin';
import { X } from 'lucide-react';
import FormModal from '@/components/admin/FormModal';

type SubEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  subEvent?: SubEvent;
  onSuccess: () => void;
};

export default function SubEventModal({ isOpen, onClose, eventId, subEvent, onSuccess }: SubEventModalProps) {
  const isEditing = !!subEvent?.id;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(subEventSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      start_at: '',
      end_at: '',
      description: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditing && subEvent) {
      reset({
        title: subEvent.title ?? '',
        start_at: subEvent.start_at ?? '',
        end_at: subEvent.end_at ?? '',
        description: subEvent.description ?? '',
      });
    } else {
      reset({ title: '', start_at: '', end_at: '', description: '' });
    }
  }, [isEditing, subEvent, reset]);

  const onSubmit = async (data: any) => {
    if (!eventId) {
      alert('Event ID is missing. Save the parent event first.');
      return;
    }
    const payload = { ...data, event_id: eventId };
    if (isEditing && subEvent?.id) payload.id = subEvent.id;
    const method = isEditing ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/admin/sub_events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ? JSON.stringify(result.error) : res.statusText);
      onSuccess();
      onClose();
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  const handleDelete = async () => {
    if (!subEvent?.id) return;
    if (!confirm('Delete this sub‑event?')) return;
    try {
      const res = await fetch(`/api/admin/sub_events/${subEvent.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onSuccess();
      onClose();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Sub‑Event' : 'Add Sub‑Event'}
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Start At</label>
          <input
            type="datetime-local"
            {...register('start_at')}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.start_at && <p className="text-sm text-red-600 mt-1">{errors.start_at.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">End At (optional)</label>
          <input
            type="datetime-local"
            {...register('end_at')}
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
        <div className="flex justify-end space-x-3 pt-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
