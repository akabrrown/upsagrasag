'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subEventSchema, SubEvent } from '@/types/admin';
import { X } from 'lucide-react';

type SubEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  subEvent?: SubEvent; // present when editing
  onSuccess: () => void; // called after create/update/delete to refresh list
};

export default function SubEventModal({ isOpen, onClose, eventId, subEvent, onSuccess }: SubEventModalProps) {
  const isEditing = !!subEvent?.id;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
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
    console.log('Submitting sub-event', data);
    if (!eventId) {
      alert('Event ID is missing. Save the parent event first.');
      return;
    }
    const payload: any = { ...data, event_id: eventId };
    if (isEditing && subEvent?.id) {
      payload.id = subEvent.id;
    }
    const method = isEditing ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/admin/sub_events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        const errMsg = result.error ? JSON.stringify(result.error) : res.statusText;
        throw new Error(`Failed to save sub‑event: ${errMsg}`);
      }
      console.log('Response data', result);
      onSuccess();
      onClose();
    } catch (e: any) {
      console.error('Error saving sub-event', e);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        
      <div className="bg-white text-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Sub‑Event' : 'Add Sub‑Event'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{(errors.title.message as string) || 'Required'}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start At</label>
            <input
              type="datetime-local"
              {...register('start_at')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.start_at && <p className="text-sm text-red-600 mt-1">{(errors.start_at.message as string) || 'Required'}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End At (optional)</label>
            <input
              type="datetime-local"
              {...register('end_at')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
