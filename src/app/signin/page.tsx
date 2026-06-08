'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({ resolver: zodResolver(signInSchema as any) as any });

  const onSubmit = async (data: SignInForm) => {
    const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert(error.message);
    } else {
      router.replace('/');
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-neutral-200 p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/grasag-upsa-logo.png"
              alt="GRASAG‑UPSA"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-extrabold text-primary">Sign in to your account</h1>
            <p className="text-sm text-neutral-500 font-medium">Access the GRASAG‑UPSA portal</p>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="flex items-center gap-2 text-xs font-bold text-neutral-700">
              <Mail className="h-4 w-4 text-accent" /> Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="student@upsamail.edu.gh"
              {...register('email')}
              className="form-input"
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="flex items-center gap-2 text-xs font-bold text-neutral-700">
              <Lock className="h-4 w-4 text-accent" /> Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className="form-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3.5 flex items-center text-neutral-400 hover:text-accent"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3.5"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>

          {/* Auxiliary links */}
            <div className="flex flex-col items-center space-y-2 text-xs font-medium text-neutral-500 pt-2">
              <a href="#" className="underline hover:text-accent transition-colors">
                Forgot password?
              </a>
            </div>
        </form>
      </div>
    </section>
  );
}
