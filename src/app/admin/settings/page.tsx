'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { platformSettingsSchema, PlatformSettings } from '@/types/admin';
import { Save, ShieldAlert, CheckCircle2, Globe, Settings as SettingsIcon, Lock, KeyRound, Construction, ChevronRight } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import './settings.css';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());

export default function AdminSettingsPage() {
  const { data: settings, error, isLoading, mutate } = useSWR<PlatformSettings>('/api/admin/settings', fetcher);
  
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<PlatformSettings>({
    resolver: zodResolver(platformSettingsSchema) as any
  });

  const maintenanceMode = watch('maintenance_mode');

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmitSettings = async (data: PlatformSettings) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSuccessMsg('Settings updated successfully!');
      mutate();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    setPwdLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match.');
      setPwdLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters.');
      setPwdLoading(false);
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwdSuccess('Password changed successfully!');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setPwdSuccess(''), 3000);
    } catch (err: any) {
      setPwdError(err.message);
    } finally {
      setPwdLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 animate-in fade-in duration-500">
        <div className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
        <div className="h-[400px] bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 pointer-events-none">
          <SettingsIcon className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium max-w-xl">Configure platform-wide preferences and manage your account security.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            <button
              onClick={() => setActiveTab('general')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap text-left",
                activeTab === 'general' 
                  ? "bg-[#004080] text-white shadow-md shadow-[#004080]/20" 
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-100"
              )}
            >
              <Globe className="w-4 h-4" />
              <span className="flex-1">General Preferences</span>
              {activeTab === 'general' && <ChevronRight className="w-4 h-4 opacity-50 hidden md:block" />}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap text-left",
                activeTab === 'security' 
                  ? "bg-[#004080] text-white shadow-md shadow-[#004080]/20" 
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-100"
              )}
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="flex-1">Security & Access</span>
              {activeTab === 'security' && <ChevronRight className="w-4 h-4 opacity-50 hidden md:block" />}
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 relative overflow-hidden">
            
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Platform Configuration</h2>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Manage how the public site behaves.</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-8">
                  
                  {/* Custom Premium Toggle Section */}
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-colors duration-500",
                    maintenanceMode ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"
                  )}>
                    <div className="flex items-start justify-between gap-6 relative z-10">
                      <div className="flex gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500",
                          maintenanceMode ? "bg-amber-100 text-amber-600" : "bg-white border border-gray-200 text-gray-400"
                        )}>
                          <Construction className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={cn(
                            "text-lg font-bold transition-colors duration-500",
                            maintenanceMode ? "text-amber-900" : "text-gray-900"
                          )}>
                            Maintenance Mode
                          </h3>
                          <p className={cn(
                            "text-sm mt-1 max-w-lg font-medium transition-colors duration-500",
                            maintenanceMode ? "text-amber-700" : "text-gray-500"
                          )}>
                            Enable this to temporarily hide the public-facing website. Visitors will see a "Coming Soon" page. Only administrators can access this dashboard.
                          </p>
                        </div>
                      </div>
                      
                      {/* Animated Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={maintenanceMode}
                        onClick={() => setValue('maintenance_mode', !maintenanceMode, { shouldDirty: true })}
                        className={cn(
                          "relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#004080] focus:ring-offset-2",
                          maintenanceMode ? "bg-amber-500" : "bg-gray-300"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out",
                            maintenanceMode ? "translate-x-6" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {successMsg && <p className="text-sm text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {successMsg}</p>}
                      {errorMsg && <p className="text-sm text-red-600 font-bold">{errorMsg}</p>}
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-[#004080] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#003060] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> 
                      {isSubmitting ? 'Applying...' : 'Apply Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings Tab */}
            {activeTab === 'security' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Security & Credentials</h2>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Update your administrator password and secure your account.</p>
                </div>
                
                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                  
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Change Password</h3>
                        <p className="text-xs text-gray-500 font-medium">You will remain logged in after changing.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                        <div className="relative">
                          <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="password"
                            type="password"
                            placeholder="Min. 6 characters"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#004080] focus:ring-1 focus:ring-[#004080] font-medium text-sm text-gray-900 transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            name="confirmPassword"
                            type="password"
                            placeholder="Repeat new password"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#004080] focus:ring-1 focus:ring-[#004080] font-medium text-sm text-gray-900 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      {pwdSuccess && <p className="text-sm text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {pwdSuccess}</p>}
                      {pwdError && <p className="text-sm text-red-600 font-bold">{pwdError}</p>}
                    </div>
                    <button 
                      type="submit" 
                      disabled={pwdLoading}
                      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-md disabled:opacity-50"
                    >
                      {pwdLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
