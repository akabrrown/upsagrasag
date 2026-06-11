'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Attempting sign‑in', { email, password });
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Supabase response', { data, authError });
    if (authError) {
      setError(authError.message);
    } else {
      // Synchronize cookies with Next.js Server Components / Middleware
      router.refresh();
      router.replace('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[url('/IMG_5244.jpg')] bg-cover bg-center p-4 relative overflow-hidden text-blue-400">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[60%] rounded-full bg-blue-500/10 blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-500 hover:shadow-accent/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-4 ring-1 ring-accent/50 shadow-[0_0_15px_rgba(184,134,11,0.5)]">
               <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">Admin Portal</h1>
                      <p className="text-blue-500 mt-2 text-sm font-medium">GRASAG UPSA Management Dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/20 border border-error/50 text-error-100 flex items-center animate-in fade-in slide-in-from-top-2">
              <span className="text-sm font-semibold text-white">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                             <label className="text-xs font-bold text-blue-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-accent transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  placeholder="admin@grasag-upsa.edu.gh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-blue-200/50 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                                 <label className="text-xs font-bold text-blue-500 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-accent transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-blue-200/50 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-blue-500 bg-accent hover:bg-[#cba028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-primary transition-all duration-300 shadow-[0_0_20px_rgba(184,134,11,0.3)] hover:shadow-[0_0_25px_rgba(184,134,11,0.6)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
             <p className="text-xs text-blue-500 font-medium tracking-wide">Secure Access • Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    </main>
  );
}
