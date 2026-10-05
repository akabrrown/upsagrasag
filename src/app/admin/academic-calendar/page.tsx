'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Plus, Search, Filter, Trash2, ArrowLeft, Pencil, CheckCircle2 } from 'lucide-react';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';

type ViewState = 'list' | 'add' | 'edit';

export default function AdminAcademicCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Form states
  const [programType, setProgramType] = useState("Master's Degree");
  const [studentType, setStudentType] = useState("Continuing Students");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [semester, setSemester] = useState("First Semester");
  const [activity, setActivity] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [dateDescription, setDateDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/academic-calendar');
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
    setProgramType("Master's Degree");
    setStudentType("Continuing Students");
    setAcademicYear("2026/2027");
    setSemester("First Semester");
    setActivity('');
    setDurationWeeks('');
    setDateDescription('');
    setSortOrder('0');
    setSelectedEvent(null);
    setView('add');
  };

  const handleOpenEdit = (raw_ev: any) => {
    const ev = Object.fromEntries(Object.entries(raw_ev).map(([k, v]) => [k, v === null ? '' : v])) as any;
    setProgramType(ev.program_type || "Master's Degree");
    setStudentType(ev.student_type || "Continuing Students");
    setAcademicYear(ev.academic_year || "2026/2027");
    setSemester(ev.semester || "First Semester");
    setActivity(ev.activity || '');
    setDurationWeeks(ev.duration_weeks || '');
    setDateDescription(ev.date_description || '');
    setSortOrder(ev.sort_order?.toString() || '0');
    setSelectedEvent(ev);
    setView('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        program_type: programType,
        student_type: studentType,
        academic_year: academicYear,
        semester,
        activity,
        duration_weeks: durationWeeks,
        date_description: dateDescription,
        sort_order: parseInt(sortOrder, 10) || 0
      };

      if (view === 'edit' && selectedEvent) {
         await fetch(`/api/admin/academic-calendar/${selectedEvent.id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(payload)
         });
      } else {
        const res = await fetch('/api/admin/academic-calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to save');
      }
      
      fetchEvents();
      setView('list');
    } catch (e) {
      alert('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/academic-calendar/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchEvents();
      setView('list');
    } catch (e) {
      alert('Failed to delete event');
    }
  };

  const tabs = ['All', "Master's Degree", 'PhD'];
  
  const filteredRecords = events.filter(r => {
    if (activeTab === 'All') return true;
    return r.program_type === activeTab;
  });

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Academic Calendar</p>
        </div>
        <div className="flex items-center gap-3">
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
                <th className="px-6 py-4 font-medium">Activity</th>
                <th className="px-6 py-4 font-medium">Program & Semester</th>
                <th className="px-6 py-4 font-medium">Date Description</th>
                <th className="px-6 py-4 font-medium">Weeks</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <AdminTableSkeleton columns={5} />
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No events found.</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.activity}</div>
                      <div className="text-sm text-gray-500">{record.student_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{record.program_type}</div>
                      <div className="text-xs text-gray-500">{record.semester}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.date_description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.duration_weeks || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(record)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(record.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Delete">
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
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => setView('list')} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{view === 'edit' ? 'Edit Event' : 'Add New Event'}</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the event details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Type</label>
              <select value={programType} onChange={e => setProgramType(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] bg-white">
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Type</label>
              <select value={studentType} onChange={e => setStudentType(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] bg-white">
                <option value="Continuing Students">Continuing Students</option>
                <option value="Freshmen">Freshmen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <input type="text" required value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="e.g. 2026/2027" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select value={semester} onChange={e => setSemester(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] bg-white">
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
                <option value="Public Holidays">Public Holidays</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Description</label>
            <input type="text" required value={activity} onChange={e => setActivity(e.target.value)} placeholder="e.g. Teaching Period" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Weeks)</label>
              <input type="text" value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} placeholder="e.g. 12" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <input type="number" required value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Description</label>
            <textarea required value={dateDescription} onChange={e => setDateDescription(e.target.value)} placeholder="e.g. Monday, 1st March - Sunday, 23rd May 2027" rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] resize-y" />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-500/30">
            {isSubmitting ? 'Saving...' : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {view === 'edit' ? 'Update Event' : 'Save Event'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return view === 'list' ? <ListView /> : <FormView />;
}
