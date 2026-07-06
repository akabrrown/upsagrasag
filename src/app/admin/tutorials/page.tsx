'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tutorialSchema, Tutorial } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, PlayCircle, Video
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit';

export default function AdminTutorialsPage() {
  const { data: records, isLoading, mutate } = useSWR<Tutorial[]>('/api/admin/tutorials', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Tutorials');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<Tutorial>({
    resolver: zodResolver(tutorialSchema),
    defaultValues: { title: '', description: '', video_url: '' }
  });

  const videoUrl = useWatch<Tutorial>({ control, name: 'video_url' });

  const handleOpenAdd = () => {
    reset({ title: '', description: '', video_url: '' });
    setSelectedTutorial(null);
    setView('add');
  };

  const handleOpenEdit = (item: Tutorial) => {
    reset(item);
    setSelectedTutorial(item);
    setView('edit');
  };

  const handleDelete = async (item: Tutorial) => {
    if(!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/tutorials/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Tutorial) => {
    try {
      const isEditing = view === 'edit' && selectedTutorial;
      const url = isEditing ? `/api/admin/tutorials/${selectedTutorial.id}` : '/api/admin/tutorials';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Tutorials'];
  const recordsArray = records ?? [];
  
  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tutorials Management</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Tutorials</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tutorials..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" /> Add Tutorial
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 px-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-[#2563eb] text-[#2563eb]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutorial</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Video Link</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                      Loading tutorials...
                    </div>
                  </td>
                </tr>
              ) : recordsArray.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <PlayCircle className="w-8 h-8 text-gray-300" />
                      <p>No tutorials found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recordsArray.map((record: Tutorial) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <Video className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{record.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-sm">{record.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {record.video_url ? (
                        <a href={record.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                          <PlayCircle className="w-4 h-4" /> Watch Video
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No URL</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {record.video_url && (
                          <a href={record.video_url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors" title="Watch">
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => handleOpenEdit(record)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(record)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AddEditView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{view === 'edit' ? 'Edit Tutorial' : 'Add New Tutorial'}</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Tutorials &gt; {view === 'edit' ? 'Edit' : 'Add'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (view === 'edit' ? 'Update Tutorial' : 'Publish Tutorial')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Tutorial Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                  {...register('title')} 
                  placeholder="Enter tutorial title"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#2563eb] focus-within:ring-1 focus-within:ring-[#2563eb]">
                  <textarea 
                    {...register('description')} 
                    placeholder="Briefly describe what this tutorial covers..."
                    rows={6}
                    className="w-full px-4 py-3 border-none focus:ring-0 resize-y" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Video Source</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">External Link (YouTube, Vimeo, etc.)</label>
                <input 
                  {...register('video_url')} 
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
                />
                {errors.video_url && <p className="text-red-500 text-xs mt-1">{errors.video_url.message as string}</p>}
              </div>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Or Upload File</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                <CloudinaryUpload onUpload={(url) => setValue('video_url', url, { shouldValidate: true })} />
                <div className="mt-4 text-xs text-gray-500 pb-2">
                  <p>Click to upload or drag and drop</p>
                  <p className="mt-1">MP4, WEBM (Max. 50MB)</p>
                </div>
              </div>

              {videoUrl && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-xs text-blue-800 line-clamp-1 break-all flex-1">
                    {videoUrl}
                  </div>
                  {videoUrl.includes('cloudinary') && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-green-500 px-1.5 py-0.5 rounded">Uploaded</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {view === 'list' ? <ListView /> : <AddEditView />}
    </div>
  );
}
