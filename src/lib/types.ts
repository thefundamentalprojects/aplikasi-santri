export type GenderType = 'L' | 'P';
export type StatusSantri = 'Aktif' | 'Alumni' | 'Mutasi' | 'Skorsing';

export interface Santri {
  id: string;
  nis: string;
  noKK?: string;
  nik?: string;
  nama: string;
  gender: GenderType;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  rtRw?: string;
  desaKelurahan?: string;
  kecamatan?: string;
  kabupatenKota?: string;
  provinsi?: string;
  kodePos?: string;
  kamar: string;
  kelas: string;
  namaWali: string;
  hpWali: string;
  namaAyah?: string;
  pekerjaanAyah?: string;
  namaIbu?: string;
  pekerjaanIbu?: string;
  anakKe?: number;
  jumlahBersaudara?: number;
  status: StatusSantri;
  tahunMasuk: number;
  tahunAlumni?: number;
  foto?: string;
  catatan?: string;
}

export type KategoriIzin = 'Pulang' | 'Berobat' | 'Keperluan Keluarga' | 'Tugas Pesantren';
export type StatusIzin = 'Sedang Izin' | 'Sudah Kembali' | 'Terlambat';

export interface SuratIzin {
  id: string;
  santriId: string;
  nis: string;
  namaSantri: string;
  kamar: string;
  kelas: string;
  kategori: KategoriIzin;
  alasan: string;
  tanggalKeluar: string;
  tanggalKembali: string;
  status: StatusIzin;
  penanggungJawab: string;
  noHpPenanggungJawab?: string;
  createdAt: string;
}

export type StatusAbsensi = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface AbsensiRecord {
  id: string;
  tanggal: string;
  jenisKegiatan: string;
  santriId: string;
  namaSantri: string;
  kamar: string;
  status: StatusAbsensi;
  keterangan?: string;
}

export interface HafalanRecord {
  id: string;
  santriId: string;
  namaSantri: string;
  tanggal: string;
  juz: number;
  surah: string;
  ayatAwal: number;
  ayatAkhir: number;
  predikat: 'Mumtaz (Sangat Baik)' | 'Jayyid (Baik)' | 'Maqbul (Cukup)' | 'Murajaah Ulang';
  ustadz: string;
}

export interface PelanggaranRecord {
  id: string;
  santriId: string;
  namaSantri: string;
  tanggal: string;
  jenisPelanggaran: string;
  tingkat: 'Ringan' | 'Sedang' | 'Berat';
  poin: number;
  hukuman: string;
  statusTazcir: 'Belum Dilaksanakan' | 'Sudah Selesai';
}

export interface KeuanganRecord {
  id: string;
  santriId: string;
  namaSantri: string;
  bulan: string;
  jumlah: number;
  status: 'Lunas' | 'Belum Lunas';
  tanggalBayar?: string;
}

export interface PesantrenConfig {
  namaPondok: string;
  subJudul: string;
  pengasuh: string;
  alamat: string;
  telepon: string;
  email: string;
  logoUrl?: string;
}
