# 🕌 SANTRI HUB - Aplikasi Manajemen Santri & Pondok Pesantren

Aplikasi web modern, responsive, dan full-featured untuk pengelolaan data santri pondok pesantren. Dirancang khusus untuk **kemudahan pengelolaan data**, **Cetak Surat Izin Resmi**, **Absensi**, **Mutaba'ah Hafalan Al-Qur'an**, **Database Alumni**, serta **Keuangan Syahriah (SPP)**.

Dapat **di-deploy ke Vercel secara gratis**, disimpan di **GitHub**, dan **di-install sebagai aplikasi Android (PWA)** tanpa perlu aplikasi tambahan yang rumit!

---

## 🌟 Fitur Utama Aplikasi

1. **Dashboard & Analytics**
   - Ringkasan Santri Aktif, Santri Alumni (Lulus), Santri Sedang Izin Pulang, dan Presensi Hari Ini.
   - Quick Access untuk Input Santri & Cetak Surat Izin.

2. **Manajemen Data Santri & Status Alumni**
   - Tab khusus **Santri Aktif** & **Santri Alumni (Lulus)**.
   - Pencatatan NIS, Nama, Gender (Bani/Banat), Kamar, Kelas Diniyah, Nama Wali, No HP Wali, dan Tahun Kelulusan.
   - Filter gender, pencarian cepat, serta Export Data ke format **CSV**.

3. **Sistem Cetak Surat Izin (Print / Save PDF Ready)**
   - Form penerbitan Surat Izin Pulang / Berobat / Keperluan Keluarga / Tugas.
   - **Kop Surat Pesantren Resmi**, QR Code Verifikasi, Ketentuan Pesantren, & Tanda Tangan Pengurus.
   - Fitur 1-Click Cetak Surat ke Printer Thermal / Kertas A4 / Simpan PDF.

4. **Absensi & Presensi Santri Harian**
   - Presensi Shalat Berjamaah, Sorogan Kitab, KBM Diniyah, & Kebeberadaan Kamar.
   - Checklist status cepat (*Hadir, Izin, Sakit, Alpa*) per kamar/komplek.

5. **Progress Hafalan Al-Qur'an & Kitab**
   - Pencatatan Setoran Juz, Surah, Ayat, Predikat Kelancaran (*Mumtaz, Jayyid, Maqbul*), dan Ustadz Penyimak.

6. **Kedisiplinan & Poin Ta'zir**
   - Pencatatan Pelanggaran (*Ringan, Sedang, Berat*), Sistem Poin Kedisiplinan, dan Status Penyelesaian Hukuman Ta'zir.

7. **Keuangan & SPP Syahriah**
   - Tracking Iuran Bulanan Santri (Status *LUNAS* / *BELUM LUNAS*) dan Rekapitulasi Total Pendapatan & Tunggakan.

8. **Portal Akses Wali Santri (Self-Service)**
   - Wali santri / orang tua cukup memasukkan **NIS** untuk melihat perkembangan hafalan, status perizinan, dan SPP anak secara mandiri.

9. **Pengaturan & Backup Database JSON**
   - Kustomisasi Nama Pondok, Sub-Judul, Pengasuh, Alamat untuk Kop Surat.
   - **Backup & Restore Database JSON** 1-click untuk keamanan data.

---

## 🚀 Cara Menjalankan Aplikasi di Lokal (Laptop / Komputer)

### Prerequisites:
- Node.js versi 18 atau lebih baru.

### Langkah-langkah:
```bash
# 1. Masuk ke direktori aplikasi
cd "d:\SOFTWARE\aplikasi santri"

# 2. Install dependencies (jika belum)
npm install

# 3. Jalankan server pengembang (Development Mode)
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🐙 Cara Push ke GitHub

```bash
# 1. Inisialisasi Git (di folder aplikasi santri)
git init

# 2. Tambahkan semua file
git add .

# 3. Buat Commit awal
git commit -m "Initial commit Aplikasi Santri Hub"

# 4. Hubungkan ke Repositori GitHub Anda (Buat Repo baru di github.com terlebih dahulu)
git remote add origin https://github.com/USERNAME-ANDA/aplikasi-santri.git

# 5. Push ke GitHub
git branch -M main
git push -u origin main
```

---

## ⚡ Cara Deploy Gratis ke Vercel (1-Click Deploy)

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** -> **"Project"**.
3. Pilih repositori `aplikasi-santri` dari GitHub Anda.
4. Klik **"Deploy"**.
5. Dalam kurun waktu kurang dari 1 menit, aplikasi Anda sudah online dan dapat diakses publik dari mana saja!

---

## 📱 Cara Memasang Aplikasi di HP Android (PWA Mode)

Aplikasi ini sudah dilengkapi teknologi **PWA (Progressive Web App)**:

1. Buka link Vercel / Website aplikasi di browser **Google Chrome** di HP Android Anda.
2. Klik titik tiga **(⋮)** di sudut kanan atas browser Chrome.
3. Pilih opsi **"Tambahkan ke Layar Utama"** atau **"Install App"**.
4. Aplikasi SANTRI HUB kini terpasang di HP Android Anda seperti aplikasi dari Google Play Store!

---

## 📄 Lisensi

Dibuat khusus untuk pengembang dan pengurus Pondok Pesantren Indonesia. Semoga bermanfaat!
