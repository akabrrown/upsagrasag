'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsUpdateSchema, NewsUpdate } from '@/types/admin';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { useRouter } from 'next/navigation';
import FormModal from '@/components/admin/FormModal';
import Input from '@/components/admin/ui/Input';
import Select from '@/components/admin/ui/Select';
import Textarea from '@/components/admin/ui/Textarea';
import Button from '@/components/admin/ui/Button';

interface NewsFormProps {
  initialData?: NewsUpdate;
  isEdit?: boolean;
}
const categoryOptions = [
  { value: 'news', label: 'News' },
  { value: 'press', label: 'Press Release' },
  { value: 'reports', label: 'Report' },
  { value: 'accountability', label: 'Accountability' },
  { value: 'gallery', label: 'Gallery' },
];
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

  // sync cover image with form
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
      if (!res.ok) throw new Error('Failed to save news');
      router.push('/admin/news_updates');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <FormModal
      isOpen={true}
      onClose={() => router.back()}
      title={isEdit ? 'Edit News' : 'Add News'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <Input
            {...register('title')}
            className="focus:ring-primary/50"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <Select
            {...register('category')}
            options={categoryOptions}
            className="focus:ring-primary/50"
          />
          {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
          <Input
            type="datetime-local"
            {...register('published_at')}
            className="focus:ring-primary/50"
          />
          {errors.published_at && <p className="text-sm text-red-600 mt-1">{errors.published_at.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (required)</label>
          <CloudinaryUpload onUpload={(url) => setCoverUrl(url)} />
          {coverUrl && (
            <div className="mt-2">
              <img src={coverUrl} alt="Cover preview" className="w-32 h-20 object-cover rounded-md border" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <Textarea
            {...field}
            rows={6}
            className="w-full h-full focus:outline-none"
          />
            )}
          />
          {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content.message as string}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
