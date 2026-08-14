'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { AcademicProgramme } from '@/types/admin';
import { Plus, Edit2, Trash2, ArrowLeft, BookOpen } from 'lucide-react';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ViewState = 'list' | 'form';

export default function AcademicProgrammesAdmin() {
  const { data: programmes, mutate, isLoading } = useSWR<AcademicProgramme[]>('/api/admin/academic-programmes', fetcher);
  
  const [view, setView] = useState<ViewState>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [category, setCategory] = useState<'LLM' | 'MA' | 'MSc' | 'MBA' | 'MPhil'>('MSc');
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = (programme: AcademicProgramme) => {
    setEditingId(programme.id!);
    setCategory(programme.category);
    setName(programme.name);
    setDisplayOrder(programme.display_order || 0);
    setError('');
    setView('form');
  };

  const handleAdd = () => {
    setEditingId(null);
    setCategory('MSc');
    setName('');
    setDisplayOrder(0);
    setError('');
    setView('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const url = editingId ? `/api/admin/academic-programmes/${editingId}` : '/api/admin/academic-programmes';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, name, display_order: displayOrder }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }
      
      await mutate();
      setView('list');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme?')) return;
    try {
      const res = await fetch(`/api/admin/academic-programmes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await mutate();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Programmes</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Academic Programmes</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" /> Add New Programme
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Programme Name</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Display Order</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <AdminTableSkeleton columns={4} />
                ) : !programmes || programmes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No programmes found.</p>
                    </td>
                  </tr>
                ) : (
                  programmes.map((prog) => (
                    <tr key={prog.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">{prog.category}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 font-medium">{prog.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{prog.display_order}</td>
                      <td className="py-3 px-4 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(prog)} className="p-1.5 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(prog.id!)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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
    </div>
  );

  const FormView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Programme' : 'Add Programme'}</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Academic Programmes &gt; {editingId ? 'Edit' : 'Add'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Programme'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Programme Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] bg-white"
            >
              <option value="LLM">LLM Programmes</option>
              <option value="MA">MA Programmes</option>
              <option value="MSc">MSc Programmes</option>
              <option value="MBA">MBA Programmes</option>
              <option value="MPhil">MPhil Programmes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Programme Name <span className="text-red-500">*</span></label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Master of Science in Insurance Risk Management"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input 
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]" 
            />
            <p className="text-xs text-gray-400 mt-1">Lower numbers appear first within their category.</p>
          </div>

          <button type="submit" className="hidden" />
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {view === 'list' ? <ListView /> : <FormView />}
    </div>
  );
}
