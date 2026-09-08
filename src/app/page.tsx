"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Santri, SuratIzin, PesantrenConfig } from '@/lib/types';
import {
  Users,
  GraduationCap,
  FileCheck2,
  CalendarCheck,
  Plus,
  Printer,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Building2,
  AlertCircle
} from 'lucide-react';
import { ModalSantri } from '@/components/ModalSantri';
import { ModalIzin } from '@/components/ModalIzin';
import { CetakSuratIzin } from '@/components/CetakSuratIzin';
import { formatDate } from '@/lib/utils';

export default function Dashboard() {
  const [config, setConfig] = useState<PesantrenConfig>(db.getConfig());
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [izinList, setIzinList] = useState<SuratIzin[]>([]);
  
  // Modals
  const [showAddSantriModal, setShowAddSantriModal] = useState(false);
  const [showAddIzinModal, setShowAddIzinModal] = useState(false);
  const [printIzinData, setPrintIzinData] = useState<SuratIzin | null>(null);

  useEffect(() => {
    setSantriList(db.getSantriList());
    setIzinList(db.getIzinList());
    setConfig(db.getConfig());
  }, []);

  const activeSantriCount = santriList.filter(s => s.status === 'Aktif').length;
  const alumniSantriCount = santriList.filter(s => s.status === 'Alumni').length;
  const sedangIzinList = izinList.filter(i => i.status === 'Sedang Izin');
  const todayAbsensiCount = db.getAbsensiList().filter(a => a.status === 'Hadir').length;

  const handleSaveSantri = (newSantri: Santri) => {
    const updated = db.addSantri(newSantri);
    setSantriList(updated);
    setShowAddSantriModal(false);
  };

  const handleSaveIzin = (newIzin: SuratIzin) => {
    const updated = db.addIzin(newIzin);
    setIzinList(updated);
    setShowAddIzinModal(false);
    // Open preview printable automatically
    setPrintIzinData(newIzin);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Informasi Santri - Ready to Deploy Vercel & PWA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang di {config.namaPondok}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pengelolaan Data Santri, Cetak Surat Izin Resmi, Rekap Absensi, Progress Hafalan Al-Qur'an, dan Database Alumni terintegrasi.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddSantriModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition"
            >
              <Plus className="w-4 h-4" />
              Input Santri Baru
            </button>
            <button
              onClick={() => setShowAddIzinModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-900/40 transition"
            >
              <FileCheck2 className="w-4 h-4" />
              Cetak Surat Izin
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Santri Aktif */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-emerald-500/40 transition group">
          <div>
            <p className="text-xs font-semibold text-slate-400">Santri Aktif</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:text-emerald-400 transition">
              {activeSantriCount} <span className="text-xs text-slate-400 font-normal">Orang</span>
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Data Tersimpan Aman
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Santri Alumni */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-amber-500/40 transition group">
          <div>
            <p className="text-xs font-semibold text-slate-400">Santri Alumni (Lulus)</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:text-amber-400 transition">
              {alumniSantriCount} <span className="text-xs text-slate-400 font-normal">Alumni</span>
            </h3>
            <p className="text-[11px] text-amber-400 font-medium mt-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Pasca Santri
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Sedang Izin Pulang */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-teal-500/40 transition group">
          <div>
            <p className="text-xs font-semibold text-slate-400">Sedang Izin Pulang</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:text-teal-400 transition">
              {sedangIzinList.length} <span className="text-xs text-slate-400 font-normal">Santri</span>
            </h3>
            <p className="text-[11px] text-teal-400 font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Masa Izin Aktif
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Presensi Subuh/Harian */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-blue-500/40 transition group">
          <div>
            <p className="text-xs font-semibold text-slate-400">Hadir Presensi Hari Ini</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:text-blue-400 transition">
              {todayAbsensiCount} <span className="text-xs text-slate-400 font-normal">Hadir</span>
            </h3>
            <p className="text-[11px] text-blue-400 font-medium mt-1 flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5" /> Rekap Harian
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Santri Sedang Izin Pulang */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-teal-400" />
                  Daftar Santri Sedang Izin Pulang / Keluar
                </h3>
                <p className="text-xs text-slate-400">Santri yang memegang surat izin resmi aktif</p>
              </div>

              <Link
                href="/izin"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nama Santri & NIS</th>
                    <th className="p-3">Kamar</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Kembali Pada</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sedangIzinList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        Tidak ada santri yang sedang dalam masa izin saat ini.
                      </td>
                    </tr>
                  ) : (
                    sedangIzinList.map((izin) => (
                      <tr key={izin.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-semibold text-white">
                          <div>{izin.namaSantri}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{izin.nis}</div>
                        </td>
                        <td className="p-3">{izin.kamar}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                            {izin.kategori}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-rose-400">
                          {formatDate(izin.tanggalKembali)}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setPrintIzinData(izin)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-lg font-semibold text-[11px] transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Surat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Recent Data */}
        <div className="space-y-6">
          {/* Quick Menu Widget */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm">Fitur Utama Aplikasi</h3>

            <div className="space-y-2.5">
              <Link
                href="/santri"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-emerald-400">Input & Database Santri</h4>
                    <p className="text-[11px] text-slate-400">Kelola Data Aktif & Alumni</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </Link>

              <Link
                href="/izin"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-950 text-teal-400">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-teal-400">Cetak Surat Izin Resmi</h4>
                    <p className="text-[11px] text-slate-400">Template Kop Surat & QR Code</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400" />
              </Link>

              <Link
                href="/portal-wali"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-950 text-amber-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-amber-400">Portal Akses Wali Santri</h4>
                    <p className="text-[11px] text-slate-400">Pengecekan Mandiri Orang Tua</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </Link>
            </div>
          </div>

          {/* Info Card Vercel & PWA */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Siap Deploy Vercel & GitHub
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aplikasi ini 100% kompatibel dengan Vercel & GitHub, tanpa perlu setup server database rumit. Data tersimpan aman di browser dan dapat di-backup kapan saja dalam format JSON.
            </p>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      {showAddSantriModal && (
        <ModalSantri
          onSave={handleSaveSantri}
          onClose={() => setShowAddSantriModal(false)}
        />
      )}

      {showAddIzinModal && (
        <ModalIzin
          santriList={santriList}
          onSave={handleSaveIzin}
          onClose={() => setShowAddIzinModal(false)}
        />
      )}

      {printIzinData && (
        <CetakSuratIzin
          izin={printIzinData}
          config={config}
          onClose={() => setPrintIzinData(null)}
        />
      )}
    </div>
  );
}
