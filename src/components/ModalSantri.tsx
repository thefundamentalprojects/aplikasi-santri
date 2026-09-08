"use client";

import React, { useState } from 'react';
import { Santri, StatusSantri, GenderType } from '@/lib/types';
import { X, Save, User, GraduationCap, Building2, Phone, Home, CreditCard, FileText } from 'lucide-react';

interface ModalSantriProps {
  initialData?: Santri | null;
  onSave: (santri: Santri) => void;
  onClose: () => void;
}

export const ModalSantri: React.FC<ModalSantriProps> = ({ initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState<Santri>({
    id: initialData?.id || `S-${Date.now().toString().slice(-4)}`,
    nis: initialData?.nis || `${new Date().getFullYear()}.${(Math.floor(Math.random() * 90) + 10)}.${Math.floor(Math.random() * 900) + 100}`,
    noKK: initialData?.noKK || '',
    nik: initialData?.nik || '',
    nama: initialData?.nama || '',
    gender: initialData?.gender || 'L',
    tempatLahir: initialData?.tempatLahir || '',
    tanggalLahir: initialData?.tanggalLahir || '',
    alamat: initialData?.alamat || '',
    rtRw: initialData?.rtRw || '',
    desaKelurahan: initialData?.desaKelurahan || '',
    kecamatan: initialData?.kecamatan || '',
    kabupatenKota: initialData?.kabupatenKota || '',
    provinsi: initialData?.provinsi || '',
    kodePos: initialData?.kodePos || '',
    kamar: initialData?.kamar || 'Al-Farabi 01',
    kelas: initialData?.kelas || '1 Aliyah',
    namaWali: initialData?.namaWali || '',
    hpWali: initialData?.hpWali || '',
    namaAyah: initialData?.namaAyah || '',
    pekerjaanAyah: initialData?.pekerjaanAyah || '',
    namaIbu: initialData?.namaIbu || '',
    pekerjaanIbu: initialData?.pekerjaanIbu || '',
    anakKe: initialData?.anakKe || 1,
    jumlahBersaudara: initialData?.jumlahBersaudara || 1,
    status: initialData?.status || 'Aktif',
    tahunMasuk: initialData?.tahunMasuk || new Date().getFullYear(),
    tahunAlumni: initialData?.tahunAlumni || undefined,
    catatan: initialData?.catatan || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nis) {
      alert("Mohon isi Nama Lengkap dan NIS Santri.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-slate-100 text-base">
              {initialData ? 'Edit Data Santri & Kartu Keluarga' : 'Input Data Santri & Format KK Lengkap'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-sm max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: IDENTITAS SANTRI PESANTREN */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Identitas Santri Pesantren
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  NIS (Nomor Induk Santri) *
                </label>
                <input
                  type="text"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Status Santri *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as StatusSantri;
                    setFormData({
                      ...formData,
                      status: newStatus,
                      tahunAlumni: newStatus === 'Alumni' ? new Date().getFullYear() : undefined
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Aktif">Santri Aktif</option>
                  <option value="Alumni">Santri Alumni (Lulus)</option>
                  <option value="Mutasi">Mutasi / Pindah</option>
                  <option value="Skorsing">Skorsing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tahun Masuk
                </label>
                <input
                  type="number"
                  value={formData.tahunMasuk}
                  onChange={(e) => setFormData({ ...formData, tahunMasuk: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Lengkap Santri *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Rayhan Al-Fatih"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="L">Laki-Laki (Bani)</option>
                  <option value="P">Perempuan (Banat)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Asrama / Kamar
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Al-Farabi 01"
                  value={formData.kamar}
                  onChange={(e) => setFormData({ ...formData, kamar: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Kelas Diniyah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 3 Aliyah Tahfizh"
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: DOKUMEN KEPENDUDUKAN (FORMAT KK & NIK) */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> 2. Dokumen Kependudukan (KK & NIK)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">
                  No. Kartu Keluarga (No. KK) [16 Digit]
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 3312011204060001"
                  value={formData.noKK || ''}
                  onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-teal-300 font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">
                  NIK Santri (Sesuai KK) [16 Digit]
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 3312011204060002"
                  value={formData.nik || ''}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-teal-300 font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Yogyakarta"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Anak Ke- ... dari Bersaudara
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={1}
                    value={formData.anakKe || 1}
                    onChange={(e) => setFormData({ ...formData, anakKe: parseInt(e.target.value) || 1 })}
                    className="w-1/2 px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                  <span className="text-slate-500">dari</span>
                  <input
                    type="number"
                    min={1}
                    value={formData.jumlahBersaudara || 1}
                    onChange={(e) => setFormData({ ...formData, jumlahBersaudara: parseInt(e.target.value) || 1 })}
                    className="w-1/2 px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: DATA ORANG TUA KANDUNG & WALI */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <Home className="w-4 h-4" /> 3. Data Orang Tua Kandung & Wali
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Ayah Kandung
                </label>
                <input
                  type="text"
                  placeholder="Nama Ayah Sesuai KK"
                  value={formData.namaAyah || ''}
                  onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Pekerjaan Ayah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PNS / Wiraswasta / Petani"
                  value={formData.pekerjaanAyah || ''}
                  onChange={(e) => setFormData({ ...formData, pekerjaanAyah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Ibu Kandung
                </label>
                <input
                  type="text"
                  placeholder="Nama Ibu Sesuai KK"
                  value={formData.namaIbu || ''}
                  onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Pekerjaan Ibu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ibu Rumah Tangga / Guru"
                  value={formData.pekerjaanIbu || ''}
                  onChange={(e) => setFormData({ ...formData, pekerjaanIbu: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Wali Santri (Penanggung Jawab)
                </label>
                <input
                  type="text"
                  placeholder="Nama Penanggung Jawab"
                  value={formData.namaWali}
                  onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  No. HP / WhatsApp Wali *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.hpWali}
                  onChange={(e) => setFormData({ ...formData, hpWali: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: ALAMAT LENGKAP KK */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> 4. Alamat Lengkap Sesuai KK
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Jalan / Dusun / Komplek
              </label>
              <input
                type="text"
                placeholder="Contoh: Jl. Kaliurang Km 10, Candi Karang"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">RT / RW</label>
                <input
                  type="text"
                  placeholder="RT 03 / RW 12"
                  value={formData.rtRw || ''}
                  onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Desa / Kelurahan</label>
                <input
                  type="text"
                  placeholder="Sardonoharjo"
                  value={formData.desaKelurahan || ''}
                  onChange={(e) => setFormData({ ...formData, desaKelurahan: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Kecamatan</label>
                <input
                  type="text"
                  placeholder="Ngaglik"
                  value={formData.kecamatan || ''}
                  onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Kabupaten / Kota</label>
                <input
                  type="text"
                  placeholder="Sleman"
                  value={formData.kabupatenKota || ''}
                  onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Provinsi</label>
                <input
                  type="text"
                  placeholder="D.I. Yogyakarta"
                  value={formData.provinsi || ''}
                  onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kode Pos</label>
                <input
                  type="text"
                  placeholder="55581"
                  value={formData.kodePos || ''}
                  onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: CATATAN TAMBAHAN */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Catatan Khusus / Prestasi / Riwayat Medis
            </label>
            <textarea
              rows={2}
              placeholder="Catatan khusus seputar santri..."
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900 py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition"
            >
              <Save className="w-4 h-4" />
              Simpan Data Santri (Format KK Complete)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
