'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Plus, Search, Filter, Trash2, ArrowLeft, Eye, Pencil, CheckCircle2 } from 'lucide-react';

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminAcademicCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Semesters');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/academic-calendar');
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setTitle('');
    setDate('');
    setDescription('');
    setSelectedEvent(null);
    setView('add');
  };

  const handleOpenEdit = (ev: any) => {
    setTitle(ev.title);
    if (ev.date) {
      const d = new Date(ev.date);
      setDate(d.toISOString().slice(0, 10)); // YYYY-MM-DD
    } else {
      setDate('');
    }
    setDescription(ev.description || '');
    setSelectedEvent(ev);
    setView('edit');
  };

  const handleOpenDetails = (ev: any) => {
    setSelectedEvent(ev);
    setView('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (view === 'edit' && selectedEvent) {
         // Current API might not support PUT/PATCH, but we'll try or recreate
         // For now let's just delete and recreate to simulate edit if PATCH fails
         await fetch('/api/academic-calendar', {
           method: 'DELETE',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ id: selectedEvent.id })
         });
      }
      
      const res = await fetch('/api/academic-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, description })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      fetchEvents();
      setView('list');
    } catch (e) {
      alert('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch('/api/academic-calendar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchEvents();
      setView('list');
    } catch (e) {
      alert('Failed to delete event');
    }
  };

  const getStatus = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    if (eventDate > now) return 'Upcoming';
    if (eventDate.toDateString() === now.toDateString()) return 'Today';
    return 'Past';
  };

  const tabs = ['All Semesters', 'Upcoming', 'Past'];
  
  const filteredRecords = events.filter(r => {
    if (activeTab === 'All Semesters') return true;
    const status = getStatus(r.date);
    if (activeTab === 'Upcoming') return status === 'Upcoming' || status === 'Today';
    if (activeTab === 'Past') return status === 'Past';
    return false;
  });

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Academic Calendar</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search timeline..." 
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
            <Plus className="w-4 h-4" /> Add Academic Event
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
                <th className="px-6 py-4 font-medium">Academic Event</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading calendar...</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No events found.</td></tr>
              ) : (
                filteredRecords.map(record => {
                  const status = getStatus(record.date);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-red-500 uppercase">{new Date(record.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-lg font-black text-gray-900 leading-none">{new Date(record.date).getDate()}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{record.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-sm">{record.description || 'No description provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="font-medium text-gray-900">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          status === 'Upcoming' || status === 'Today' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenDetails(record)} className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenEdit(record)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(record.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Academic Event' : 'Add New Academic Event'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Academic Calendar &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="font-semibold text-gray-900 text-lg border-b border-gray-100 pb-4">Event Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Registration Opens"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
                required
              />
              <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Optional details..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm resize-none"
            />
          </div>
        </form>
      </div>
    </div>
  );

  const DetailsView = () => {
    if (!selectedEvent) return null;
    const status = getStatus(selectedEvent.date);
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Academic Event Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Academic Calendar &gt; {selectedEvent.title}</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center mb-6">
             <span className="text-sm font-bold text-blue-600 uppercase">{new Date(selectedEvent.date).toLocaleString('default', { month: 'short' })}</span>
             <span className="text-4xl font-black text-[#004080] leading-none">{new Date(selectedEvent.date).getDate()}</span>
           </div>
           
           <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
           
           <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
             <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4"/> {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}</span>
             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${status === 'Upcoming' || status === 'Today' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
               <CheckCircle2 className="w-3.5 h-3.5" /> {status}
             </span>
           </div>

           <div className="text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100 w-full text-left">
             <h3 className="font-semibold text-gray-900 mb-2">Event Description</h3>
             <p className="whitespace-pre-wrap">{selectedEvent.description || 'No additional details provided for this event.'}</p>
           </div>

           <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-100 w-full">
             <button onClick={() => handleOpenEdit(selectedEvent)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
               <Pencil className="w-4 h-4" /> Edit
             </button>
             <button onClick={() => handleDelete(selectedEvent.id)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
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
