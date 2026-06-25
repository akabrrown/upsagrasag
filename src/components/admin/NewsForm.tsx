import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsUpdateSchema, NewsUpdate } from '@/types/admin';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useRouter } from 'next/navigation';

interface NewsFormProps {
  initialData?: NewsUpdate;
  isEdit?: boolean;
}

export default function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const router = useRouter();
  const [coverUrl, setCoverUrl] = useState<string>(initialData?.image_url || '');

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newsUpdateSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      category: initialData?.category || 'news',
      image_url: coverUrl,
      published_at: initialData?.published_at?.slice(0, 16) || '',
    },
  });

  // tiptap editor
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialData?.content || '',
    onUpdate: ({ editor }) => {
      setValue('content', editor.getHTML());
    },
  });

  // keep form value in sync when cover image changes
  useEffect(() => {
    setValue('image_url', coverUrl);
  }, [coverUrl, setValue]);

  const onSubmit = async (data: NewsUpdate) => {
    try {
      const url = isEdit && data.id ? `/api/admin/news_updates/${data.id}` : '/api/admin/news_updates';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save');
      router.push('/admin/news_updates');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            {...register('category')}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (required)</label>
          <CloudinaryUpload onUpload={(url) => setCoverUrl(url)} />
          {coverUrl && (
            <div className="mt-2">
              <img src={coverUrl} alt="Cover preview" className="w-32 h-20 object-cover rounded-md border" />
            </div>
          )}
          {errors.image_url && <p className="text-sm text-red-600 mt-1">{errors.image_url.message as string}</p>}
        </div>
        {/* Inline image button for tiptap */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              // trigger CloudinaryUpload via hidden component or simple prompt
              const url = prompt('Enter image URL (or upload via Cloudinary)');
              if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Insert Image
          </button>
        </div>
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      {/* Live preview */}
      <div className="border border-slate-200 rounded p-4 overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-2">Live Preview</h2>
        {editor && (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        )}
      </div>
    </div>
  );
}
