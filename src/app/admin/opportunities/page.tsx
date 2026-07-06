'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { opportunitySchema, Opportunity } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, Copy, Briefcase, Building2, Tag, 
  ExternalLink, MapPin
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminOpportunitiesPage() {
  const { data: records, isLoading, mutate } = useSWR<Opportunity[]>('/api/admin/opportunities', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Opportunities');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<Opportunity>({
    resolver: zodResolver(opportunitySchema) as any,
    defaultValues: { title: '', company: '', type: 'Full-time', category: '', image_url: '', apply_url: '' }
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  // --- Handlers ---
  
  const handleOpenAdd = () => {
    reset({ title: '', company: '', type: 'Full-time', category: '', image_url: '', apply_url: '' });
    setSelectedOpp(null);
    setView('add');
  };

  const handleOpenEdit = (item: Opportunity) => {
    reset(item);
    setSelectedOpp(item);
    setView('edit');
  };

  const handleOpenDetails = (item: Opportunity) => {
    setSelectedOpp(item);
    setView('details');
  };

  const handleDelete = async (item: Opportunity) => {
    if(!confirm(`Are you sure you want to remove this opportunity?`)) return;
    try {
      const res = await fetch(`/api/admin/opportunities/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Opportunity) => {
    try {
      const isEditing = view === 'edit' && selectedOpp;
      const url = isEditing ? `/api/admin/opportunities/${selectedOpp.id}` : '/api/admin/opportunities';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Opportunities', 'Full-time', 'Internships', 'Contract'];
  
  const filteredRecords = (records || []).filter(r => {
    if (activeTab === 'All Opportunities') return true;
    if (activeTab === 'Full-time') return r.type === 'Full-time';
    if (activeTab === 'Internships') return r.type === 'Internship';
    if (activeTab === 'Contract') return r.type === 'Contract' || r.type === 'Part-time';
    return false;
  });

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'Full-time': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Part-time': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Internship': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Contract': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // --- Views ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities Board</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
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
            <Plus className="w-4 h-4" /> Post Opportunity
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
                <th className="px-6 py-4 font-medium">Job Details</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading opportunities...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No opportunities found.</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {record.image_url ? (
                            <img src={record.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{record.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> {record.category || 'General'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{record.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeStyle(record.type)}`}>
                        {record.type}
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
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Opportunity' : 'Post New Opportunity'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Opportunities &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
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
            {isSubmitting ? 'Saving...' : 'Publish Post'}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Job Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                <input 
                  {...register('title')} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                <input 
                  {...register('company')} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
                {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select 
                  {...register('type')} 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category / Industry</label>
                <input 
                  {...register('category')} 
                  placeholder="e.g. Technology, Finance"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application URL (Optional)</label>
              <input 
                {...register('apply_url')} 
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Company Logo</h2>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <CloudinaryUpload onUpload={(url: string) => setValue('image_url', url, { shouldValidate: true })} />
              {imageUrl && (
                <div className="mt-4 w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-md mx-auto bg-white">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  const DetailsView = () => {
    if (!selectedOpp) return null;
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Job Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Opportunities &gt; {selectedOpp.company}</p>
            </div>
          </div>
          {selectedOpp.apply_url && (
            <a
              href={selectedOpp.apply_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> View Posting
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Logo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 mx-auto sm:mx-0 flex items-center justify-center p-4">
              {selectedOpp.image_url ? (
                 <img src={selectedOpp.image_url} alt={selectedOpp.company} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-gray-300" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 text-center sm:text-left space-y-4">
               <div>
                 <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 border ${getTypeStyle(selectedOpp.type)}`}>
                   {selectedOpp.type}
                 </span>
                 <h2 className="text-3xl font-bold text-gray-900 leading-tight">{selectedOpp.title}</h2>
                 <p className="text-lg font-bold text-[#004080]">{selectedOpp.company}</p>
               </div>
               
               <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-gray-600 pt-2">
                 <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400"/> {selectedOpp.category || 'General'}</div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
               <h3 className="font-semibold text-gray-900">Actions</h3>
               <div className="space-y-2">
                 <button onClick={() => handleOpenEdit(selectedOpp)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                   <Pencil className="w-4 h-4 text-gray-400" /> Edit Details
                 </button>
                 <button onClick={() => handleOpenAdd()} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                   <Copy className="w-4 h-4 text-gray-400" /> Duplicate
                 </button>
                 <button onClick={() => handleDelete(selectedOpp)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
                   <Trash2 className="w-4 h-4" /> Remove Post
                 </button>
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
