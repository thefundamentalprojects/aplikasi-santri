"use client";

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { Santri, SuratIzin, HafalanRecord, KeuanganRecord, AbsensiRecord } from '@/lib/types';
import { Search, UserCheck, BookOpen, BookMarked, FileCheck2, CalendarCheck, Receipt, GraduationCap, CheckCircle2 } from 'lucide-react';
import { formatDate, formatRupiah } from '@/lib/utils';

export default function PortalWaliPage() {
  const [nisQuery, setNisQuery] = useState('');
  const [searchedSantri, setSearchedSantri] = useState<Santri | null>(null);
  const [santriIzin, setSantriIzin] = useState<SuratIzin[]>([]);
  const [santriHafalan, setSantriHafalan] = useState<HafalanRecord[]>([]);
  const [santriKeuangan, setSantriKeuangan] = useState<KeuanganRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisQuery.trim()) return;

    const allSantri = db.getSantriList();
    const found = allSantri.find(
      s => s.nis.toLowerCase() === nisQuery.trim().toLowerCase() ||
           s.nama.toLowerCase().includes(nisQuery.trim().toLowerCase())
    );

    setSearchedSantri(found || null);
    setHasSearched(true);

    if (found) {
      setSantriIzin(db.getIzinList().filter(i => i.santriId === found.id));
      setSantriHafalan(db.getHafalanList().filter(h => h.santriId === found.id));
      setSantriKeuangan(db.getKeuanganList().filter(k => k.santriId === found.id));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-950 border border-teal-800 rounded-full text-xs font-semibold text-teal-300">
          <UserCheck className="w-3.5 h-3.5" /> Portal Pengecekan Mandiri Wali Santri
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Cek Perkembangan & Status Santri
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Masukkan Nomor Induk Santri (NIS) atau nama putra/putri Anda untuk melihat riwayat izin, hafalan, dan keuangan.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Masukkan NIS Santri (Contoh: 2024.01.001) atau Nama..."
              value={nisQuery}
              onChange={(e) => setNisQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-950 transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Cari Data Santri
          </button>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && !searchedSantri && (
        <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          Data santri dengan kata kunci "<span className="text-white font-bold">{nisQuery}</span>" tidak ditemukan. Mohon periksa kembali NIS Anda.
        </div>
      )}

      {searchedSantri && (
        <div className="space-y-6">
          {/* Card Profil Santri */}
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{searchedSantri.nama}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  searchedSantri.status === 'Aktif'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {searchedSantri.status === 'Aktif' ? 'Santri Aktif' : `Alumni (${searchedSantri.tahunAlumni})`}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                NIS: <span className="text-emerald-400 font-bold">{searchedSantri.nis}</span> | Gender: {searchedSantri.gender === 'L' ? 'Bani (L)' : 'Banat (P)'}
              </p>
              <p className="text-xs text-slate-300">
                Kamar: <span className="font-semibold text-white">{searchedSantri.kamar}</span> | Kelas: <span className="font-semibold text-white">{searchedSantri.kelas}</span>
              </p>
              <p className="text-xs text-slate-400">
                Nama Wali: <span className="text-slate-200">{searchedSantri.namaWali}</span> ({searchedSantri.hpWali})
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-extrabold text-xl flex items-center justify-center">
              {searchedSantri.nama.charAt(0)}
            </div>
          </div>

          {/* Section 1: Progress Hafalan */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-emerald-400" />
              Progress Setoran Hafalan Al-Qur'an
            </h3>

            {santriHafalan.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Belum ada riwayat setoran hafalan.</p>
            ) : (
              <div className="space-y-2">
                {santriHafalan.map(h => (
                  <div key={h.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">Juz {h.juz} - Surah {h.surah}</span> (Ayat {h.ayatAwal}-{h.ayatAkhir})
                      <div className="text-[10px] text-slate-400">Penyimak: {h.ustadz} • {formatDate(h.tanggal)}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                      {h.predikat}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Riwayat Perizinan */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              Riwayat Surat Izin Pulang / Berobat
            </h3>

            {santriIzin.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Tidak ada catatan perizinan keluar.</p>
            ) : (
              <div className="space-y-2">
                {santriIzin.map(i => (
                  <div key={i.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">Kategori: {i.kategori}</span> ({i.alasan})
                      <div className="text-[10px] text-slate-400">Masa Izin: {formatDate(i.tanggalKeluar)} s/d {formatDate(i.tanggalKembali)}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      i.status === 'Sedang Izin'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {i.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Status Keuangan Syahriah */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              Status Pembayaran Syahriah (SPP)
            </h3>

            {santriKeuangan.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Belum ada tagihan syahriah tercatat.</p>
            ) : (
              <div className="space-y-2">
                {santriKeuangan.map(k => (
                  <div key={k.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{k.bulan}</span>
                      <div className="text-[10px] text-slate-400">Nominal: {formatRupiah(k.jumlah)}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      k.status === 'Lunas'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {k.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
