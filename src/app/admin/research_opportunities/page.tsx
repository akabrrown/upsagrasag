'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { researchOpportunitySchema, ResearchOpportunity } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, Copy, GraduationCap, Link as LinkIcon, Calendar, BookOpen
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminResearchOpportunitiesPage() {
  const { data: records, isLoading, mutate } = useSWR<ResearchOpportunity[]>('/api/admin/research_opportunities', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Records');
  const [selectedRecord, setSelectedRecord] = useState<ResearchOpportunity | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ResearchOpportunity>({
    resolver: zodResolver(researchOpportunitySchema),
    defaultValues: { title: '', description: '', sub_type: 'scholarships', link_url: '', deadline: '' }
  });

  // --- Handlers ---
  
  const handleOpenAdd = () => {
    reset({ title: '', description: '', sub_type: 'scholarships', link_url: '', deadline: '' });
    setSelectedRecord(null);
    setView('add');
  };

  const handleOpenEdit = (item: ResearchOpportunity) => {
    const formattedItem = { ...item };
    if (formattedItem.deadline) {
      const d = new Date(formattedItem.deadline);
      formattedItem.deadline = d.toISOString().slice(0, 16);
    }
    reset(formattedItem);
    setSelectedRecord(item);
    setView('edit');
  };

  const handleOpenDetails = (item: ResearchOpportunity) => {
    setSelectedRecord(item);
    setView('details');
  };

  const handleDelete = async (item: ResearchOpportunity) => {
    if(!confirm(`Are you sure you want to remove "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/research_opportunities/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: ResearchOpportunity) => {
    try {
      const isEditing = view === 'edit' && selectedRecord;
      const url = isEditing ? `/api/admin/research_opportunities/${selectedRecord.id}` : '/api/admin/research_opportunities';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const payload = { ...data };
      if (data.deadline) {
        payload.deadline = new Date(data.deadline).toISOString();
      } else {
        delete payload.deadline;
      }
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Records', 'Scholarships', 'Calls for Papers', 'Publications'];
  
  const filteredRecords = (records || []).filter(r => {
    if (activeTab === 'All Records') return true;
    if (activeTab === 'Scholarships') return r.sub_type === 'scholarships';
    if (activeTab === 'Calls for Papers') return r.sub_type === 'calls';
    if (activeTab === 'Publications') return r.sub_type === 'publications';
    return false;
  });

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'scholarships': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'calls': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'publications': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'careers': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'scholarships': return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'calls': return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'publications': return <BookOpen className="w-5 h-5 text-blue-600" />;
      default: return <GraduationCap className="w-5 h-5 text-gray-400" />;
    }
  };

  // --- Views ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research & Grants</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Research & Grants</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search records..." 
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
            <Plus className="w-4 h-4" /> Add Record
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
                <th className="px-6 py-4 font-medium">Title & Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Deadline</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading records...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center mt-1">
                          {getTypeIcon(record.sub_type ?? '')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{record.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{record.description || 'No description provided.'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getTypeStyle(record.sub_type ?? '')}`}>
                        {(record.sub_type ?? '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.deadline ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={new Date(record.deadline) < new Date() ? 'text-red-500 font-medium' : ''}>
                            {new Date(record.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No deadline</span>
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
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Record' : 'Add New Record'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Research & Grants &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
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
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </div>

      <form className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-semibold text-gray-900 text-lg border-b border-gray-100 pb-4">Record Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input 
              {...register('title')} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              placeholder="e.g. Master's Scholarship 2025"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select 
                {...register('sub_type')} 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              >
                <option value="scholarships">Scholarships</option>
                <option value="calls">Calls for Papers</option>
                <option value="publications">Publications</option>
                <option value="careers">Careers</option>
              </select>
              {errors.sub_type && <p className="text-xs text-red-500 mt-1">{errors.sub_type.message as string}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input 
                type="datetime-local"
                {...register('deadline')} 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              {...register('description')} 
              rows={4}
              placeholder="Brief description of the scholarship or grant..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">External Link / Form URL</label>
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
              <h1 className="text-xl font-bold text-gray-900">Record Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Research & Grants &gt; Details</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-start gap-4 mb-6">
             <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
               {getTypeIcon(selectedRecord.sub_type ?? '')}
             </div>
             <div>
               <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 border ${getTypeStyle(selectedRecord.sub_type ?? '')}`}>
                 {(selectedRecord.sub_type ?? '').replace('_', ' ')}
               </span>
               <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedRecord.title}</h2>
             </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Deadline</p>
                {selectedRecord.deadline ? (
                  <p className={`font-semibold ${new Date(selectedRecord.deadline) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(selectedRecord.deadline).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-gray-500 italic text-sm">No deadline specified</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">External Link</p>
                {selectedRecord.link_url ? (
                  <a href={selectedRecord.link_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1">
                    Visit Link <LinkIcon className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-gray-500 italic text-sm">No link provided</p>
                )}
              </div>
           </div>

           <div className="mb-8">
             <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
             <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
               {selectedRecord.description || 'No detailed description available.'}
             </div>
           </div>

           <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
             <button onClick={() => handleOpenEdit(selectedRecord)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
               <Pencil className="w-4 h-4" /> Edit Record
             </button>
             <button onClick={() => handleDelete(selectedRecord)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
               <Trash2 className="w-4 h-4" /> Delete
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
