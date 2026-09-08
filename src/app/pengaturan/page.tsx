"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { PesantrenConfig } from '@/lib/types';
import { Settings, Save, Download, Upload, RotateCcw, Building2, Check, AlertTriangle, KeyRound, Lock } from 'lucide-react';

export default function PengaturanPage() {
  const [config, setConfig] = useState<PesantrenConfig>(db.getConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // State Ubah PIN Admin
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinMsg, setPinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setConfig(db.getConfig());
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(null);
    const activePin = auth.getAdminPin();

    if (currentPinInput !== activePin) {
      setPinMsg({ type: 'error', text: 'Password / PIN Lama tidak sesuai.' });
      return;
    }
    if (!newPinInput || newPinInput.length < 4) {
      setPinMsg({ type: 'error', text: 'PIN Baru minimal 4 karakter.' });
      return;
    }

    auth.setAdminPin(newPinInput);
    setPinMsg({ type: 'success', text: 'PIN Admin Operator berhasil diperbarui!' });
    setCurrentPinInput('');
    setNewPinInput('');
  };

  const handleExport = () => {
    const jsonStr = db.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_alazhar_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = db.importDatabaseJSON(content);
      if (success) {
        setImportStatus("Berhasil memulihkan database dari file JSON!");
        setConfig(db.getConfig());
      } else {
        setImportStatus("Gagal membaca file JSON. Format tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan seluruh data ke data awal (semua perubahan akan direset)?")) {
      db.resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-emerald-400" />
          Pengaturan Pesantren, Keamanan & Database
        </h1>
        <p className="text-xs text-slate-400">
          Ubah nama pondok pesantren, identitas Kop Surat Izin, PIN Operator, serta backup & restore database JSON
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> Pengaturan profil pesantren berhasil disimpan!
        </div>
      )}

      {/* Profil Pesantren Form */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" /> Identitas Lembaga & Kop Surat
        </h3>

        <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Nama Pondok Pesantren *</label>
              <input
                type="text"
                value={config.namaPondok}
                onChange={(e) => setConfig({ ...config, namaPondok: e.target.value })}
                required
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Sub-Judul / Slogan</label>
              <input
                type="text"
                value={config.subJudul}
                onChange={(e) => setConfig({ ...config, subJudul: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Pengasuh / Pimpinan Utama</label>
              <input
                type="text"
                value={config.pengasuh}
                onChange={(e) => setConfig({ ...config, pengasuh: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">No. Telepon / WhatsApp Official</label>
              <input
                type="text"
                value={config.telepon}
                onChange={(e) => setConfig({ ...config, telepon: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Alamat Lengkap Pesantren (Muncul di Kop Surat Izin)</label>
            <textarea
              rows={2}
              value={config.alamat}
              onChange={(e) => setConfig({ ...config, alamat: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950 transition"
            >
              <Save className="w-4 h-4" /> Simpan Identitas Pesantren
            </button>
          </div>
        </form>
      </div>

      {/* KEAMANAN AKUN ADMIN OPERATOR (UBAH PIN) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" /> Keamanan Akun Operator (Ubah Password / PIN)
        </h3>
        <p className="text-xs text-slate-400">
          Password default saat ini adalah <span className="text-emerald-400 font-mono font-bold">admin123</span>. Anda dapat menggantinya sesuai keinginan.
        </p>

        {pinMsg && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${
            pinMsg.type === 'success' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-950 border border-rose-800 text-rose-300'
          }`}>
            {pinMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePin} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Password / PIN Lama *</label>
            <input
              type="password"
              placeholder="Password saat ini..."
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Password / PIN Baru *</label>
            <input
              type="password"
              placeholder="Password baru..."
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-950 transition"
          >
            <Lock className="w-4 h-4" /> Perbarui PIN Operator
          </button>
        </form>
      </div>

      {/* Database Management & Backup */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Download className="w-4 h-4 text-teal-400" /> Backup & Import Data Database JSON
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Anda dapat mengeksport seluruh database santri, surat izin, absensi, dan hafalan ke file JSON. File backup bisa di-import kembali kapan saja atau dipindahkan ke komputer/HP lain.
        </p>

        {importStatus && (
          <div className="p-3 bg-teal-950 border border-teal-800 rounded-xl text-teal-300 text-xs font-semibold">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-950 transition"
          >
            <Download className="w-4 h-4" /> Download Backup JSON Database
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition">
            <Upload className="w-4 h-4 text-emerald-400" /> Import File JSON Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone Reset */}
      <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" /> Reset Database ke Set Bawaan
        </div>
        <p className="text-xs text-slate-400">
          Tindakan ini akan mengembalikan semua data santri dan transaksi perizinan ke contoh awal.
        </p>
        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-950"
        >
          <RotateCcw className="w-4 h-4" /> Reset Data ke Default
        </button>
      </div>
    </div>
  );
}
