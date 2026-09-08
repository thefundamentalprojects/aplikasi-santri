"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { SuratIzin, Santri, PesantrenConfig } from '@/lib/types';
import { ModalIzin } from '@/components/ModalIzin';
import { CetakSuratIzin } from '@/components/CetakSuratIzin';
import {
  FileCheck2,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Calendar
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SuratIzinPage() {
  const [izinList, setIzinList] = useState<SuratIzin[]>([]);
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [config, setConfig] = useState<PesantrenConfig>(db.getConfig());

  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Sedang Izin' | 'Sudah Kembali'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [printData, setPrintData] = useState<SuratIzin | null>(null);

  useEffect(() => {
    setIzinList(db.getIzinList());
    setSantriList(db.getSantriList());
    setConfig(db.getConfig());
  }, []);

  const handleSaveIzin = (newIzin: SuratIzin) => {
    const updated = db.addIzin(newIzin);
    setIzinList(updated);
    setShowModal(false);
    // Auto open preview printable
    setPrintData(newIzin);
  };

  const handleMarkReturned = (izinId: string) => {
    const list = db.getIzinList();
    const updated = list.map(i => {
      if (i.id === izinId) {
        return { ...i, status: 'Sudah Kembali' as const };
      }
      return i;
    });
    db.saveIzinList(updated);
    setIzinList(updated);
  };

  const filteredIzin = izinList.filter(i => {
    const matchesStatus = statusFilter === 'Semua' || i.status === statusFilter;
    const matchesQuery =
      i.namaSantri.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-teal-400" />
            Surat Izin Santri & Mold Cetak
          </h1>
          <p className="text-xs text-slate-400">
            Terbitkan surat izin keluar/pulang resmi dengan Kop Surat Pesantren & QR Code verifikasi
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-950 transition"
        >
          <Plus className="w-4 h-4" />
          Buat & Cetak Surat Izin
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('Semua')}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'Semua' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Surat
          </button>
          <button
            onClick={() => setStatusFilter('Sedang Izin')}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'Sedang Izin' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sedang Izin Pulang ({izinList.filter(i => i.status === 'Sedang Izin').length})
          </button>
          <button
            onClick={() => setStatusFilter('Sudah Kembali')}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition ${
              statusFilter === 'Sudah Kembali' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sudah Kembali ({izinList.filter(i => i.status === 'Sudah Kembali').length})
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari No. Surat / Nama / NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* List Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">No. Surat & Tanggal</th>
                <th className="p-3.5">Santri & NIS</th>
                <th className="p-3.5">Kategori & Alasan</th>
                <th className="p-3.5">Masa Berlaku Izin</th>
                <th className="p-3.5">Status Izin</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIzin.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Belum ada riwayat perizinan yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredIzin.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-white text-xs">{i.id}</div>
                      <div className="text-[10px] text-slate-400">{formatDate(i.createdAt.split('T')[0])}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{i.namaSantri}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIS: {i.nis} | {i.kamar}</div>
                    </td>

                    <td className="p-3.5 max-w-[200px]">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                        {i.kategori}
                      </span>
                      <div className="text-[11px] text-slate-300 truncate mt-1">{i.alasan}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-300">Keluar: {formatDate(i.tanggalKeluar)}</div>
                      <div className="text-rose-400 font-semibold mt-0.5">Batas Kembali: {formatDate(i.tanggalKembali)}</div>
                    </td>

                    <td className="p-3.5">
                      {i.status === 'Sedang Izin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          <Clock className="w-3 h-3" /> Sedang Izin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Sudah Kembali
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {i.status === 'Sedang Izin' && (
                          <button
                            onClick={() => handleMarkReturned(i.id)}
                            title="Tandai Sudah Kembali Ke Pesantren"
                            className="px-2.5 py-1 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60 rounded-lg text-[11px] font-semibold transition"
                          >
                            Tandai Kembali
                          </button>
                        )}

                        <button
                          onClick={() => setPrintData(i)}
                          className="flex items-center gap-1 px-3 py-1 bg-teal-950 hover:bg-teal-900 border border-teal-700 text-teal-300 rounded-lg text-[11px] font-bold transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Cetak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ModalIzin
          santriList={santriList}
          onSave={handleSaveIzin}
          onClose={() => setShowModal(false)}
        />
      )}

      {printData && (
        <CetakSuratIzin
          izin={printData}
          config={config}
          onClose={() => setPrintData(null)}
        />
      )}
    </div>
  );
}
