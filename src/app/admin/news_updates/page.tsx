'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsUpdateSchema, NewsUpdate } from '@/types/admin';
import { 
  Plus, Search, Filter, Calendar, Eye, Pencil, Trash2, 
  ArrowLeft, Copy, CheckCircle2, Image as ImageIcon, X
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminNewsPage() {
  const { data: records, isLoading, mutate } = useSWR<NewsUpdate[]>('/api/admin/news_updates', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Articles');
  const [selectedArticle, setSelectedArticle] = useState<NewsUpdate | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<NewsUpdate>({
    resolver: zodResolver(newsUpdateSchema),
    defaultValues: { title: '', content: '', category: 'news', image_url: '', published_at: '' }
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  // --- Handlers ---
  
  const handleOpenAdd = () => {
    reset({ title: '', content: '', category: 'news', image_url: '', published_at: new Date().toISOString() });
    setSelectedArticle(null);
    setView('add');
  };

  const handleOpenEdit = (item: NewsUpdate) => {
    const formattedItem = { ...item };
    if (formattedItem.published_at) {
      const d = new Date(formattedItem.published_at);
      formattedItem.published_at = d.toISOString().slice(0, 16);
    }
    reset(formattedItem);
    setSelectedArticle(item);
    setView('edit');
  };

  const handleOpenDetails = (item: NewsUpdate) => {
    setSelectedArticle(item);
    setView('details');
  };

  const handleDelete = async (item: NewsUpdate) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/news_updates/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: NewsUpdate) => {
    try {
      const isEditing = view === 'edit' && selectedArticle;
      const url = isEditing ? `/api/admin/news_updates/${selectedArticle.id}` : '/api/admin/news_updates';
      const method = isEditing ? 'PATCH' : 'POST';
      const payload = { ...data };
      if (data.published_at) {
        payload.published_at = new Date(data.published_at).toISOString();
      }
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
    }
  };

  // --- Helpers ---
  const isPublished = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) <= new Date();
  };

  const tabs = ['All Articles', 'Published', 'Drafts', 'News', 'Announcements'];
  
  const filteredRecords = records?.filter(r => {
    if (activeTab === 'All Articles') return true;
    if (activeTab === 'Published') return isPublished(r.published_at);
    if (activeTab === 'Drafts') return !isPublished(r.published_at);
    if (activeTab === 'News') return r.category?.toLowerCase() === 'news';
    if (activeTab === 'Announcements') return r.category?.toLowerCase() === 'announcements';
    return false;
  }) || [];

  // --- Views ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; News</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search articles..." 
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
            <Plus className="w-4 h-4" /> Write Article
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-[#2563eb] text-[#2563eb]' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Article</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Publish Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading articles...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No articles found.</td></tr>
              ) : (
                filteredRecords.map(record => {
                  const published = isPublished(record.published_at);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            {record.image_url ? (
                              <img src={record.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-5 h-5"/></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{record.title}</p>
                            <div 
                              className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[300px]"
                              dangerouslySetInnerHTML={{ __html: (record.content || '').substring(0, 100) }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200 capitalize">
                          {record.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            {record.published_at ? (
                              <>
                                <p className="font-medium text-gray-900">{new Date(record.published_at).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-500">{new Date(record.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </>
                            ) : (
                              <p className="font-medium text-gray-400">Not set</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          published ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {published ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleOpenDetails(record)} className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(record)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(record)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FormView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Article' : 'Write New Article'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; News &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (view === 'edit' ? 'Update Article' : 'Publish Article')}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Article Title <span className="text-red-500">*</span></label>
              <input 
                {...register('title')} 
                placeholder="Enter an engaging title"
                className="w-full px-4 py-2 text-lg font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
              <div className="rounded-lg overflow-hidden border border-gray-200 focus-within:border-[#2563eb] focus-within:ring-1 focus-within:ring-[#2563eb] transition-all">
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ''}
                      onChange={field.onChange}
                      modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'header': [1, 2, 3, false] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'blockquote']] }}
                      className="bg-white border-none min-h-[400px]"
                    />
                  )}
                />
              </div>
              {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message as string}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Cover Image</h2>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <CloudinaryUpload onUpload={(url: string) => setValue('image_url', url, { shouldValidate: true })} />
              {imageUrl && (
                <div className="mt-4 w-full aspect-video rounded-lg overflow-hidden border border-gray-200 relative">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setValue('image_url', '')} className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              >
                <option value="news">News</option>
                <option value="announcements">Announcement</option>
                <option value="articles">Article</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  {...register('published_at')} 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  const DetailsView = () => {
    if (!selectedArticle) return null;
    const published = isPublished(selectedArticle.published_at);
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Article Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; News &gt; {selectedArticle.title}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Poster */}
            {selectedArticle.image_url && (
              <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                 <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Details */}
            <div className="space-y-6">
               <div>
                 <div className="flex items-center gap-3 mb-3">
                   <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase">{selectedArticle.category}</span>
                   <span className="text-sm text-gray-500">{selectedArticle.published_at ? new Date(selectedArticle.published_at).toLocaleDateString() : 'Unpublished'}</span>
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 leading-tight">{selectedArticle.title}</h2>
               </div>
               
               <div 
                 className="prose max-w-none text-gray-700" 
                 dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }} 
               />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
               <h3 className="font-semibold text-gray-900">Status & Actions</h3>
               
               <div className={`p-4 rounded-lg flex items-center gap-3 ${published ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                 <CheckCircle2 className="w-5 h-5" />
                 <div>
                   <p className="font-semibold">{published ? 'Live & Published' : 'Draft / Scheduled'}</p>
                   <p className="text-xs opacity-80">{selectedArticle.published_at ? new Date(selectedArticle.published_at).toLocaleString() : 'No date set'}</p>
                 </div>
               </div>

               <div className="space-y-2 pt-4">
                 <button onClick={() => handleOpenEdit(selectedArticle)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                   <Pencil className="w-4 h-4 text-gray-400" /> Edit Article
                 </button>
                 <button onClick={() => handleOpenAdd()} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                   <Copy className="w-4 h-4 text-gray-400" /> Duplicate
                 </button>
                 <button onClick={() => handleDelete(selectedArticle)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
                   <Trash2 className="w-4 h-4" /> Delete Article
                 </button>
               </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
               <h3 className="font-semibold text-gray-900">Engagement Stats</h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Views</span>
                    <span className="font-medium text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Likes</span>
                    <span className="font-medium text-gray-900">0</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {view === 'list' && <ListView />}
      {(view === 'add' || view === 'edit') && <FormView />}
      {view === 'details' && <DetailsView />}
    </>
  );
}
