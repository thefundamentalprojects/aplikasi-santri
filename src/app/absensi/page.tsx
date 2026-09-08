"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { AbsensiRecord, Santri, StatusAbsensi } from '@/lib/types';
import { CalendarCheck, Save, Check, X, Clock, AlertTriangle, Users, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AbsensiPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [absensiHistory, setAbsensiHistory] = useState<AbsensiRecord[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];
  const [tanggal, setTanggal] = useState(todayStr);
  const [jenisKegiatan, setJenisKegiatan] = useState("Shalat Subuh Berjamaah & Sorogan");
  const [filterKamar, setFilterKamar] = useState<string>("All");

  // State untuk form absensi saat ini (Map: santriId -> statusAbsensi)
  const [attendanceState, setAttendanceState] = useState<Record<string, StatusAbsensi>>({});
  const [keteranganState, setKeteranganState] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const list = db.getSantriList().filter(s => s.status === 'Aktif');
    setSantriList(list);
    setAbsensiHistory(db.getAbsensiList());

    // Default set all to 'Hadir'
    const initialMap: Record<string, StatusAbsensi> = {};
    list.forEach(s => {
      initialMap[s.id] = 'Hadir';
    });
    setAttendanceState(initialMap);
  }, []);

  const kamarOptions = Array.from(new Set(santriList.map(s => s.kamar))).filter(Boolean);

  const handleStatusChange = (santriId: string, status: StatusAbsensi) => {
    setAttendanceState(prev => ({
      ...prev,
      [santriId]: status
    }));
  };

  const handleSaveAbsensi = () => {
    const activeSantri = santriList.filter(s => filterKamar === 'All' || s.kamar === filterKamar);
    
    const records: AbsensiRecord[] = activeSantri.map(s => ({
      id: `ABS-${Date.now()}-${s.id}`,
      tanggal,
      jenisKegiatan,
      santriId: s.id,
      namaSantri: s.nama,
      kamar: s.kamar,
      status: attendanceState[s.id] || 'Hadir',
      keterangan: keteranganState[s.id] || undefined
    }));

    const updated = db.addAbsensiBatch(records);
    setAbsensiHistory(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const displayedSantri = santriList.filter(s => filterKamar === 'All' || s.kamar === filterKamar);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-blue-400" />
            Absensi & Presensi Santri Harian
          </h1>
          <p className="text-xs text-slate-400">
            Pencatatan presensi shalat jamaah, sorogan kitab, dan kegiatan harian kamar santri
          </p>
        </div>

        <button
          onClick={handleSaveAbsensi}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950 transition"
        >
          <Save className="w-4 h-4" />
          Simpan Presensi Hari Ini
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> Data presensi berhasil disimpan ke database!
        </div>
      )}

      {/* Control Bar */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Tanggal Presensi</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Jenis Kegiatan / Sesi</label>
          <select
            value={jenisKegiatan}
            onChange={(e) => setJenisKegiatan(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="Shalat Subuh Berjamaah & Sorogan">Shalat Subuh Berjamaah & Sorogan</option>
            <option value="Shalat Maghrib-Isya & Bandongan">Shalat Maghrib-Isya & Bandongan</option>
            <option value="Pengajian KBM Diniyah Pagi">Pengajian KBM Diniyah Pagi</option>
            <option value="Absensi Malam (Keberadaan Kamar)">Absensi Malam (Keberadaan Kamar)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Filter Komplek / Kamar</label>
          <select
            value={filterKamar}
            onChange={(e) => setFilterKamar(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="All">Semua Kamar Santri</option>
            {kamarOptions.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Santri Checklist Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-200">
            Daftar Presensi ({displayedSantri.length} Santri Aktif)
          </span>

          {/* Quick All Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const updated = { ...attendanceState };
                displayedSantri.forEach(s => updated[s.id] = 'Hadir');
                setAttendanceState(updated);
              }}
              className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-[10px] font-bold"
            >
              Set Semua HADIR
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">NIS & Nama Santri</th>
                <th className="p-3.5">Kamar</th>
                <th className="p-3.5">Status Kehadiran</th>
                <th className="p-3.5">Keterangan Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedSantri.map((santri) => {
                const currentStatus = attendanceState[santri.id] || 'Hadir';
                return (
                  <tr key={santri.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white">
                      <div>{santri.nama}</div>
                      <div className="text-[10px] text-slate-400 font-mono">NIS: {santri.nis}</div>
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">
                      {santri.kamar}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        {/* Hadir */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(santri.id, 'Hadir')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs border transition ${
                            currentStatus === 'Hadir'
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          Hadir
                        </button>

                        {/* Izin */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(santri.id, 'Izin')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs border transition ${
                            currentStatus === 'Izin'
                              ? 'bg-teal-600 text-white border-teal-500 shadow'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          Izin
                        </button>

                        {/* Sakit */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(santri.id, 'Sakit')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs border transition ${
                            currentStatus === 'Sakit'
                              ? 'bg-amber-600 text-white border-amber-500 shadow'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          Sakit
                        </button>

                        {/* Alpa */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(santri.id, 'Alpa')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs border transition ${
                            currentStatus === 'Alpa'
                              ? 'bg-rose-600 text-white border-rose-500 shadow'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          Alpa
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <input
                        type="text"
                        placeholder="Catatan alasan jika Izin/Sakit/Alpa..."
                        value={keteranganState[santri.id] || ''}
                        onChange={(e) => setKeteranganState({ ...keteranganState, [santri.id]: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
