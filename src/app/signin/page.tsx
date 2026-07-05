'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
    } else {
      router.refresh();
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[url('/IMG_5241.jpg')] bg-cover bg-center p-4 sm:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white/10 backdrop-blur-lg rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex min-h-[650px]">
        {/* Left Side - Image panel */}
        <div className="hidden md:flex md:w-[45%] relative bg-[#004080] p-10 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[url('/IMG_5241.jpg')] bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-1000 hover:scale-105"></div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#004080]/30 via-[#004080]/50 to-[#004080]/90 pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-center text-white w-full">
            <span className="font-semibold tracking-wide text-sm opacity-90">Admin Access</span>
            <Link href="/" className="px-4 py-1.5 rounded-full border border-white/30 text-xs font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-3 h-3" /> Back to Site
            </Link>
          </div>

          <div className="relative z-10 w-full mt-auto mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFB800] flex items-center justify-center shadow-lg border-2 border-[#004080]/20">
                <Lock className="w-5 h-5 text-[#004080]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Secure Portal</h3>
                <p className="text-white/80 text-sm font-medium">Authorized Personnel Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form panel */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col bg-white/10 backdrop-blur-lg relative">

          <div className="flex justify-between items-center mb-12 sm:mb-16">
            <h2 className="text-[#004080] font-black text-xl tracking-tight">GRASAG UPSA</h2>
            <div className="px-3 py-1 bg-gray-50 rounded-full text-xs font-semibold text-gray-500 border border-gray-200">
              EN ⌵
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[360px] mx-auto w-full">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Hi Admin</h1>
              <p className="text-gray-500 font-medium text-sm">Welcome to GRASAG UPSA</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#004080] focus:ring-1 focus:ring-[#004080] transition-colors placeholder:text-gray-400 text-gray-900 bg-white text-sm font-medium shadow-sm"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#004080] focus:ring-1 focus:ring-[#004080] transition-colors placeholder:text-gray-400 text-gray-900 bg-white text-sm font-medium shadow-sm"
                />
                <div className="text-right mt-3">
                  <a href="#" className="text-xs font-semibold text-[#004080] hover:text-[#003060] transition-colors">Forgot password ?</a>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-[#004080] hover:bg-[#003060] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004080] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#004080]/20"
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </div>
            </form>
          </div>


        </div>
      </div>
    </main>
  );
}
