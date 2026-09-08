"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Download, ShieldCheck, UserCheck, Bell } from 'lucide-react';
import { db } from '@/lib/db';
import { PesantrenConfig } from '@/lib/types';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [config, setConfig] = useState<PesantrenConfig | null>(null);

  useEffect(() => {
    setConfig(db.getConfig());
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800 transition"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base leading-tight tracking-tight flex items-center gap-2">
              {config?.namaPondok || "SANTRI HUB"}
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Vercel Ready
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Sistem Informasi Manajemen Santri</p>
          </div>
        </div>
      </div>

      {/* Right side: Quick Action Buttons */}
      <div className="flex items-center gap-2">
        <a
          href="/portal-wali"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/60 border border-teal-700/50 hover:bg-teal-900/60 rounded-lg transition"
        >
          <UserCheck className="w-4 h-4 text-teal-400" />
          Akses Wali Santri
        </a>

        <button
          onClick={() => {
            const jsonStr = db.exportDatabaseJSON();
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_santrihub_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          title="Backup Database JSON"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 hover:bg-slate-700/80 rounded-lg transition shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Backup Data</span>
        </button>

        <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center">
            ADM
          </div>
        </div>
      </div>
    </header>
  );
};
