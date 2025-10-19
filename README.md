# Sipadi (Sistem Informasi Pertanian Demak)

<p align="center">
  <img src="https://placehold.co/800x300/2E7D32/FFFFFF?text=Sipadi&font=roboto" alt="Sipadi Banner">
</p>

<p align="center">
  <strong>Platform web modern untuk mendigitalisasi pelaporan dan manajemen data pertanian di Kabupaten Demak.</strong>
</p>

<p align="center">
  Memberdayakan petani dan mendukung pengambilan keputusan berbasis data oleh dinas terkait.
</p>

<p align="center">
  <img alt="Build Status" src="https://img.shields.io/badge/build-passing-brightgreen">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/postgresql-%3E%3D12.0-blue">
</p>

---

## 🌾 Tentang Proyek

**Sipadi** adalah sistem informasi terintegrasi yang dirancang untuk memodernisasi manajemen data pertanian di Kabupaten Demak. Aplikasi ini menjembatani kesenjangan antara petani dan dinas pertanian dengan menyediakan platform digital untuk pelaporan, pemantauan, dan analisis data agrikultur secara efisien dan akurat.

---

## ✨ Fitur Utama

### 👨‍🌾 Portal Petani
- **Autentikasi Aman**: Registrasi dan login berbasis NIK dengan JWT.
- **Manajemen Lahan**: Visualisasikan dan kelola lahan pertanian Anda di peta interaktif.
- **Pelaporan Panen & Keluhan**: Catat hasil panen dan laporkan masalah (hama, irigasi) dengan mudah, lengkap dengan unggah foto.
- **Pusat Informasi**: Akses artikel dan panduan yang dipublikasikan oleh dinas pertanian.
- **Dashboard Personal**: Lihat ringkasan lahan, panen terakhir, dan status keluhan Anda.

### 👨‍💼 Portal Admin (Dinas Pertanian)
- **Dashboard Analitik**: Pantau KPI utama seperti total lahan, jumlah petani, dan total laporan melalui kartu statistik dan grafik.
- **Peta Lahan Interaktif**: Visualisasikan sebaran lahan pertanian di seluruh wilayah dengan fitur clustering dan filter.
- **Laporan Terpadu**: Agregasi dan analisis semua laporan panen dan keluhan dengan filter berdasarkan tanggal dan kecamatan.
- **Manajemen Konten**: Buat, edit, dan publikasikan artikel atau panduan untuk petani.
- **Manajemen Keluhan**: Tinjau dan berikan tanggapan untuk setiap keluhan yang masuk dari petani.

---

## 🛠️ Tech Stack

| Bagian | Teknologi |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Leaflet, Recharts, SweetAlert2 |
| **Backend** | Node.js, Express, PostgreSQL, Sequelize, PostGIS |
| **Database** | PostgreSQL dengan ekstensi PostGIS untuk data geospasial |

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Prasyarat
Pastikan perangkat Anda sudah terinstall:
- **Node.js** (v16 atau lebih baru)
- **npm** (biasanya terinstall bersama Node.js)
- **PostgreSQL** (v12 atau lebih baru) dengan ekstensi **PostGIS**
- **Git**

### 1. Clone Proyek
Clone repositori ini ke mesin lokal Anda.
```bash
git clone [URL_REPOSITORY_ANDA] sipadi
cd sipadi
```

### 2. Setup Backend
Buka terminal baru, lalu jalankan perintah berikut:
```bash
# Masuk ke direktori server
cd server

# Install semua dependency
npm install

# Salin file environment example
cp .env.example .env
```
**Penting:** Buka file `.env` yang baru dibuat dan sesuaikan isinya, terutama untuk koneksi database (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) dan `JWT_SECRET`.

### 3. Setup Database
Pastikan server PostgreSQL Anda berjalan. Buat database baru (misalnya `sipadi_dev`) dan aktifkan ekstensi PostGIS.
```sql
-- Contoh perintah di psql
CREATE DATABASE sipadi_dev;
\c sipadi_dev
CREATE EXTENSION postgis;
```
Setelah itu, jalankan migrasi untuk membuat semua tabel yang diperlukan.
```bash
# Dari dalam direktori server
npx sequelize-cli db:migrate
```

### 4. Setup Frontend
Buka terminal baru yang lain, lalu jalankan:
```bash
# Masuk ke direktori client
cd client

# Install semua dependency
npm install
```
Frontend akan secara otomatis terhubung ke backend melalui `http://localhost:5000` (dikonfigurasi di `vite.config.js`).

### 5. Menjalankan Aplikasi
Anda perlu menjalankan backend dan frontend secara bersamaan di dua terminal terpisah.

**Terminal 1 (Backend):**
```bash
# Dari dalam direktori server
npm run dev
```
Server akan berjalan di `http://localhost:5000`.

**Terminal 2 (Frontend):**
```bash
# Dari dalam direktori client
npm run dev
```
Aplikasi web bisa diakses di `http://localhost:5173`.

---

## ⚙️ Variabel Lingkungan (.env)
File `.env` di dalam direktori `server` digunakan untuk mengkonfigurasi aplikasi. Salin dari `.env.example` dan sesuaikan nilainya.

| Variabel | Deskripsi | Contoh |
|---|---|---|
| `NODE_ENV` | Mode aplikasi | `development` |
| `PORT` | Port untuk server backend | `5000` |
| `DB_HOST` | Alamat host database | `localhost` |
| `DB_PORT` | Port database PostgreSQL | `5432` |
| `DB_NAME` | Nama database Anda | `sipadi_dev` |
| `DB_USER` | Username database | `postgres` |
| `DB_PASSWORD`| Password database | `password_anda` |
| `JWT_SECRET` | Kunci rahasia untuk enkripsi token | `kunci_rahasia_yang_sangat_panjang_dan_aman` |

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah **MIT License**.
