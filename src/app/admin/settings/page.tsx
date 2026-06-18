'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { platformSettingsSchema, PlatformSettings } from '@/types/admin';
import { Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminSettingsPage() {
  const { data: settings, error, isLoading, mutate } = useSWR<PlatformSettings>('/api/admin/settings', fetcher);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<PlatformSettings>({
    resolver: zodResolver(platformSettingsSchema)
  });

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

  if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="h-10 w-48 bg-slate-200 rounded"></div></div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-slate-500">Manage global platform configurations and your account security.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" /> Platform Configuration
        </h2>
        <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-6">
          
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                {...register('maintenance_mode')} 
                id="maintenance_mode"
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="maintenance_mode" className="font-semibold text-amber-900 block cursor-pointer">
                Maintenance Mode
              </label>
              <p className="text-sm text-amber-700 mt-1">
                When enabled, the public-facing website will display a "Coming Soon" or "Under Maintenance" page.
                Only authenticated administrators will be able to log in and access the dashboard.
              </p>
            </div>
          </div>

          <div className="pt-2">
            {successMsg && <p className="text-sm text-green-600 flex items-center gap-1 mb-2"><CheckCircle2 className="w-4 h-4"/> {successMsg}</p>}
            {errorMsg && <p className="text-sm text-red-600 mb-2">{errorMsg}</p>}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-slate-500" /> Security & Account
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <p className="text-sm text-slate-500 mb-4">Change the password for your admin account.</p>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input 
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input 
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2">
            {pwdSuccess && <p className="text-sm text-green-600 flex items-center gap-1 mb-2"><CheckCircle2 className="w-4 h-4"/> {pwdSuccess}</p>}
            {pwdError && <p className="text-sm text-red-600 mb-2">{pwdError}</p>}
            <button 
              type="submit" 
              disabled={pwdLoading}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {pwdLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

// Inline icon since it wasn't imported at top
function Globe(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      <path d="M2 12h20"/>
    </svg>
  );
}
