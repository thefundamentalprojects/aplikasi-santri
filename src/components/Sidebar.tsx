"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  CalendarCheck,
  BookMarked,
  Receipt,
  AlertTriangle,
  UserSquare2,
  Settings,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Data Santri & Alumni', href: '/santri', icon: Users, badge: 'Utama' },
    { name: 'Cetak Surat Izin', href: '/izin', icon: FileCheck2, highlight: true },
    { name: 'Absensi Santri', href: '/absensi', icon: CalendarCheck },
    { name: 'Hafalan Al-Qur\'an', href: '/hafalan', icon: BookMarked },
    { name: 'SPP / Keuangan', href: '/keuangan', icon: Receipt },
    { name: 'Kedisiplinan', href: '/kedisiplinan', icon: AlertTriangle },
    { name: 'Portal Wali Santri', href: '/portal-wali', icon: UserSquare2 },
    { name: 'Pengaturan & Backup', href: '/pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Mobile Only */}
          <div className="p-4 flex items-center justify-between border-b border-slate-800 lg:hidden">
            <span className="font-bold text-emerald-400 text-sm">Navigasi Utama</span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Menu Aplikasi
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Info Box */}
        <div className="p-4 border-t border-slate-800 m-3 rounded-2xl bg-slate-950/60 border-slate-800/80">
          <div className="flex items-center gap-2 mb-1 text-emerald-400 font-semibold text-xs">
            <GraduationCap className="w-4 h-4" />
            <span>SIPON - SANTRI HUB</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Aplikasi Manajemen Pondok Pesantren Terintegrasi (Vercel & PWA Ready).
          </p>
        </div>
      </aside>
    </>
  );
};
