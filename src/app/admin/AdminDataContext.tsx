"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { AdminUser } from '@/types/admin';

type AdminDataContextType = {
  adminUsers: AdminUser[];
  createAdminUser: (data: Omit<AdminUser, 'id' | 'created_at'>) => Promise<void>;
  updateAdminUser: (id: string, data: Partial<AdminUser>) => Promise<void>;
  deleteAdminUser: (id: string) => Promise<void>;
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  // Initial load
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabaseClient
        .from('admin_users')
        .select('*');
      if (!error && data) setAdminUsers(data as AdminUser[]);
    };
    fetchUsers();
  }, []);

  // Real‑time subscription
  useEffect(() => {
    const channel = supabaseClient
      .channel('admin-users-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_users' }, payload => {
        const newRecord = payload.new as AdminUser;
        const oldRecord = payload.old as AdminUser;
        if (payload.eventType === 'INSERT') {
          setAdminUsers(prev => [...prev, newRecord]);
        } else if (payload.eventType === 'UPDATE') {
          setAdminUsers(prev => prev.map(u => (u.id === newRecord.id ? newRecord : u)));
        } else if (payload.eventType === 'DELETE') {
          setAdminUsers(prev => prev.filter(u => u.id !== oldRecord.id));
        }
      })
      .subscribe();
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  const createAdminUser = async (data: Omit<AdminUser, 'id' | 'created_at'>) => {
    const { error } = await supabaseClient
      .from('admin_users')
      .insert(data);
    if (error) throw error;
    // Real‑time listener will add the new record to state
  };

  const updateAdminUser = async (id: string, data: Partial<AdminUser>) => {
    const { error } = await supabaseClient
      .from('admin_users')
      .update(data)
      .eq('id', id);
    if (error) throw error;
    // Real‑time listener updates state
  };

  const deleteAdminUser = async (id: string) => {
    const { error } = await supabaseClient
      .from('admin_users')
      .delete()
      .eq('id', id);
    if (error) throw error;
    // Real‑time listener updates state
  };

  return (
    <AdminDataContext.Provider value={{ adminUsers, createAdminUser, updateAdminUser, deleteAdminUser }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
