"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { PelanggaranRecord, Santri } from '@/lib/types';
import { AlertTriangle, Plus, ShieldAlert, CheckCircle2, Save } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function KedisiplinanPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [pelanggaranList, setPelanggaranList] = useState<PelanggaranRecord[]>([]);

  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  const [selectedSantriId, setSelectedSantriId] = useState(activeSantri[0]?.id || '');
  const [jenisPelanggaran, setJenisPelanggaran] = useState('');
  const [tingkat, setTingkat] = useState<'Ringan' | 'Sedang' | 'Berat'>('Ringan');
  const [poin, setPoin] = useState(5);
  const [hukuman, setHukuman] = useState('');

  useEffect(() => {
    const list = db.getSantriList();
    setSantriList(list);
    setPelanggaranList(db.getPelanggaranList());
    if (list.length > 0) setSelectedSantriId(list[0].id);
  }, []);

  const handleAddPelanggaran = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSantri = activeSantri.find(s => s.id === selectedSantriId) || activeSantri[0];
    if (!targetSantri || !jenisPelanggaran) return;

    const newRecord: PelanggaranRecord = {
      id: `PLG-${Date.now()}`,
      santriId: targetSantri.id,
      namaSantri: targetSantri.nama,
      tanggal: new Date().toISOString().split('T')[0],
      jenisPelanggaran,
      tingkat,
      poin: Number(poin),
      hukuman: hukuman || 'Membaca Al-Qur\'an di Serambi Masjid',
      statusTazcir: 'Belum Dilaksanakan'
    };

    const updated = db.addPelanggaran(newRecord);
    setPelanggaranList(updated);
    setJenisPelanggaran('');
    setHukuman('');
  };

  const handleToggleTazcir = (id: string) => {
    const list = db.getPelanggaranList();
    const updated = list.map(p => {
      if (p.id === id) {
        return {
          ...p,
          statusTazcir: p.statusTazcir === 'Belum Dilaksanakan' ? ('Sudah Selesai' as const) : ('Belum Dilaksanakan' as const)
        };
      }
      return p;
    });
    db.savePelanggaranList(updated);
    setPelanggaranList(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-amber-400" />
          Kedisiplinan & Catatan Ta'zir Pelanggaran
        </h1>
        <p className="text-xs text-slate-400">
          Catatan kedisiplinan, poin pelanggaran santri, dan status penyelesaian ta'zir
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Form Input */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" /> Catat Pelanggaran Santri
            </h3>

            <form onSubmit={handleAddPelanggaran} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pilih Santri *</label>
                <select
                  value={selectedSantriId}
                  onChange={(e) => setSelectedSantriId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  {activeSantri.map(s => (
                    <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jenis Pelanggaran *</label>
                <input
                  type="text"
                  placeholder="Contoh: Terlambat Shalat Subuh / Keluar tanpa Izin"
                  value={jenisPelanggaran}
                  onChange={(e) => setJenisPelanggaran(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tingkat *</label>
                  <select
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Ringan">Ringan (1 - 10 Poin)</option>
                    <option value="Sedang">Sedang (11 - 25 Poin)</option>
                    <option value="Berat">Berat (&gt; 25 Poin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Jumlah Poin *</label>
                  <input
                    type="number"
                    value={poin}
                    onChange={(e) => setPoin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hukuman / Sanksi Ta'zir</label>
                <input
                  type="text"
                  placeholder="Contoh: Bersihkan Masjid / Membaca Al-Qur'an 1 Juz"
                  value={hukuman}
                  onChange={(e) => setHukuman(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 font-bold text-white rounded-xl shadow-lg shadow-amber-950 transition flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" /> Simpan Catatan Pelanggaran
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: List Pelanggaran */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 font-bold text-xs text-slate-200">
              Daftar Pelanggaran Santri
            </div>

            <div className="divide-y divide-slate-800">
              {pelanggaranList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Tidak ada catatan pelanggaran santri.
                </div>
              ) : (
                pelanggaranList.map((p) => (
                  <div key={p.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        {p.namaSantri}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.tingkat === 'Ringan' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          p.tingkat === 'Sedang' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {p.tingkat} ({p.poin} Poin)
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium">{p.jenisPelanggaran}</div>
                      <div className="text-[11px] text-slate-400">
                        Ta'zir: <span className="text-slate-200 font-semibold">{p.hukuman}</span> • Tanggal: {formatDate(p.tanggal)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleTazcir(p.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        p.statusTazcir === 'Sudah Selesai'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
                      }`}
                    >
                      {p.statusTazcir === 'Sudah Selesai' ? 'Selesai Ta\'zir' : 'Belum Selesai'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
