'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerSchema, Partner } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, Copy, Building2
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminPartnersPage() {
  const { data: records, isLoading, mutate } = useSWR<Partner[]>('/api/admin/partners', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Partners');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Partner>({
    resolver: zodResolver(partnerSchema),
    defaultValues: { name: '', logo_url: '', display_order: 0 },
  });

  const logoUrl = useWatch({ control, name: 'logo_url' });

  // --- Handlers ---
  
  const handleOpenAdd = () => {
    reset({ name: '', logo_url: '', display_order: 0 });
    setSelectedPartner(null);
    setView('add');
  };

  const handleOpenEdit = (item: Partner) => {
    const unified = { ...item, logo_url: item.logo_url || (item as any).image_url || (item as any).photo_url || '' };
    reset(unified);
    setSelectedPartner(unified);
    setView('edit');
  };

  const handleOpenDetails = (item: Partner) => {
    const unified = { ...item, logo_url: item.logo_url || (item as any).image_url || (item as any).photo_url || '' };
    setSelectedPartner(unified);
    setView('details');
  };

  const handleDelete = async (item: Partner) => {
    if(!confirm(`Are you sure you want to remove ${item.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/partners/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: Partner) => {
    if (!data.logo_url) data.logo_url = '';
    try {
      const isEditing = view === 'edit' && selectedPartner;
      const url = isEditing ? `/api/admin/partners/${selectedPartner.id}` : '/api/admin/partners';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Partners', 'Active', 'Archived'];
  
  const sortedRecords = (records || []).map(r => ({ ...r, logo_url: r.logo_url || (r as any).image_url || (r as any).photo_url || '' })).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partners & Sponsors</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Partners</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search partners..." 
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
            <Plus className="w-4 h-4" /> Add Partner
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
                <th className="px-6 py-4 font-medium">Partner / Sponsor</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Display Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading partners...</td></tr>
              ) : sortedRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No partners found.</td></tr>
              ) : (
                sortedRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                          {record.logo_url ? (
                            <img src={record.logo_url} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{record.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Corporate Partner</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-100">
                        Sponsor
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{record.display_order}</span>
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
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Partner' : 'Add New Partner'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Partners &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Saving...' : 'Save Partner'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg border-b border-gray-100 pb-4">Partner Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organization Name <span className="text-red-500">*</span></label>
              <input 
                {...register('name')} 
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input 
                type="number"
                {...register('display_order', { valueAsNumber: true })} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on the homepage carousel.</p>
              {errors.display_order && <p className="text-xs text-red-500 mt-1">{errors.display_order.message as string}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Partner Logo</h2>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <CloudinaryUpload onUpload={(url: string) => setValue('logo_url', url, { shouldValidate: true })} />
              {logoUrl && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                  <img src={logoUrl} alt="Preview" className="h-20 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DetailsView = () => {
    if (!selectedPartner) return null;
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Partner Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Partners &gt; {selectedPartner.name}</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <div className="w-32 h-32 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center p-4 mb-6">
             {selectedPartner.logo_url ? (
                <img src={selectedPartner.logo_url} alt={selectedPartner.name} className="w-full h-full object-contain" />
             ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
             )}
           </div>
           
           <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedPartner.name}</h2>
           
           <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
             <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded-md font-bold uppercase tracking-wider">Corporate Sponsor</span>
           </div>

           <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-100 w-full">
             <button onClick={() => handleOpenEdit(selectedPartner)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
               <Pencil className="w-4 h-4" /> Edit Partner
             </button>
             <button onClick={() => handleDelete(selectedPartner)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
               <Trash2 className="w-4 h-4" /> Remove
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
