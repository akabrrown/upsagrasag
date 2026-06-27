'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminUserSchema, AdminUser } from '@/types/admin';

type AdminUserForm = Pick<AdminUser, 'email' | 'role'>;
import CrudTable from '@/components/admin/CrudTable';
import FormModal from '@/components/admin/FormModal';
import { Plus } from 'lucide-react';
import { useAdminData } from '@/app/admin/AdminDataContext';

export default function AdminUsersPage() {
  const { adminUsers, createAdminUser, updateAdminUser, deleteAdminUser } = useAdminData();
  const records = adminUsers;

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
      await deleteAdminUser(user.id!);
      // state updates via realtime subscription
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message);
    }
  };

  const onSubmit = async (data: AdminUserForm) => {
    try {
      if (editingId) {
        await updateAdminUser(editingId, data);
      } else {
        await createAdminUser(data);
      }
      setIsModalOpen(false);
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
