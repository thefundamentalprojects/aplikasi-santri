"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Santri, StatusSantri } from '@/lib/types';
import { ModalSantri } from '@/components/ModalSantri';
import {
  Users,
  Plus,
  Search,
  Filter,
  GraduationCap,
  Edit,
  Trash2,
  Download,
  Phone,
  UserCheck,
  CheckCircle,
  Building2,
  Calendar,
  CreditCard,
  Eye,
  X,
  FileText,
  Home
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DataSantriPage() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [activeTab, setActiveTab] = useState<StatusSantri>('Aktif');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'L' | 'P'>('All');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [viewKkSantri, setViewKkSantri] = useState<Santri | null>(null);

  useEffect(() => {
    setSantriList(db.getSantriList());
  }, []);

  const handleSaveSantri = (santri: Santri) => {
    if (editingSantri) {
      const updated = db.updateSantri(santri);
      setSantriList(updated);
    } else {
      const updated = db.addSantri(santri);
      setSantriList(updated);
    }
    setShowModal(false);
    setEditingSantri(null);
  };

  const handleDeleteSantri = (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data santri "${nama}"?`)) {
      const updated = db.deleteSantri(id);
      setSantriList(updated);
    }
  };

  const handleToggleAlumniStatus = (santri: Santri) => {
    const isNowAlumni = santri.status === 'Aktif';
    const newStatus: StatusSantri = isNowAlumni ? 'Alumni' : 'Aktif';
    const updatedSantri: Santri = {
      ...santri,
      status: newStatus,
      tahunAlumni: isNowAlumni ? new Date().getFullYear() : undefined
    };
    const updatedList = db.updateSantri(updatedSantri);
    setSantriList(updatedList);
  };

  // Filtered List
  const filteredSantri = santriList.filter((s) => {
    const matchesTab = s.status === activeTab;
    const matchesQuery =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.noKK && s.noKK.includes(searchQuery)) ||
      (s.nik && s.nik.includes(searchQuery)) ||
      s.kamar.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'All' || s.gender === genderFilter;

    return matchesTab && matchesQuery && matchesGender;
  });

  const exportToCSV = () => {
    const headers = [
      "NIS", "No KK", "NIK Santri", "Nama Lengkap", "Gender", "Tempat Lahir", "Tanggal Lahir",
      "Nama Ayah", "Pekerjaan Ayah", "Nama Ibu", "Pekerjaan Ibu",
      "Alamat", "RT/RW", "Desa/Kelurahan", "Kecamatan", "Kabupaten/Kota", "Provinsi", "Kode Pos",
      "Kamar", "Kelas Diniyah", "Nama Wali", "No HP Wali", "Status", "Tahun Masuk"
    ];

    const rows = filteredSantri.map(s => [
      `"${s.nis}"`,
      `"${s.noKK || '-'}"`,
      `"${s.nik || '-'}"`,
      `"${s.nama}"`,
      `"${s.gender}"`,
      `"${s.tempatLahir}"`,
      `"${s.tanggalLahir}"`,
      `"${s.namaAyah || '-'}"`,
      `"${s.pekerjaanAyah || '-'}"`,
      `"${s.namaIbu || '-'}"`,
      `"${s.pekerjaanIbu || '-'}"`,
      `"${s.alamat}"`,
      `"${s.rtRw || '-'}"`,
      `"${s.desaKelurahan || '-'}"`,
      `"${s.kecamatan || '-'}"`,
      `"${s.kabupatenKota || '-'}"`,
      `"${s.provinsi || '-'}"`,
      `"${s.kodePos || '-'}"`,
      `"${s.kamar}"`,
      `"${s.kelas}"`,
      `"${s.namaWali}"`,
      `"${s.hpWali}"`,
      `"${s.status}"`,
      s.tahunMasuk
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_santri_kk_lengkap_${activeTab.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-400" />
            Manajemen Data Santri & Kartu Keluarga (KK)
          </h1>
          <p className="text-xs text-slate-400">
            Database lengkap santri aktif, alumni kelulusan, No. KK, NIK, identitas orang tua, dan alamat kependudukan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export CSV Format KK
          </button>
          <button
            onClick={() => {
              setEditingSantri(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Santri & Format KK
          </button>
        </div>
      </div>

      {/* Filter Tabs (Santri Aktif vs Alumni) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('Aktif')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition ${
              activeTab === 'Aktif'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Santri Aktif ({santriList.filter(s => s.status === 'Aktif').length})
          </button>

          <button
            onClick={() => setActiveTab('Alumni')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition ${
              activeTab === 'Alumni'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Santri Alumni ({santriList.filter(s => s.status === 'Alumni').length})
          </button>

          <button
            onClick={() => setActiveTab('Mutasi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition ${
              activeTab === 'Mutasi'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mutasi ({santriList.filter(s => s.status === 'Mutasi').length})
          </button>
        </div>

        {/* Search & Gender Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs focus:outline-none"
          >
            <option value="All">Semua Gender</option>
            <option value="L">Laki-Laki (Bani)</option>
            <option value="P">Perempuan (Banat)</option>
          </select>

          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari NIS, No. KK, NIK, Nama, Kamar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">NIS & Nama Santri</th>
                <th className="p-3.5">Dokumen KK & NIK</th>
                <th className="p-3.5">Orang Tua (Ayah / Ibu)</th>
                <th className="p-3.5">Asrama / Kamar</th>
                <th className="p-3.5">Wali & No HP</th>
                <th className="p-3.5">Alamat Kependudukan</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSantri.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ditemukan data santri dengan filter ini.
                  </td>
                </tr>
              ) : (
                filteredSantri.map((santri) => (
                  <tr key={santri.id} className="hover:bg-slate-800/40 transition">
                    {/* Nama & NIS */}
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{santri.nama}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-semibold">
                          NIS: {santri.nis}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          santri.gender === 'L' ? 'bg-blue-950 text-blue-300' : 'bg-pink-950 text-pink-300'
                        }`}>
                          {santri.gender === 'L' ? 'Bani' : 'Banat'}
                        </span>
                      </div>
                    </td>

                    {/* Dokumen KK & NIK */}
                    <td className="p-3.5 font-mono">
                      <div className="text-teal-300 font-semibold flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-teal-400" />
                        KK: {santri.noKK || '-'}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        NIK: {santri.nik || '-'}
                      </div>
                    </td>

                    {/* Orang Tua */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">Ayah: {santri.namaAyah || '-'}</div>
                      <div className="text-[11px] text-slate-400">Ibu: {santri.namaIbu || '-'}</div>
                    </td>

                    {/* Kamar */}
                    <td className="p-3.5 font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        {santri.kamar}
                      </div>
                      <div className="text-[11px] text-slate-400">{santri.kelas}</div>
                    </td>

                    {/* Wali & HP */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">{santri.namaWali || '-'}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-teal-400" />
                        {santri.hpWali || '-'}
                      </div>
                    </td>

                    {/* Alamat */}
                    <td className="p-3.5 max-w-[180px]">
                      <div className="text-slate-300 truncate">{santri.alamat}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {santri.desaKelurahan ? `${santri.desaKelurahan}, ${santri.kabupatenKota}` : '-'}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detail View KK Modal */}
                        <button
                          onClick={() => setViewKkSantri(santri)}
                          title="Lihat Format KK Lengkap"
                          className="p-1.5 bg-teal-950 text-teal-300 border border-teal-800 rounded-lg hover:bg-teal-900 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleAlumniStatus(santri)}
                          title={santri.status === 'Aktif' ? 'Jadikan Alumni' : 'Kembalikan ke Santri Aktif'}
                          className={`p-1.5 rounded-lg border transition ${
                            santri.status === 'Aktif'
                              ? 'bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingSantri(santri);
                            setShowModal(true);
                          }}
                          title="Edit Data KK Santri"
                          className="p-1.5 bg-slate-900 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteSantri(santri.id, santri.nama)}
                          title="Hapus Santri"
                          className="p-1.5 bg-rose-950/60 text-rose-400 border border-rose-900/60 rounded-lg hover:bg-rose-900 transition"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* MODAL VIEW DETAILED FORMAT KK */}
      {viewKkSantri && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <CreditCard className="w-5 h-5" />
                <h2>Format Data Kartu Keluarga (KK) & Kependudukan</h2>
              </div>
              <button
                onClick={() => setViewKkSantri(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-300">
              {/* Box KK Header */}
              <div className="bg-teal-950/60 border border-teal-800/80 p-4 rounded-xl space-y-1">
                <div className="text-teal-400 font-mono font-bold text-sm">
                  NO. KARTU KELUARGA (KK): {viewKkSantri.noKK || 'Belum Diisi'}
                </div>
                <div className="text-slate-300 font-mono">
                  NIK SANTRI: <span className="font-bold text-white">{viewKkSantri.nik || 'Belum Diisi'}</span>
                </div>
              </div>

              {/* Data Diri */}
              <div className="grid grid-cols-2 gap-y-2 border-b border-slate-800 pb-3">
                <span className="text-slate-400">Nama Lengkap Santri</span>
                <span className="font-bold text-white">{viewKkSantri.nama} ({viewKkSantri.gender === 'L' ? 'Laki-Laki' : 'Perempuan'})</span>

                <span className="text-slate-400">Tempat, Tanggal Lahir</span>
                <span className="font-semibold text-slate-200">{viewKkSantri.tempatLahir}, {formatDate(viewKkSantri.tanggalLahir)}</span>

                <span className="text-slate-400">Anak Ke-</span>
                <span className="font-semibold text-slate-200">Anak Ke-{viewKkSantri.anakKe || 1} dari {viewKkSantri.jumlahBersaudara || 1} Bersaudara</span>

                <span className="text-slate-400">Asrama / Kelas</span>
                <span className="font-semibold text-emerald-400">{viewKkSantri.kamar} | {viewKkSantri.kelas}</span>
              </div>

              {/* Data Orang Tua */}
              <div className="grid grid-cols-2 gap-y-2 border-b border-slate-800 pb-3">
                <span className="text-slate-400 font-bold text-slate-200">Nama Ayah Kandung</span>
                <span className="font-semibold text-white">{viewKkSantri.namaAyah || '-'} ({viewKkSantri.pekerjaanAyah || '-'})</span>

                <span className="text-slate-400 font-bold text-slate-200">Nama Ibu Kandung</span>
                <span className="font-semibold text-white">{viewKkSantri.namaIbu || '-'} ({viewKkSantri.pekerjaanIbu || '-'})</span>

                <span className="text-slate-400">Nama Wali / Penanggung Jawab</span>
                <span className="font-semibold text-teal-300">{viewKkSantri.namaWali} ({viewKkSantri.hpWali})</span>
              </div>

              {/* Alamat Lengkap KK */}
              <div className="space-y-1">
                <div className="text-slate-400 font-bold text-slate-200">Alamat Lengkap Sesuai KK:</div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-slate-300 font-medium">
                  <p>{viewKkSantri.alamat}</p>
                  <p>RT/RW: {viewKkSantri.rtRw || '-'} | Desa/Kel: {viewKkSantri.desaKelurahan || '-'}</p>
                  <p>Kecamatan: {viewKkSantri.kecamatan || '-'} | Kab/Kota: {viewKkSantri.kabupatenKota || '-'}</p>
                  <p>Provinsi: {viewKkSantri.provinsi || '-'} | Kode Pos: {viewKkSantri.kodePos || '-'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewKkSantri(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
              >
                Tutup Pratinjau KK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Modal Form */}
      {showModal && (
        <ModalSantri
          initialData={editingSantri}
          onSave={handleSaveSantri}
          onClose={() => {
            setShowModal(false);
            setEditingSantri(null);
          }}
        />
      )}
    </div>
  );
}
