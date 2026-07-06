'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminUserSchema, AdminUser } from '@/types/admin';
import { 
  Plus, Search, Filter, Eye, Pencil, Trash2, 
  ArrowLeft, Shield, Mail, Key
} from 'lucide-react';
import { useAdminData } from '@/app/admin/AdminDataContext';

type AdminUserForm = Pick<AdminUser, 'email' | 'role'>;
type ViewState = 'list' | 'add' | 'edit' | 'details';

export default function AdminUsersPage() {
  const { adminUsers, createAdminUser, updateAdminUser, deleteAdminUser } = useAdminData();
  
  const [view, setView] = useState<ViewState>('list');
  const [activeTab, setActiveTab] = useState('All Users');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AdminUserForm>({
    resolver: zodResolver(adminUserSchema) as any
  });

  const handleOpenAdd = () => {
    reset({ email: '', role: 'admin' });
    setSelectedUser(null);
    setView('add');
  };

  const handleOpenEdit = (user: AdminUser) => {
    reset(user);
    setSelectedUser(user);
    setView('edit');
  };

  const handleOpenDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setView('details');
  };

  const handleDelete = async (user: AdminUser) => {
    if(!confirm(`Are you sure you want to remove access for "${user.email}"?`)) return;
    try {
      await deleteAdminUser(user.id!);
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSubmit = async (data: AdminUserForm) => {
    try {
      if (view === 'edit' && selectedUser) {
        await updateAdminUser(selectedUser.id!, data);
      } else {
        await createAdminUser(data);
      }
      setView('list');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const tabs = ['All Users', 'Administrators', 'Editors'];
  
  const filteredRecords = (adminUsers || []).filter(r => {
    if (activeTab === 'All Users') return true;
    if (activeTab === 'Administrators') return r.role === 'admin';
    if (activeTab === 'Editors') return r.role === 'editor';
    return false;
  });

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Settings &gt; Admin Users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by email..." 
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
            <Plus className="w-4 h-4" /> Invite Admin
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
                <th className="px-6 py-4 font-medium">User Profile</th>
                <th className="px-6 py-4 font-medium">Role Level</th>
                <th className="px-6 py-4 font-medium">Date Added</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-[#2563eb] font-bold uppercase">
                          {record.email.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{record.email}</p>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">{record.id?.split('-')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                        record.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        <Shield className="w-3 h-3" /> {record.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(record.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenDetails(record)} className="p-2 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenEdit(record)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(record)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Revoke Access">
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{view === 'edit' ? 'Edit User Access' : 'Invite New Admin'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Settings &gt; Admin Users &gt; {view === 'edit' ? 'Edit' : 'Add New'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-50 flex items-center gap-2"
          >
            <Key className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Grant Access'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">System Access Configuration</h2>
              <p className="text-xs text-gray-500">Configure email and permission level for this user.</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                {...register('email')} 
                type="email"
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all text-sm"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role Level <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-[#2563eb] has-[:checked]:bg-blue-50">
                 <input type="radio" value="admin" {...register('role')} className="mt-1 w-4 h-4 text-[#2563eb]" />
                 <div>
                   <p className="font-semibold text-gray-900 text-sm">Administrator</p>
                   <p className="text-xs text-gray-500 mt-0.5">Full access to manage all content, users, and platform settings.</p>
                 </div>
               </label>
               <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-[#2563eb] has-[:checked]:bg-blue-50">
                 <input type="radio" value="editor" {...register('role')} className="mt-1 w-4 h-4 text-[#2563eb]" />
                 <div>
                   <p className="font-semibold text-gray-900 text-sm">Content Editor</p>
                   <p className="text-xs text-gray-500 mt-0.5">Can create and manage content but cannot manage users or settings.</p>
                 </div>
               </label>
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message as string}</p>}
          </div>
        </form>
      </div>
    </div>
  );

  const DetailsView = () => {
    if (!selectedUser) return null;
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">User Profile</h1>
              <p className="text-xs text-gray-500 mt-0.5">Dashboard &gt; Settings &gt; Admin Users &gt; Profile</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563eb] text-3xl font-bold uppercase mb-4">
             {selectedUser.email.charAt(0)}
           </div>
           
           <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedUser.email}</h2>
           <p className="text-sm font-mono text-gray-500 mb-6">ID: {selectedUser.id}</p>
           
           <div className="flex gap-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border capitalize ${
                selectedUser.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                <Shield className="w-4 h-4" /> {selectedUser.role} Account
              </span>
           </div>

           <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-100 w-full">
             <button onClick={() => handleOpenEdit(selectedUser)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
               <Pencil className="w-4 h-4" /> Edit Role
             </button>
             <button onClick={() => handleDelete(selectedUser)} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors">
               <Trash2 className="w-4 h-4" /> Revoke Access
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
