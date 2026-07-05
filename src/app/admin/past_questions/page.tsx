'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pastQuestionSchema, PastQuestion } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, FileText, Calendar, Link as LinkIcon
} from 'lucide-react';
import CloudinaryUpload from '@/components/CloudinaryUpload';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminPastQuestionsPage() {
  const { data: records, isLoading, mutate } = useSWR<PastQuestion[]>('/api/admin/past_questions', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Questions');
  const [selectedRecord, setSelectedRecord] = useState<PastQuestion | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<PastQuestion>({
    resolver: zodResolver(pastQuestionSchema),
    defaultValues: { title: '', description: '', file_url: '', exam_date: '' }
  });

  // --- Handlers ---
  const handleOpenAdd = () => {
    reset({ title: '', description: '', file_url: '', exam_date: '' });
    setSelectedRecord(null);
    setView('add');
  };

  const handleOpenEdit = (item: PastQuestion) => {
    const formatted = { ...item };
    if (formatted.exam_date) {
      const d = new Date(formatted.exam_date);
      formatted.exam_date = d.toISOString().slice(0, 16);
    }
    reset(formatted);
    setSelectedRecord(item);
    setView('edit');
  };

  const handleOpenDetails = (item: PastQuestion) => {
    setSelectedRecord(item);
    setView('details');
  };

  const handleDelete = async (item: PastQuestion) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/past_questions/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: PastQuestion) => {
    try {
      const isEditing = view === 'edit' && selectedRecord;
      const url = isEditing ? `/api/admin/past_questions/${selectedRecord.id}` : '/api/admin/past_questions';
      const method = isEditing ? 'PATCH' : 'POST';
      const payload = { ...data };
      if (data.exam_date) payload.exam_date = new Date(data.exam_date).toISOString();
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      mutate();
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Questions', 'Exams', 'Assignments'];
  const filtered = (records || []).filter(r => {
    if (activeTab === 'All Questions') return true;
    if (activeTab === 'Exams') return r.type === 'exam';
    if (activeTab === 'Assignments') return r.type === 'assignment';
    return false;
  });

  // --- Views ---
  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Past Questions</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Past Questions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search…" className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-[#2563eb] text-[#2563eb]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Exam Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
              ) : (
                filtered.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 line-clamp-1">{rec.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{rec.description || 'No description'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${rec.type === 'exam' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {rec.exam_date ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(rec.exam_date).toLocaleDateString()}
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenDetails(rec)} className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg" title="Details"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleOpenEdit(rec)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Edit"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(rec)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit Question' : 'Add Question'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Past Questions &gt; {view === 'edit' ? 'Edit' : 'Add'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm shadow-blue-500/30">
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <form className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-semibold text-gray-900 text-lg border-b border-gray-100 pb-4">Question Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input {...register('title')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20" placeholder="e.g. Calculus Midterm 2024" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
              <select {...register('type')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20">
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
              </select>
              {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date (Optional)</label>
              <input type="datetime-local" {...register('exam_date')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20" placeholder="Brief description…" />
          </div>
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Upload PDF (Optional)</h3>
            <CloudinaryUpload onUpload={(url: string) => setValue('file_url', url, { shouldValidate: true })} />
            <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOCX.</p>
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
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Question Details</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Past Questions &gt; Details</p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 border ${selectedRecord.type === 'exam' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {selectedRecord.type}
              </span>
              <h2 className="text-2xl font-bold text-gray-900">{selectedRecord.title}</h2>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Exam Date</p>
            {selectedRecord.exam_date ? (
              <p className="text-gray-900">{new Date(selectedRecord.exam_date).toLocaleString()}</p>
            ) : (
              <p className="text-gray-500 italic">No date provided</p>
            )}
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{selectedRecord.description || 'No description available.'}</p>
          </div>
          {selectedRecord.file_url && (
            <div className="mb-6">
              <a href={selectedRecord.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm font-medium">
                <FileText className="w-4 h-4" /> Download PDF
              </a>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => handleOpenEdit(selectedRecord)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"><Pencil className="w-4 h-4" /> Edit</button>
            <button onClick={() => handleDelete(selectedRecord)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
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
