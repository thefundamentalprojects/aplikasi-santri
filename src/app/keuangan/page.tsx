"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { KeuanganRecord } from '@/lib/types';
import { Receipt, CheckCircle2, Clock, Search, DollarSign, Wallet } from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';

export default function KeuanganPage() {
  const [keuanganList, setKeuanganList] = useState<KeuanganRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Lunas' | 'Belum Lunas'>('Semua');

  useEffect(() => {
    setKeuanganList(db.getKeuanganList());
  }, []);

  const handleToggleStatus = (id: string) => {
    const updated = db.toggleBayarKeuangan(id);
    setKeuanganList(updated);
  };

  const totalLunas = keuanganList.filter(k => k.status === 'Lunas').reduce((sum, k) => sum + k.jumlah, 0);
  const totalBelumLunas = keuanganList.filter(k => k.status === 'Belum Lunas').reduce((sum, k) => sum + k.jumlah, 0);

  const filteredList = keuanganList.filter(k => {
    const matchesStatus = statusFilter === 'Semua' || k.status === statusFilter;
    const matchesQuery = k.namaSantri.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Receipt className="w-7 h-7 text-emerald-400" />
          Keuangan & SPP Syahriah Santri
        </h1>
        <p className="text-xs text-slate-400">
          Pencatatan iuran syahriah bulanan, status lunas, dan rekapitulasi pembayaran
        </p>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Terbayar (Lunas)</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
              {formatRupiah(totalLunas)}
            </h3>
            <p className="text-[11px] text-emerald-500 font-medium mt-1">
              {keuanganList.filter(k => k.status === 'Lunas').length} Santri Sudah Lunas
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Tunggakan (Belum Lunas)</p>
            <h3 className="text-2xl font-extrabold text-rose-400 mt-1">
              {formatRupiah(totalBelumLunas)}
            </h3>
            <p className="text-[11px] text-rose-400 font-medium mt-1">
              {keuanganList.filter(k => k.status === 'Belum Lunas').length} Santri Belum Lunas
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('Semua')}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'Semua' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Data
          </button>
          <button
            onClick={() => setStatusFilter('Lunas')}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'Lunas' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lunas
          </button>
          <button
            onClick={() => setStatusFilter('Belum Lunas')}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'Belum Lunas' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Belum Lunas
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Nama Santri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Nama Santri</th>
                <th className="p-3.5">Bulan Syahriah</th>
                <th className="p-3.5">Nominal Iuran</th>
                <th className="p-3.5">Status Pembayaran</th>
                <th className="p-3.5">Tanggal Bayar</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredList.map((k) => (
                <tr key={k.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-bold text-white text-sm">
                    {k.namaSantri}
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">
                    {k.bulan}
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">
                    {formatRupiah(k.jumlah)}
                  </td>
                  <td className="p-3.5">
                    {k.status === 'Lunas' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        LUNAS
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        BELUM LUNAS
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {k.tanggalBayar ? formatDate(k.tanggalBayar) : '-'}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleToggleStatus(k.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                        k.status === 'Lunas'
                          ? 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                          : 'bg-emerald-600 text-white border-emerald-500 shadow'
                      }`}
                    >
                      {k.status === 'Lunas' ? 'Batalkan Lunas' : 'Tandai LUNAS'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
