'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminUserSchema, AdminUser } from '@/types/admin';

type AdminUserForm = Pick<AdminUser, 'email' | 'role'>;
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminUsersPage() {
  const { data: users, error, isLoading, mutate } = useSWR<AdminUser[]>('/api/admin/users', fetcher);

  // Mock fallback data when API is unavailable or returns no data
  const mockUsers: AdminUser[] = [
    {
      id: 'mock-1',
      email: 'admin@example.com',
      role: 'admin',
      created_at: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      email: 'editor@example.com',
      role: 'editor',
      created_at: new Date().toISOString(),
    },
  ];

  const records = users ?? mockUsers;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AdminUserForm>({
    resolver: zodResolver(adminUserSchema) as any
  });

  const openCreate = () => {
    reset({ email: '', role: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    reset(user);
    setEditingId(user.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      mutate();
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
    }
  };

  const onSubmit = async (data: AdminUserForm) => {
    try {
      const url = editingId ? `/api/admin/users/${editingId}` : '/api/admin/users';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsModalOpen(false);
      mutate();
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
    }
  };

  const columns = [
    { header: 'Email', accessor: 'email' as keyof AdminUser },
    { header: 'Role', accessor: 'role' as keyof AdminUser },
    { header: 'Created', accessor: (row: AdminUser) => <span suppressHydrationWarning>{new Date(row.created_at!).toLocaleDateString()}</span> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Users</h1>
          <p className="text-slate-500">Manage administrators for the platform.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <CrudTable 
        data={records} 
        columns={columns} 
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Edit Admin User' : 'Create Admin User'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              {...register('email')} 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <input 
              {...register('role')} 
              defaultValue="admin"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message as string}</p>}
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
