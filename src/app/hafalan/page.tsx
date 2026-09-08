"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { HafalanRecord, Santri } from '@/lib/types';
import { BookMarked, Plus, Award, CheckCircle2, User, Save, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function HafalanPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [hafalanList, setHafalanList] = useState<HafalanRecord[]>([]);

  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  const [selectedSantriId, setSelectedSantriId] = useState(activeSantri[0]?.id || '');
  const [juz, setJuz] = useState(1);
  const [surah, setSurah] = useState("Al-Baqarah");
  const [ayatAwal, setAyatAwal] = useState(1);
  const [ayatAkhir, setAyatAkhir] = useState(25);
  const [predikat, setPredikat] = useState<HafalanRecord['predikat']>("Mumtaz (Sangat Baik)");
  const [ustadz, setUstadz] = useState("Ust. M. Ridwan");

  useEffect(() => {
    const list = db.getSantriList();
    setSantriList(list);
    setHafalanList(db.getHafalanList());
    if (list.length > 0) setSelectedSantriId(list[0].id);
  }, []);

  const handleAddHafalan = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSantri = activeSantri.find(s => s.id === selectedSantriId) || activeSantri[0];
    if (!targetSantri) return;

    const newRecord: HafalanRecord = {
      id: `HAF-${Date.now()}`,
      santriId: targetSantri.id,
      namaSantri: targetSantri.nama,
      tanggal: new Date().toISOString().split('T')[0],
      juz: Number(juz),
      surah,
      ayatAwal: Number(ayatAwal),
      ayatAkhir: Number(ayatAkhir),
      predikat,
      ustadz
    };

    const updated = db.addHafalan(newRecord);
    setHafalanList(updated);
    alert(`Progress Hafalan ${targetSantri.nama} berhasil dicatat!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BookMarked className="w-7 h-7 text-emerald-400" />
          Progress Setoran Hafalan Al-Qur'an & Kitab
        </h1>
        <p className="text-xs text-slate-400">
          Catatan mutaba'ah ziyadah & muraja'ah hafalan Al-Qur'an santri
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Input Setoran */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Input Setoran Hafalan
            </h3>

            <form onSubmit={handleAddHafalan} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pilih Santri *</label>
                <select
                  value={selectedSantriId}
                  onChange={(e) => setSelectedSantriId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  {activeSantri.map(s => (
                    <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Juz Ke- *</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={juz}
                    onChange={(e) => setJuz(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Surah *</label>
                  <input
                    type="text"
                    value={surah}
                    onChange={(e) => setSurah(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Ayat Awal</label>
                  <input
                    type="number"
                    value={ayatAwal}
                    onChange={(e) => setAyatAwal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Ayat Akhir</label>
                  <input
                    type="number"
                    value={ayatAkhir}
                    onChange={(e) => setAyatAkhir(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Predikat Kelancaran *</label>
                <select
                  value={predikat}
                  onChange={(e) => setPredikat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="Mumtaz (Sangat Baik)">Mumtaz (Sangat Baik)</option>
                  <option value="Jayyid (Baik)">Jayyid (Baik)</option>
                  <option value="Maqbul (Cukup)">Maqbul (Cukup)</option>
                  <option value="Murajaah Ulang">Murajaah Ulang</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ustadz Penyimak *</label>
                <input
                  type="text"
                  value={ustadz}
                  onChange={(e) => setUstadz(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" /> Simpan Catatan Setoran
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Riwayat Setoran */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 font-bold text-xs text-slate-200">
              Riwayat Setoran Hafalan Terakhir
            </div>

            <div className="divide-y divide-slate-800">
              {hafalanList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Belum ada catatan setoran hafalan.
                </div>
              ) : (
                hafalanList.map((record) => (
                  <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        {record.namaSantri}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Juz {record.juz}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium">
                        Surah {record.surah} (Ayat {record.ayatAwal} - {record.ayatAkhir})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Disimak oleh: <span className="text-slate-200 font-semibold">{record.ustadz}</span> • Tanggal: {formatDate(record.tanggal)}
                      </div>
                    </div>

                    <div>
                      <span className="px-3 py-1 bg-teal-950 text-teal-300 border border-teal-800 rounded-xl font-bold text-xs flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {record.predikat}
                      </span>
                    </div>
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
