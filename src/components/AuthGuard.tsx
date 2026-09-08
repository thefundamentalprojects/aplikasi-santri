"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Lock, KeyRound, ArrowRight, ShieldCheck, UserCheck, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const isPublicRoute = pathname === '/portal-wali';

  useEffect(() => {
    setIsAuthenticated(auth.isLoggedIn());
    setIsLoading(false);
  }, [pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = auth.login(password);
    if (success) {
      setIsAuthenticated(true);
      window.location.reload();
    } else {
      setErrorMsg('Password / PIN Admin salah. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-xs font-semibold">
        Memuat Otentikasi System...
      </div>
    );
  }

  // Public route (Portal Wali Santri) doesn't require login
  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }

  // Admin Login Screen
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Login Admin Operator</h2>
          <p className="text-xs text-slate-400">
            Masukkan Password / PIN Operator untuk mengelola data santri Pondok Pesantren Al-Azhar
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" /> Password / PIN Operator
            </label>
            <input
              type="password"
              placeholder="Masukkan PIN Operator..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-center"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Masuk Sebagai Admin
          </button>
        </form>

        {/* Hint & Portal Wali shortcut */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-3">
          <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-400">
            💡 Password Bawaan: <span className="text-emerald-400 font-mono font-bold">admin123</span>
          </div>

          <Link
            href="/portal-wali"
            className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold transition"
          >
            <UserCheck className="w-4 h-4" /> Saya Wali Santri (Cek Mandiri Lewat NIS) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
