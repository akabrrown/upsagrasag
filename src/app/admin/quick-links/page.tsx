"use client";

import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Search } from 'lucide-react';

type QuickLink = {
  id: string;
  title: string;
  subtitle: string;
  icon_name: string;
  url: string;
  display_order: number;
};

export default function AdminQuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    icon_name: '',
    url: '',
    display_order: 0,
  });

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/quick-links');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLinks(data);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenModal = (link?: QuickLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        subtitle: link.subtitle || '',
        icon_name: link.icon_name,
        url: link.url,
        display_order: link.display_order,
      });
    } else {
      setEditingLink(null);
      setFormData({
        title: '',
        subtitle: '',
        icon_name: 'Link',
        url: '#',
        display_order: links.length > 0 ? Math.max(...links.map(l => l.display_order)) + 1 : 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingLink ? 'PUT' : 'POST';
      const body = editingLink ? { ...formData, id: editingLink.id } : formData;

      const res = await fetch('/api/quick-links', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        handleCloseModal();
        fetchLinks();
      } else {
        alert('Failed to save link');
      }
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        const res = await fetch(`/api/quick-links?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchLinks();
        } else {
          alert('Failed to delete link');
        }
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Homepage Quick Links</h1>
          <p className="text-sm text-slate-500">Manage the quick action links displayed on the homepage.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add New Link
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="p-4">Order</th>
                <th className="p-4">Title</th>
                <th className="p-4">Subtitle</th>
                <th className="p-4">Icon Name</th>
                <th className="p-4">URL Path</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Loading links...
                  </td>
                </tr>
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No links found. Add your first quick link.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600 font-medium">{link.display_order}</td>
                    <td className="p-4 font-semibold text-slate-800">{link.title}</td>
                    <td className="p-4 text-slate-500 text-sm">{link.subtitle || '-'}</td>
                    <td className="p-4 text-slate-500 text-sm">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 font-mono text-xs text-slate-600">
                        {link.icon_name}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm font-mono truncate max-w-[200px]">{link.url}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(link)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8 relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-slate-800">
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="link-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Volunteer with Us"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Report A Case"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Icon Name *</label>
                  <p className="text-xs text-slate-500 mb-2">Use a valid <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lucide React</a> icon name (e.g. Heart, Briefcase, FileText).</p>
                  <input
                    type="text"
                    required
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/volunteer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="link-form"
                className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
