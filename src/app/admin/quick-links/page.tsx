'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, Search, Filter, Pencil, Trash2, 
  ArrowLeft, Link as LinkIcon, ExternalLink
} from 'lucide-react';

const quickLinkSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL').optional(),
  description: z.string().optional()
});

type QuickLink = z.infer<typeof quickLinkSchema>;

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit';

export default function AdminQuickLinksPage() {
  const { data: records, isLoading, mutate } = useSWR<QuickLink[]>('/api/admin/quick-links', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Links');
  const [selectedLink, setSelectedLink] = useState<QuickLink | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<QuickLink>({
    resolver: zodResolver(quickLinkSchema),
    defaultValues: { title: '', url: '', description: '' }
  });

  const handleOpenAdd = () => {
    reset({ title: '', url: '', description: '' });
    setSelectedLink(null);
    setView('add');
  };

  const handleOpenEdit = (item: QuickLink) => {
    reset(item);
    setSelectedLink(item);
    setView('edit');
  };

  const handleDelete = async (item: QuickLink) => {
    if(!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/quick-links/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: QuickLink) => {
    try {
      const isEditing = view === 'edit' && selectedLink;
      const url = isEditing ? `/api/admin/quick-links/${selectedLink.id}` : '/api/admin/quick-links';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Links'];
  const recordsArray = records ?? [];
  
  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Links</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Quick Links</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search links..." 
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
            <Plus className="w-4 h-4" /> Add Link
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Link Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">URL Destination</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                      Loading links...
                    </div>
                  </td>
                </tr>
              ) : recordsArray.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <LinkIcon className="w-8 h-8 text-gray-300" />
                      <p>No quick links found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recordsArray.map((record: QuickLink) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                          <LinkIcon className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{record.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-sm">{record.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {record.url ? (
                        <a href={record.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline line-clamp-1 max-w-xs break-all">
                          {record.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No URL</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{view === 'edit' ? 'Edit Link' : 'Add New Link'}</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Quick Links &gt; {view === 'edit' ? 'Edit' : 'Add'}</p>
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
            {isSubmitting ? 'Saving...' : (view === 'edit' ? 'Update Link' : 'Save Link')}
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Link Details</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Title *</label>
            <input 
              {...register('title')} 
              placeholder="e.g. Student Portal"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL *</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                {...register('url')} 
                placeholder="https://example.com"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
              />
            </div>
            {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea 
              {...register('description')} 
              placeholder="Briefly describe where this link goes..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] resize-y" 
            />
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
