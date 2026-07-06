'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { congressSchema, CongressEvent, SubEvent } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, Calendar, MapPin, CheckCircle2, XCircle
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import SubEventModal from '@/components/admin/SubEventModal';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminCongressPage() {
  const { data: records, isLoading, mutate } = useSWR<CongressEvent[]>('/api/admin/congress', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Events');
  const [selectedEvent, setSelectedEvent] = useState<CongressEvent | null>(null);
  
  // SubEvents state
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [subEventModalOpen, setSubEventModalOpen] = useState(false);
  const [editingSubEvent, setEditingSubEvent] = useState<SubEvent | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(congressSchema),
    defaultValues: { title: '', description: '', event_date: '', location: '', image_url: '', url: '' }
  });

  const imageUrl = useWatch({ control, name: 'image_url' });

  const refreshSubEvents = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/sub_events?event_id=${eventId}`);
      if (res.ok) {
        setSubEvents(await res.json());
      }
    } catch (_) {}
  };

  const handleOpenAdd = () => {
    reset({ title: '', description: '', event_date: '', location: '', image_url: '', is_featured: false, url: '' });
    setSelectedEvent(null);
    setSubEvents([]);
    setView('add');
  };

  const handleOpenEdit = async (item: CongressEvent) => {
    const formatted = { ...item };
    if (formatted.event_date) {
      const d = new Date(formatted.event_date);
      formatted.event_date = d.toISOString().slice(0, 16);
    }
    reset(formatted);
    setSelectedEvent(item);
    await refreshSubEvents(item.id!);
    setView('edit');
  };

  const handleOpenDetails = async (item: CongressEvent) => {
    setSelectedEvent(item);
    await refreshSubEvents(item.id!);
    setView('details');
  };

  const handleDelete = async (item: CongressEvent) => {
    if(!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/congress/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: CongressEvent) => {
    try {
      const isEditing = view === 'edit' && selectedEvent;
      const url = isEditing ? `/api/admin/congress/${selectedEvent.id}` : '/api/admin/congress';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to save');
      
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const openAddSubEvent = () => {
    setEditingSubEvent(null);
    setSubEventModalOpen(true);
  };

  const openEditSubEvent = (se: SubEvent) => {
    setEditingSubEvent(se);
    setSubEventModalOpen(true);
  };

  const tabs = ['All Events', 'Upcoming', 'Past'];
  
  const recordsArray = records ?? [];
  
  const filteredRecords = recordsArray.filter((record: CongressEvent) => {
    if (activeTab === 'Upcoming') return new Date(record.event_date) >= new Date();
    if (activeTab === 'Past') return new Date(record.event_date) < new Date();
    return true;
  });

  const sortedRecords = filteredRecords.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

  // --- Views ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Congress Events</p>
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                      Loading events...
                    </div>
                  </td>
                </tr>
              ) : sortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-8 h-8 text-gray-300" />
                      <p>No events found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedRecords.map((record: CongressEvent) => {
                  const isPast = new Date(record.event_date) < new Date();
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {record.image_url ? (
                            <img src={record.image_url} alt={record.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{record.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{record.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(record.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}<br/><span className="text-xs text-gray-400">{new Date(record.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span></span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="line-clamp-2 max-w-[150px]">{record.location || 'TBA'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          isPast 
                            ? 'bg-gray-50 text-gray-600 border-gray-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {isPast ? 'Past' : 'Upcoming'}
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

  const AddEditView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{view === 'edit' ? 'Edit Event' : 'Add New Event'}</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Events &gt; {view === 'edit' ? 'Edit' : 'Add'}</p>
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
            {isSubmitting ? 'Saving...' : (view === 'edit' ? 'Update Event' : 'Publish Event')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input 
                  {...register('title')} 
                  placeholder="Enter event title"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#2563eb] focus-within:ring-1 focus-within:ring-[#2563eb]">
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-2 text-gray-500">
                    <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded shadow-sm">Paragraph</span>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <span className="font-bold cursor-pointer hover:text-gray-800">B</span>
                    <span className="italic cursor-pointer hover:text-gray-800">I</span>
                    <span className="underline cursor-pointer hover:text-gray-800">U</span>
                  </div>
                  <textarea 
                    {...register('description')} 
                    placeholder="Write full description about the event..."
                    rows={8}
                    className="w-full px-4 py-3 border-none focus:ring-0 resize-y" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">External Link (Optional)</label>
                <input 
                  {...register('url')} 
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
                />
              </div>
            </div>
          </div>

          {view === 'edit' && selectedEvent && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Event Schedule (Sub-events)</h2>
                <button 
                  onClick={openAddSubEvent}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#2563eb] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Sub-event
                </button>
              </div>

              {subEvents.length > 0 ? (
                <div className="space-y-3">
                  {subEvents.map(se => (
                    <div key={se.id} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{se.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(se.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {se.end_at ? ` - ${new Date(se.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => openEditSubEvent(se)}
                        className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-blue-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500">No sub-events added yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Poster</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
              <CloudinaryUpload onUpload={(url) => setValue('image_url', url, { shouldValidate: true })} />
              {imageUrl ? (
                <div className="mt-4 relative rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={imageUrl} alt="preview" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Click above to replace</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-xs text-gray-500 pb-2">
                  <p>Click to upload or drag and drop</p>
                  <p className="mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
                <input 
                  type="datetime-local" 
                  {...register('event_date')} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
                />
                {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date.message as string}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    {...register('location')} 
                    placeholder="Enter location"
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    {...register('is_featured')} 
                    className="w-4 h-4 text-[#2563eb] rounded border-gray-300 focus:ring-[#2563eb]" 
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-900">Featured Event</span>
                    <span className="block text-xs text-gray-500">Highlight this event on the homepage</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DetailsView = () => {
    if (!selectedEvent) return null;
    const isPast = new Date(selectedEvent.event_date) < new Date();
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Events &gt; {selectedEvent.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Poster Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {selectedEvent.image_url ? (
                <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <Calendar className="w-12 h-12 mb-2" />
                  <span>No Poster Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
              <p className="text-gray-600 text-sm mb-6 pb-6 border-b border-gray-100">
                {selectedEvent.description || 'No description provided.'}
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5"><Calendar className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Date & Time</div>
                    <div className="text-sm text-gray-600">
                      {new Date(selectedEvent.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                      {new Date(selectedEvent.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5"><MapPin className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Venue</div>
                    <div className="text-sm text-gray-600">{selectedEvent.location || 'TBA'}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-gray-400" /></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Status</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        isPast ? 'bg-gray-100 text-gray-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isPast ? 'Past Event' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {subEvents.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Event Schedule</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {subEvents.map((se, idx) => (
                    <div key={se.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-gray-300 group-[.is-active]:bg-[#2563eb] text-transparent shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-900 text-sm">{se.title}</div>
                          <div className="text-xs text-[#2563eb] font-medium">
                            {new Date(se.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        {se.description && <div className="text-xs text-slate-500">{se.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions & Stats Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => handleOpenEdit(selectedEvent)}
                  className="w-full flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Edit Event
                </button>
                {selectedEvent.url && (
                  <a 
                    href={selectedEvent.url} target="_blank" rel="noreferrer"
                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View External Link
                  </a>
                )}
                <button 
                  onClick={() => handleDelete(selectedEvent)}
                  className="w-full flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Event
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Event Statistics</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2"><Eye className="w-4 h-4" /> Views</span>
                  <span className="font-medium">N/A</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Registrations</span>
                  <span className="font-medium">N/A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {view === 'list' && <ListView />}
      {view === 'add' && <AddEditView />}
      {view === 'edit' && <AddEditView />}
      {view === 'details' && <DetailsView />}

      <SubEventModal
        isOpen={subEventModalOpen}
        onClose={() => setSubEventModalOpen(false)}
        eventId={selectedEvent?.id || ''}
        subEvent={editingSubEvent || undefined}
        onSuccess={() => {
          if (selectedEvent?.id) refreshSubEvents(selectedEvent.id);
          setSubEventModalOpen(false);
        }}
      />
    </div>
  );
}
