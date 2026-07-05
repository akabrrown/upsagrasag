'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceSchema, Resource } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, Copy, FileText, Link as LinkIcon, Download
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminResourcesPage() {
  const { data: records, isLoading, mutate } = useSWR<Resource[]>('/api/admin/resources', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Resources');
  const [selectedRecord, setSelectedRecord] = useState<Resource | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<Resource>({
    resolver: zodResolver(resourceSchema),
    defaultValues: { title: '', description: '', file_url: '', link_url: '' }
  });

  // --- Handlers ---
  
  const handleOpenAdd = () => {
    reset({ title: '', description: '', file_url: '', link_url: '' });
    setSelectedRecord(null);
    setView('add');
  };

  const handleOpenEdit = (item: Resource) => {
    reset(item);
    setSelectedRecord(item);
    setView('edit');
  };

  const handleOpenDetails = (item: Resource) => {
    setSelectedRecord(item);
    setView('details');
  };

  const handleDelete = async (item: Resource) => {
    if(!confirm(`Are you sure you want to remove "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/resources/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Resource) => {
    try {
      const isEditing = view === 'edit' && selectedRecord;
      const url = isEditing ? `/api/admin/resources/${selectedRecord.id}` : '/api/admin/resources';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Resources', 'Documents', 'External Links'];
  
  const filteredRecords = (records || []).filter(r => {
    if (activeTab === 'All Resources') return true;
    if (activeTab === 'Documents') return !!r.file_url;
    if (activeTab === 'External Links') return !!r.link_url && !r.file_url;
    return false;
  });

  // --- Views ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic & Career Resources</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Resources</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search resources..." 
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
            <Plus className="w-4 h-4" /> Upload Resource
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
                <th className="px-6 py-4 font-medium">Resource Info</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Access</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading resources...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No resources found.</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg border overflow-hidden flex-shrink-0 flex items-center justify-center mt-1 ${record.file_url ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                          {record.file_url ? <FileText className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{record.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{record.description || 'No description provided.'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${record.file_url ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {record.file_url ? 'Document' : 'External Link'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.file_url ? (
                        <a href={record.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" /> Download
                        </a>
                      ) : record.link_url ? (
                        <a href={record.link_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
                          <LinkIcon className="w-4 h-4" /> Visit Link
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Unavailable</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                ))
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
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Resource' : 'Upload Resource'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Resources &gt; {view === 'edit' ? 'Edit' : 'Upload'}</p>
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
            {isSubmitting ? 'Saving...' : 'Save Resource'}
          </button>
        </div>
      </div>

      <form className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-semibold text-gray-900 text-lg border-b border-gray-100 pb-4">Resource Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title <span className="text-red-500">*</span></label>
            <input 
              {...register('title')} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              placeholder="e.g. Official Student Handbook 2024"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea 
              {...register('description')} 
              rows={3}
              placeholder="Brief description of the resource..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">Option A: Upload File</h3>
              <div>
                <CloudinaryUpload onUpload={(url: string) => setValue('file_url', url, { shouldValidate: true })} />
                <p className="text-xs text-gray-500 mt-2">Upload a PDF, DOCX, or other file type.</p>
                {/* Note: In a real app we might display the uploaded file URL preview here */}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span className="px-4 py-1 bg-gray-100 text-gray-500 font-bold text-xs rounded-full uppercase tracking-wider">OR</span>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">Option B: External Link</h3>
              <div>
                <div className="relative">
                  <input 
                    {...register('link_url')} 
                    type="url"
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                  />
                  <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.link_url && <p className="text-xs text-red-500 mt-1">{errors.link_url.message as string}</p>}
                <p className="text-xs text-gray-500 mt-2">Link to an external website, Google Drive, or Dropbox file.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  const DetailsView = () => {
    if (!selectedRecord) return null;
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resource Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Resources &gt; Details</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-start gap-4 mb-6">
             <div className={`w-14 h-14 rounded-xl border flex items-center justify-center flex-shrink-0 ${selectedRecord.file_url ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
               {selectedRecord.file_url ? <FileText className="w-6 h-6" /> : <LinkIcon className="w-6 h-6" />}
             </div>
             <div>
               <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 border ${selectedRecord.file_url ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                 {selectedRecord.file_url ? 'Downloadable Document' : 'External Link'}
               </span>
               <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedRecord.title}</h2>
             </div>
           </div>
           
           <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-2">Access Resource</p>
              {selectedRecord.file_url ? (
                <a href={selectedRecord.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm font-medium">
                  <Download className="w-4 h-4" /> Download File
                </a>
              ) : selectedRecord.link_url ? (
                <a href={selectedRecord.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm font-medium">
                  <LinkIcon className="w-4 h-4" /> Visit External Link
                </a>
              ) : (
                <p className="text-gray-500 italic text-sm">No access link provided</p>
              )}
           </div>

           <div className="mb-8">
             <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
             <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
               {selectedRecord.description || 'No detailed description available.'}
             </div>
           </div>

           <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
             <button onClick={() => handleOpenEdit(selectedRecord)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
               <Pencil className="w-4 h-4" /> Edit Details
             </button>
             <button onClick={() => handleDelete(selectedRecord)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
               <Trash2 className="w-4 h-4" /> Delete Resource
             </button>
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
