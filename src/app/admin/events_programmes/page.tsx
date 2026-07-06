'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventProgrammeSchema, EventProgramme, EventProgrammeRecord } from '@/types/admin';
import { 
  Plus, Search, Filter, MapPin, Calendar, Eye, Pencil, Trash2, 
  ArrowLeft, Copy, CheckCircle2, X
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function EventsManagement() {
  const { data: records, isLoading, mutate } = useSWR<EventProgrammeRecord[]>('/api/admin/events_programmes', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Events');
  const [selectedEvent, setSelectedEvent] = useState<EventProgrammeRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EventProgramme>({
    resolver: zodResolver(eventProgrammeSchema) as any,
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  // --- Handlers ---
  
  const handleOpenAdd = () => {
    reset({ title: '', description: '', event_date: '', location: '', image_url: '', url: '', is_featured: false });
    setSelectedEvent(null);
    setView('add');
  };

  const handleOpenEdit = (item: EventProgrammeRecord) => {
    const { id, ...rest } = item;
    const formattedItem = { ...rest } as any;
    if (formattedItem.event_date) {
      const d = new Date(formattedItem.event_date);
      formattedItem.event_date = d.toISOString().slice(0, 16);
    }
    reset(formattedItem);
    setSelectedEvent(item);
    setView('edit');
  };

  const handleOpenDetails = (item: EventProgrammeRecord) => {
    setSelectedEvent(item);
    setView('details');
  };

  const handleDelete = async (item: EventProgrammeRecord) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events_programmes/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: z.input<typeof eventProgrammeSchema>) => {
    try {
      const isEditing = view === 'edit' && selectedEvent;
      const url = isEditing ? `/api/admin/events_programmes/${selectedEvent.id}` : '/api/admin/events_programmes';
      const method = isEditing ? 'PATCH' : 'POST';
      const payload = { ...data, event_date: new Date(data.event_date).toISOString() };
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
    }
  };

  // --- Helpers ---
  const getStatus = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    if (eventDate > now) return 'Upcoming';
    if (eventDate.toDateString() === now.toDateString()) return 'Ongoing';
    return 'Past';
  };

  const tabs = ['All Events', 'Upcoming', 'Ongoing', 'Past', 'Draft'];
  
  const filteredRecords = records?.filter(r => {
    if (activeTab === 'All Events') return true;
    const status = getStatus(r.event_date);
    if (activeTab === status) return true;
    if (activeTab === 'Draft' && !r.is_featured) return true; // Just a dummy filter for draft
    return false;
  }) || [];

  // --- Views ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search events..." 
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
            <Plus className="w-4 h-4" /> Add New Event
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
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Visibility</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading events...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No events found.</td></tr>
              ) : (
                filteredRecords.map(record => {
                  const status = getStatus(record.event_date);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            {record.image_url ? (
                              <img src={record.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400"><Calendar className="w-5 h-5"/></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{record.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{record.description || 'No description provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">{new Date(record.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-xs text-gray-500">{new Date(record.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="max-w-[150px]">
                            <p className="font-medium text-gray-900 truncate">{record.location || 'TBA'}</p>
                            <p className="text-xs text-gray-500 truncate">UPSA Campus</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          status === 'Upcoming' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          status === 'Ongoing' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          record.is_featured ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {record.is_featured ? 'Published' : 'Unpublished'}
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
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Event' : 'Add New Event'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Events &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
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
            {isSubmitting ? 'Saving...' : (view === 'edit' ? 'Update Event' : 'Publish Event')}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Event Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
              <input 
                {...register('title')} 
                placeholder="Enter event title"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Venue</label>
              <input 
                {...register('location')} 
                placeholder="e.g. UPSA Auditorium"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea 
                {...register('description')} 
                rows={6}
                placeholder="Write full description about the event..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event External URL</label>
              <input 
                {...register('url')} 
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Event Poster / Image</h2>
            
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
            <h2 className="font-semibold text-gray-900 text-lg">Event Schedule</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  {...register('event_date')} 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.event_date && <p className="text-xs text-red-500 mt-1">{errors.event_date.message as string}</p>}
            </div>

            <div className="pt-4 border-t border-gray-100">
               <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('is_featured')} className="w-5 h-5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Publish Event</p>
                    <p className="text-xs text-gray-500">Make this event visible to students</p>
                  </div>
               </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  const DetailsView = () => {
    if (!selectedEvent) return null;
    const status = getStatus(selectedEvent.event_date);
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Event Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Events &gt; {selectedEvent.title}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Poster */}
            <div className="w-full sm:w-1/3 aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
              {selectedEvent.image_url ? (
                 <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400"><Calendar className="w-12 h-12" /></div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
               <div>
                 <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedEvent.title}</h2>
                 <p className="text-sm text-gray-500 mt-2">{selectedEvent.description}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-y-4 text-sm">
                 <div>
                   <p className="text-gray-500 flex items-center gap-2 mb-1"><Calendar className="w-4 h-4"/> Date</p>
                   <p className="font-medium text-gray-900">{new Date(selectedEvent.event_date).toLocaleDateString()}</p>
                 </div>
                 <div>
                   <p className="text-gray-500 flex items-center gap-2 mb-1"><Calendar className="w-4 h-4"/> Time</p>
                   <p className="font-medium text-gray-900">{new Date(selectedEvent.event_date).toLocaleTimeString()}</p>
                 </div>
                 <div>
                   <p className="text-gray-500 flex items-center gap-2 mb-1"><MapPin className="w-4 h-4"/> Venue</p>
                   <p className="font-medium text-gray-900">{selectedEvent.location || 'TBA'}</p>
                 </div>
                 <div>
                   <p className="text-gray-500 flex items-center gap-2 mb-1"><CheckCircle2 className="w-4 h-4"/> Status</p>
                   <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${status === 'Upcoming' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{status}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
               <h3 className="font-semibold text-gray-900">Actions</h3>
               <div className="space-y-2">
                 <button onClick={() => handleOpenEdit(selectedEvent)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                   <Pencil className="w-4 h-4 text-gray-400" /> Edit Event
                 </button>
                 <button onClick={() => handleOpenAdd()} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                   <Copy className="w-4 h-4 text-gray-400" /> Duplicate Event
                 </button>
                 <button onClick={() => handleDelete(selectedEvent)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
                   <Trash2 className="w-4 h-4" /> Delete Event
                 </button>
               </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
               <h3 className="font-semibold text-gray-900">Event Statistics</h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Views</span>
                    <span className="font-medium text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Registrations</span>
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
