'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Types for welfare service
interface WelfareService {
  id: number;
  title: string;
  description: string;
  action: string;
  href?: string;
  icon: string;
}

export default function AdminWelfarePage() {
  const [services, setServices] = useState<WelfareService[]>([]);
  const [form, setForm] = useState<Partial<WelfareService>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/welfare-services');
      const data = await res.json();
      setServices(data);
    } catch (e) {
      console.error('Failed to load welfare services', e);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const payload = editingId ? { id: editingId, ...form } : form;
    const res = await fetch('/api/admin/welfare-services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchServices();
      setForm({});
      setEditingId(null);
    } else {
      console.error('Failed to save service');
    }
  };

  const startEdit = (svc: WelfareService) => {
    setForm(svc);
    setEditingId(svc.id);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch('/api/admin/welfare-services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) await fetchServices();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welfare Services – Admin</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8 border p-4 rounded-lg">
        <input
          name="title"
          placeholder="Title"
          value={form.title || ''}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description || ''}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="action"
          placeholder="Action text"
          value={form.action || ''}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="href"
          placeholder="Href (optional)"
          value={form.href || ''}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          name="icon"
          placeholder="Icon name (e.g., HeartPulse)"
          value={form.icon || ''}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <button
          type="submit"
          className="bg-[#B8860B] text-white py-2 px-4 rounded hover:bg-[#a6790a]"
        >
          {editingId ? 'Update Service' : 'Add Service'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setForm({}); setEditingId(null); }}
            className="bg-gray-300 py-2 px-4 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Icon</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(svc => (
            <tr key={svc.id} className="border-t">
              <td className="p-2">{svc.title}</td>
              <td className="p-2">{svc.icon}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => startEdit(svc)}
                  className="text-blue-600 underline"
                >Edit</button>
                <button
                  onClick={() => handleDelete(svc.id)}
                  className="text-red-600 underline"
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href="/admin" className="block mt-6 text-blue-600 underline">
        Back to admin dashboard
      </Link>
    </div>
  );
}
