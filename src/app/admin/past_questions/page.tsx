'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pastQuestionSchema, PastQuestion, Program } from '@/types/admin';
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus, Download } from 'lucide-react';

// Generic fetcher for SWR
const fetcher = (url: string) => {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    return res.json();
  });
};

export default function AdminPastQuestionsPage() {
  // Data fetching
  const { data: records, error: fetchError, isLoading, mutate } = useSWR<PastQuestion[]>('/api/admin/past_questions', fetcher);
  const { data: programmes } = useSWR<Program[]>('/api/admin/programs', fetcher);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form handling
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<PastQuestion>({ resolver: zodResolver(pastQuestionSchema) });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const openCreate = () => {
    reset({ course_code: '', course_title: '', year: '', programSlug: '' });
    setEditingId(null);
    setUploadedFiles([]);
    setIsModalOpen(true);
  };

  const openEdit = (item: PastQuestion) => {
    reset(item);
    setEditingId(String(item.id));
    setIsModalOpen(true);
  };

  const handleDelete = async (item: PastQuestion) => {
    try {
      const res = await fetch(`/api/admin/past_questions/${String(item.id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      alert(err.message);
    }
  };

  const onSubmit = async (data: PastQuestion) => {
    try {
      const form = new FormData();
      if (!data.programSlug) throw new Error('Program is required');
      form.append('programSlug', data.programSlug);
      form.append('course_code', data.course_code);
      form.append('course_title', data.course_title);
      form.append('year', data.year);

      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
          form.append('files', file);
        });
      } else {
        throw new Error('Please select at least one PDF file');
      }

      const res = await fetch('/api/admin/past_questions/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Failed to upload');
      const responseData = await res.json();
      // Show uploaded file titles for user feedback
      if (Array.isArray(responseData.files)) {
        setUploadedFiles(responseData.files.map((f: { title: string }) => f.title));
      }
      setIsModalOpen(false);
      mutate();
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      alert(err.message);
    }

  };

  // Table columns definition
  const columns: Array<{ header: string; accessor: keyof PastQuestion | ((row: PastQuestion) => React.ReactNode) }> = [
    { header: 'Title', accessor: 'title' },
    { header: 'Course Code', accessor: 'course_code' },
    { header: 'Course Title', accessor: 'course_title' },
    { header: 'Year', accessor: 'year' },
    {
      header: 'File',
      accessor: (row: PastQuestion) => (
        <a
          href={row.file_url ?? '#'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <Download className="w-4 h-4" /> {row.title ?? 'Download'}
        </a>
      ),
    },
  ];

  return (
    <>
      {fetchError && <p className="text-red-600">Error loading past questions.</p>}
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

      {uploadedFiles.length > 0 && (
        <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded">
          <p className="font-medium text-green-800">Uploaded files:</p>
          <ul className="list-disc list-inside text-green-700">
            {uploadedFiles.map((title, idx) => (
              <li key={idx}>{title}</li>
            ))}
          </ul>
        </div>
      )}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
              <select
                {...register('programSlug')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select program</option>
                {Array.isArray(programmes) &&
                  programmes.map(p => (
                    <option key={p.id} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
              </select>
              {errors.programSlug?.message && (
                <p className="text-sm text-red-600 mt-1">{errors.programSlug.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
              <input
                {...register('course_code')}
                placeholder="e.g., MKTG 601"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.course_code?.message && (
                <p className="text-sm text-red-600 mt-1">{errors.course_code.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <input
                {...register('year')}
                placeholder="e.g., 2022/2023"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.year?.message && (
                <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
              <input
                {...register('course_title')}
                placeholder="e.g., Strategic Marketing Management"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.course_title?.message && (
                <p className="text-sm text-red-600 mt-1">{errors.course_title.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload PDF(s)</label>
            <input id="fileInput" type="file" accept="application/pdf" multiple className="w-full" />
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
  </>);
}
