"use client";

import React from 'react';
import { SuratIzin, PesantrenConfig } from '@/lib/types';
import { Printer, X, Download, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CetakSuratIzinProps {
  izin: SuratIzin;
  config: PesantrenConfig;
  onClose: () => void;
}

export const CetakSuratIzin: React.FC<CetakSuratIzinProps> = ({ izin, config, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Container Box */}
      <div className="relative bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Pratinjau Surat Izin Resmi ({izin.id})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg transition"
            >
              <Printer className="w-4 h-4" />
              Cetak / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 sm:p-12 font-serif" id="surat-izin-printable">
          {/* Header Kop Surat */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-900">
              {config.namaPondok}
            </h1>
            <p className="text-xs sm:text-sm font-sans italic text-slate-700 mt-1">
              {config.subJudul}
            </p>
            <p className="text-[11px] font-sans text-slate-600 mt-0.5">
              {config.alamat} | Telp: {config.telepon}
            </p>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold uppercase underline tracking-wider text-slate-900">
              SURAT IZIN PULANG / KELUAR KOMPLEK
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Nomor: {izin.id}/PERIZINAN/PONTREN/{new Date().getFullYear()}
            </p>
          </div>

          {/* Opening text */}
          <p className="text-sm text-slate-800 leading-relaxed font-sans mb-4">
            Yang bertanda tangan di bawah ini Pengurus Perizinan {config.namaPondok}, memberikan izin kepada santri tersebut di bawah ini:
          </p>

          {/* Details Table */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 font-sans mb-6 text-sm">
            <div className="grid grid-cols-3 gap-y-2.5">
              <span className="text-slate-600 font-medium">Nomor Induk Santri (NIS)</span>
              <span className="col-span-2 font-bold text-slate-900">: {izin.nis}</span>

              <span className="text-slate-600 font-medium">Nama Lengkap Santri</span>
              <span className="col-span-2 font-bold text-slate-900">: {izin.namaSantri}</span>

              <span className="text-slate-600 font-medium">Asrama / Kamar</span>
              <span className="col-span-2 text-slate-800">: {izin.kamar}</span>

              <span className="text-slate-600 font-medium">Kelas / Tingkat</span>
              <span className="col-span-2 text-slate-800">: {izin.kelas}</span>

              <span className="text-slate-600 font-medium">Keperluan / Kategori</span>
              <span className="col-span-2 font-semibold text-emerald-800">: {izin.kategori} ({izin.alasan})</span>

              <span className="text-slate-600 font-medium">Mulai Berangkat</span>
              <span className="col-span-2 font-semibold text-slate-900">: {formatDate(izin.tanggalKeluar)}</span>

              <span className="text-slate-600 font-medium">Batas Harus Kembali</span>
              <span className="col-span-2 font-semibold text-rose-700">: {formatDate(izin.tanggalKembali)} (Wajib Tepat Waktu)</span>
            </div>
          </div>

          {/* Rules Notes */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded text-xs font-sans text-slate-700 leading-relaxed mb-8">
            <p className="font-bold text-amber-900 mb-1">Ketentuan & Keberangkatan:</p>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Santri wajib melapor kepada Pengurus / Keamanan saat berangkat dan kembali.</li>
              <li>Tetap menjaga nama baik almamater pondok pesantren selama berada di luar komplek.</li>
              <li>Keterlambatan kembali tanpa konfirmasi resmi akan dikenakan sanksi/ta'zir sesuai aturan pondok.</li>
            </ol>
          </div>

          {/* Signatures & QR Code */}
          <div className="grid grid-cols-2 gap-4 font-sans text-xs pt-4 border-t border-slate-200">
            {/* Left: QR Verification */}
            <div className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-300 rounded-lg text-center">
              {/* Simulated QR Code SVG */}
              <div className="w-20 h-20 bg-slate-900 text-white p-2 rounded flex items-center justify-center font-mono text-[9px] text-center leading-tight mb-2">
                [ QR CODE ]<br />{izin.id}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Scan Verifikasi Surat</span>
            </div>

            {/* Right: Signatures */}
            <div className="text-center flex flex-col justify-between">
              <div>
                <p className="text-slate-600">Ditetapkan di: Sleman, Yogyakarta</p>
                <p className="text-slate-600 font-medium">Tanggal: {formatDate(izin.createdAt.split('T')[0])}</p>
                <p className="font-bold text-slate-900 mt-2">Pengurus / Keamanan Santri</p>
              </div>

              <div className="mt-12">
                <p className="font-bold text-slate-900 underline">{izin.penanggungJawab}</p>
                <p className="text-[11px] text-slate-500">NIP / ID: PNT-{Math.floor(1000 + Math.random() * 9000)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
