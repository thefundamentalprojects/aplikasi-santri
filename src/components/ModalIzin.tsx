"use client";

import React, { useState } from 'react';
import { SuratIzin, Santri, KategoriIzin } from '@/lib/types';
import { X, FileCheck2, Calendar, UserCheck } from 'lucide-react';

interface ModalIzinProps {
  santriList: Santri[];
  onSave: (izin: SuratIzin) => void;
  onClose: () => void;
}

export const ModalIzin: React.FC<ModalIzinProps> = ({ santriList, onSave, onClose }) => {
  const activeSantri = santriList.filter(s => s.status === 'Aktif');

  const [selectedSantriId, setSelectedSantriId] = useState<string>(activeSantri[0]?.id || '');
  const selectedSantri = activeSantri.find(s => s.id === selectedSantriId) || activeSantri[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    kategori: 'Pulang' as KategoriIzin,
    alasan: '',
    tanggalKeluar: todayStr,
    tanggalKembali: threeDaysLater,
    penanggungJawab: 'Ust. M. Ridwan (Pengurus)',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) {
      alert("Tidak ada santri aktif yang dipilih.");
      return;
    }
    if (!formData.alasan) {
      alert("Mohon isi alasan perizinan.");
      return;
    }

    const newIzin: SuratIzin = {
      id: `IZN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      santriId: selectedSantri.id,
      nis: selectedSantri.nis,
      namaSantri: selectedSantri.nama,
      kamar: selectedSantri.kamar,
      kelas: selectedSantri.kelas,
      kategori: formData.kategori,
      alasan: formData.alasan,
      tanggalKeluar: formData.tanggalKeluar,
      tanggalKembali: formData.tanggalKembali,
      status: 'Sedang Izin',
      penanggungJawab: formData.penanggungJawab,
      createdAt: new Date().toISOString(),
    };

    onSave(newIzin);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-slate-100 text-base">Buat Surat Izin Santri Baru</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Pilih Santri */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Pilih Santri (Status Aktif) *
            </label>
            <select
              value={selectedSantriId}
              onChange={(e) => setSelectedSantriId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {activeSantri.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.nis}) - Kamar: {s.kamar}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori Izin & Penanggung Jawab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Kategori Perizinan *
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriIzin })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Pulang">Pulang Ke Rumah</option>
                <option value="Berobat">Berobat / Layanan Kesehatan</option>
                <option value="Keperluan Keluarga">Keperluan Keluarga</option>
                <option value="Tugas Pesantren">Tugas Khusus Pesantren</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Pengasuh / Penanggung Jawab *
              </label>
              <input
                type="text"
                value={formData.penanggungJawab}
                onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                required
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tanggal Keluar & Kembali */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tanggal Keluar / Berangkat *
              </label>
              <input
                type="date"
                value={formData.tanggalKeluar}
                onChange={(e) => setFormData({ ...formData, tanggalKeluar: e.target.value })}
                required
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">
                Tanggal Wajib Kembali *
              </label>
              <input
                type="date"
                value={formData.tanggalKembali}
                onChange={(e) => setFormData({ ...formData, tanggalKembali: e.target.value })}
                required
                className="w-full px-3.5 py-2 bg-slate-950 border border-rose-900/60 rounded-xl text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Alasan */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Alasan Keperluan Perizinan *
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Menghadiri acara hajatan keluarga besar di Magelang"
              value={formData.alasan}
              onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
              required
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition"
            >
              <FileCheck2 className="w-4 h-4" />
              Terbitkan & Cetak Surat Izin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
