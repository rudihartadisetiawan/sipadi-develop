# Sipadi (Sistem Informasi Pertanian Demak)

<p align="center">
  <img src="https://placehold.co/800x300/2E7D32/FFFFFF?text=Sipadi&font=roboto" alt="Sipadi Banner">
</p>

<p align="center">
  <strong>Platform web modern untuk mendigitalisasi pelaporan dan manajemen data pertanian di Kabupaten Demak</strong>
</p>

<p align="center">
  Memberdayakan petani dan mendukung pengambilan keputusan berbasis data oleh dinas terkait
</p>

<p align="center">
  <img alt="Build Status" src="https://img.shields.io/badge/build-passing-brightgreen">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/postgresql-%3E%3D12.0-blue">
</p>

---

## 📖 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Instalasi Detail](#-instalasi-detail)
- [Struktur Project](#-struktur-project)
- [Database Schema](#️-database-schema)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🌾 Tentang Project

### Latar Belakang

Di era digital, data adalah aset krusial. Namun, proses pelaporan data pertanian di Kabupaten Demak seringkali masih manual, menyebabkan:

- ❌ Data tersebar dan tidak terstruktur
- ❌ Proses pelaporan memakan waktu lama
- ❌ Sulit melacak riwayat dan tren hasil panen
- ❌ Komunikasi petani-dinas tidak efisien
- ❌ Pengambilan keputusan tidak berbasis data akurat

### Solusi Sipadi

Sipadi hadir sebagai solusi terintegrasi untuk menciptakan ekosistem data agrikultur yang:

- ✅ **Terpusat**: Database terstruktur dengan validasi real-time
- ✅ **Cepat**: Pelaporan digital melalui interface intuitif
- ✅ **Visual**: Dashboard analitik dengan grafik interaktif
- ✅ **Transparan**: Platform komunikasi dua arah
- ✅ **Akurat**: Data geospasial berbasis PostGIS

---

## ✨ Fitur Utama

### 👨‍🌾 Portal Petani

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Autentikasi** | Registrasi dengan NIK, login aman dengan JWT |
| 🗺️ **Manajemen Lahan** | Gambar poligon lahan di peta interaktif, CRUD lengkap |
| 🌾 **Laporan Panen** | Catat hasil panen per lahan, riwayat lengkap |
| 🐛 **Laporan Keluhan** | Laporkan masalah (hama, irigasi) dengan foto |
| 📰 **Pusat Informasi** | Baca artikel dari dinas, diskusi via komentar |
| 📊 **Dashboard** | Ringkasan lahan, panen terbaru, status keluhan |

### 👨‍💼 Portal Admin (Dinas Pertanian)

| Halaman | Fitur Utama |
|---------|-------------|
| **🗺️ Peta Interaktif** | • Visualisasi semua lahan dengan clustering<br>• Filter per wilayah (kecamatan/desa)<br>• Detail popup per lahan |
| **📋 Laporan Terpadu** | • Agregasi semua laporan panen & keluhan<br>• Filter lanjutan (tanggal, lokasi, status)<br>• Bulk action untuk keluhan<br>• Export ke Excel/PDF |
| **📈 Analitik Panen** | • Bar chart hasil panen per kecamatan<br>• Tabel detail dengan sorting<br>• Grafik tren historis per lahan<br>• Perbandingan performa wilayah |
| **✍️ Manajemen Konten** | • CRUD artikel dengan Rich Text Editor<br>• Upload media/gambar<br>• Moderasi komentar<br>• Statistik engagement |
| **📊 Dashboard** | • KPI cards (total lahan, panen, keluhan)<br>• Quick stats & insights<br>• Recent activities |

---

## 🛠️ Tech Stack

### Backend: Node.js + Express + PostgreSQL

**Base Starter:** [hagopj13/node-express-postgresql-starter](https://github.com/hagopj13/node-express-postgresql-starter)

**Keuntungan menggunakan starter ini:**
- ✅ Production-ready architecture
- ✅ JWT authentication built-in
- ✅ Request validation (Joi)
- ✅ API documentation (Swagger)
- ✅ Security best practices (Helmet, CORS, Rate limiting)
- ✅ Logging (Winston)
- ✅ Testing setup (Jest)
- ✅ Email service (Nodemailer)

**Dependencies Tambahan:**
```json
{
  "postgis": "^0.6.0",
  "sequelize-spatial": "^1.0.0",
  "multer": "^1.4.5",
  "sharp": "^0.32.0"
}
```

### Frontend: Vite + React + Tailwind CSS

**Base Starter:** [theodorusclarence/vite-react-tailwind-starter](https://github.com/theodorusclarence/vite-react-tailwind-starter)

**Keuntungan menggunakan starter ini:**
- ⚡ Lightning-fast development (Vite)
- 🎨 Tailwind CSS pre-configured
- 📏 ESLint + Prettier setup
- 🐶 Husky pre-commit hooks
- 🔧 Absolute imports ready
- 📱 PWA ready

**Dependencies Tambahan:**
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "react-leaflet-cluster": "^2.1.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "axios": "^1.6.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0",
  "zod": "^3.22.0",
  "lucide-react": "^0.292.0",
  "date-fns": "^2.30.0"
}
```

### Database: PostgreSQL + PostGIS

- **PostgreSQL 12+**: Robust relational database
- **PostGIS**: Spatial data extension untuk geolocation features

---

## 🚀 Quick Start

### Prasyarat

Pastikan terinstall:
- **Node.js** >= 16.0.0
- **npm** atau **yarn**
- **PostgreSQL** >= 12.0
- **Git**

### Installation in 5 Minutes

```bash
# 1. Setup Database
psql -U postgres -c "CREATE DATABASE sipadi_db;"
psql -U postgres -d sipadi_db -c "CREATE EXTENSION postgis;"

# 2. Clone Backend
git clone https://github.com/hagopj13/node-express-postgresql-starter.git server
cd server
npm install
npm install postgis sequelize-spatial multer sharp
cp .env.example .env
# Edit .env (DB credentials & JWT secret)

# 3. Clone Frontend (terminal baru)
cd ..
git clone https://github.com/theodorusclarence/vite-react-tailwind-starter.git client
cd client
npm install
npm install leaflet react-leaflet axios @tanstack/react-query react-hook-form chart.js react-chartjs-2
echo "VITE_API_URL=http://localhost:5000/v1" > .env

# 4. Run Backend (terminal 1)
cd server
npm run dev

# 5. Run Frontend (terminal 2)
cd client
npm run dev
```

Buka browser: `http://localhost:3000`

---

## 📦 Instalasi Detail

### 1. Setup Database

```bash
# Masuk PostgreSQL shell
psql -U postgres

# Buat database
CREATE DATABASE sipadi_db;

# Connect ke database
\c sipadi_db

# Install PostGIS extension
CREATE EXTENSION postgis;

# Verifikasi instalasi
SELECT PostGIS_Version();
-- Output: POSTGIS="3.x.x ..."

# Keluar
\q
```

### 2. Setup Backend

```bash
# Clone starter repository
git clone https://github.com/hagopj13/node-express-postgresql-starter.git server
cd server

# Install base dependencies
npm install

# Install Sipadi-specific dependencies
npm install postgis sequelize-spatial multer sharp lodash moment-timezone

# Setup environment variables
cp .env.example .env
```

**Edit `.env` file:**

```env
# Node Environment
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sipadi_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=sipadi_jwt_secret_key_min_32_characters_for_security
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# Email Configuration (Optional - untuk notifikasi)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@sipadi.com

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
```

**Create Sequelize config for PostGIS:**

File: `server/src/config/database.js`

```javascript
const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    dialectOptions: {
      // Enable PostGIS
      application_name: 'sipadi',
    },
    logging: config.env === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = { sequelize };
```

**Test Database Connection:**

```bash
npm run dev

# Should see:
# Connected to PostgreSQL database
# Server running on port 5000
```

### 3. Setup Frontend

```bash
# Kembali ke root directory
cd ..

# Clone frontend starter
git clone https://github.com/theodorusclarence/vite-react-tailwind-starter.git client
cd client

# Install base dependencies
npm install

# Install Sipadi-specific dependencies
npm install leaflet react-leaflet react-leaflet-cluster
npm install chart.js react-chartjs-2
npm install axios @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install clsx tailwind-merge lucide-react date-fns

# Create environment file
echo "VITE_API_URL=http://localhost:5000/v1" > .env
```

**Configure Vite Proxy:**

File: `client/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**Setup Axios Instance:**

File: `client/src/lib/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Test Frontend:**

```bash
npm run dev

# Should see:
# VITE ready in X ms
# Local: http://localhost:3000
```

---

## 📁 Struktur Project

```
sipadi-project/
│
├── server/                           # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js            # App configuration
│   │   │   ├── database.js          # Sequelize + PostGIS setup
│   │   │   ├── logger.js            # Winston logger
│   │   │   ├── morgan.js            # HTTP request logger
│   │   │   └── passport.js          # JWT strategy
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── lahan.controller.js       # 🆕 Land management
│   │   │   ├── panen.controller.js       # 🆕 Harvest reports
│   │   │   ├── keluhan.controller.js     # 🆕 Complaints
│   │   │   └── artikel.controller.js     # 🆕 Articles/CMS
│   │   │
│   │   ├── models/
│   │   │   ├── index.js             # Sequelize models index
│   │   │   ├── user.model.js
│   │   │   ├── token.model.js
│   │   │   ├── lahan.model.js       # 🆕 With PostGIS geometry
│   │   │   ├── panen.model.js       # 🆕
│   │   │   ├── keluhan.model.js     # 🆕
│   │   │   ├── artikel.model.js     # 🆕
│   │   │   └── komentar.model.js    # 🆕
│   │   │
│   │   ├── routes/
│   │   │   └── v1/
│   │   │       ├── index.js
│   │   │       ├── auth.route.js
│   │   │       ├── user.route.js
│   │   │       ├── lahan.route.js    # 🆕
│   │   │       ├── panen.route.js    # 🆕
│   │   │       ├── keluhan.route.js  # 🆕
│   │   │       └── artikel.route.js  # 🆕
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── token.service.js
│   │   │   ├── email.service.js
│   │   │   ├── user.service.js
│   │   │   ├── lahan.service.js      # 🆕 Land operations
│   │   │   ├── spatial.service.js    # 🆕 PostGIS queries
│   │   │   ├── panen.service.js      # 🆕
│   │   │   └── keluhan.service.js    # 🆕
│   │   │
│   │   ├── validations/
│   │   │   ├── auth.validation.js
│   │   │   ├── user.validation.js
│   │   │   ├── lahan.validation.js   # 🆕 Joi schemas
│   │   │   ├── panen.validation.js   # 🆕
│   │   │   └── keluhan.validation.js # 🆕
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── validate.js          # Request validation
│   │   │   ├── error.js             # Error handler
│   │   │   ├── rateLimiter.js       # Rate limiting
│   │   │   └── upload.js            # 🆕 Multer file upload
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── catchAsync.js
│   │   │   └── pick.js
│   │   │
│   │   ├── docs/                    # Swagger documentation
│   │   ├── app.js                   # Express app
│   │   └── index.js                 # Entry point
│   │
│   ├── tests/                       # Jest tests
│   ├── uploads/                     # 🆕 Uploaded files
│   ├── .env
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── ecosystem.config.js          # PM2 config
│   └── package.json
│
├── client/                          # Frontend React App
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   │
│   │   │   ├── map/                 # 🆕 Map components
│   │   │   │   ├── MapView.jsx
│   │   │   │   ├── DrawPolygon.jsx
│   │   │   │   └── MarkerCluster.jsx
│   │   │   │
│   │   │   ├── charts/              # 🆕 Chart components
│   │   │   │   ├── BarChart.jsx
│   │   │   │   ├── LineChart.jsx
│   │   │   │   └── PieChart.jsx
│   │   │   │
│   │   │   ├── forms/               # Form components
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   └── FileUpload.jsx
│   │   │   │
│   │   │   ├── petani/              # Farmer components
│   │   │   │   ├── LahanCard.jsx
│   │   │   │   ├── PanenForm.jsx
│   │   │   │   └── KeluhanForm.jsx
│   │   │   │
│   │   │   └── admin/               # Admin components
│   │   │       ├── StatCard.jsx
│   │   │       ├── DataTable.jsx
│   │   │       └── RichTextEditor.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── petani/              # 🆕 Farmer pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── LahanList.jsx
│   │   │   │   ├── LahanForm.jsx
│   │   │   │   ├── LaporanPanen.jsx
│   │   │   │   ├── Keluhan.jsx
│   │   │   │   └── Artikel.jsx
│   │   │   │
│   │   │   └── admin/               # 🆕 Admin pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── PetaLahan.jsx
│   │   │       ├── LaporanTerpadu.jsx
│   │   │       ├── AnalitikPanen.jsx
│   │   │       └── ManajemenKonten.jsx
│   │   │
│   │   ├── lib/                     # Utilities & API
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── constants.js         # App constants
│   │   │   └── utils.js             # Helper functions
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useMap.js
│   │   │   ├── useLahan.js
│   │   │   └── usePanen.js
│   │   │
│   │   ├── routes/                  # Route configuration
│   │   │   ├── index.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   │
│   │   ├── styles/                  # Global styles
│   │   │   └── index.css
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   │
│   ├── .env
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/                            # Documentation
│   ├── api/                         # API documentation
│   ├── screenshots/                 # App screenshots
│   └── diagrams/                    # Architecture diagrams
│
├── .gitignore
├── docker-compose.yml               # 🆕 Docker setup
└── README.md
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │
│ nik (UNIQUE)    │
│ nama            │
│ email           │
│ password_hash   │
│ role            │ → 'petani' | 'admin'
│ created_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐         ┌─────────────────┐
│     lahan       │ 1     N │     panen       │
│─────────────────│◄────────│─────────────────│
│ id (PK)         │         │ id (PK)         │
│ user_id (FK)    │         │ lahan_id (FK)   │
│ nama_lahan      │         │ tanggal_panen   │
│ luas            │         │ jumlah_panen    │
│ geometry (GEOM) │         │ kualitas        │
│ centroid (GEOM) │         │ created_at      │
│ jenis_tanaman   │         └─────────────────┘
│ status          │
│ desa            │         ┌─────────────────┐
│ kecamatan       │ 1     N │    keluhan      │
│ created_at      │◄────────│─────────────────│
└─────────────────┘         │ id (PK)         │
                            │ lahan_id (FK)   │
                            │ kategori        │
                            │ deskripsi       │
                            │ foto_bukti      │
                            │ status          │
                            │ tanggapan       │
                            │ admin_id (FK)   │
                            │ created_at      │
                            └─────────────────┘

┌─────────────────┐
│    artikel      │
│─────────────────│
│ id (PK)         │
│ admin_id (FK)   │
│ judul           │
│ konten          │
│ gambar_utama    │
│ views           │
│ created_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│    komentar     │
│─────────────────│
│ id (PK)         │
│ artikel_id (FK) │
│ user_id (FK)    │
│ konten          │
│ parent_id (FK)  │
│ created_at      │
└─────────────────┘
```

### SQL Schema

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    no_telepon VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'petani' CHECK (role IN ('petani', 'admin')),
    alamat TEXT,
    foto_profil VARCHAR(255),
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lahan Table (PostGIS Geometry)
CREATE TABLE lahan (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nama_lahan VARCHAR(100) NOT NULL,
    luas DECIMAL(10, 2) NOT NULL CHECK (luas > 0),
    geometry GEOMETRY(Polygon, 4326) NOT NULL,
    centroid GEOMETRY(Point, 4326),
    jenis_tanaman VARCHAR(50),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'bera', 'bermasalah')),
    alamat TEXT,
    desa VARCHAR(50),
    kecamatan VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_lahan_geometry ON lahan USING GIST(geometry);
CREATE INDEX idx_lahan_centroid ON lahan USING GIST(centroid);
CREATE INDEX idx_lahan_user_id ON lahan(user_id);
CREATE INDEX idx_lahan_kecamatan ON lahan(kecamatan);
CREATE INDEX idx_lahan_status ON lahan(status);

-- Auto-generate centroid trigger
CREATE OR REPLACE FUNCTION update_lahan_centroid()
RETURNS TRIGGER AS $$
BEGIN
    NEW.centroid := ST_Centroid(NEW.geometry);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_centroid
    BEFORE INSERT OR UPDATE OF geometry ON lahan
    FOR EACH ROW
    EXECUTE FUNCTION update_lahan_centroid();

-- Panen Table
CREATE TABLE panen (
    id SERIAL PRIMARY KEY,
    lahan_id INTEGER NOT NULL REFERENCES lahan(id) ON DELETE CASCADE,
    tanggal_panen DATE NOT NULL,
    jumlah_panen DECIMAL(10, 2) NOT NULL CHECK (jumlah_panen > 0),
    kualitas VARCHAR(20) CHECK (kualitas IN ('baik', 'sedang', 'kurang')),
    harga_jual DECIMAL(12, 2),
    catatan TEXT,
    foto_panen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_panen_lahan_id ON panen(lahan_id);
CREATE INDEX idx_panen_tanggal ON panen(tanggal_panen DESC);

-- Keluhan Table
CREATE TABLE keluhan (
    id SERIAL PRIMARY KEY,
    lahan_id INTEGER NOT NULL REFERENCES lahan(id) ON DELETE CASCADE,
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('irigasi', 'hama', 'pupuk', 'penyakit', 'lainnya')),
    deskripsi TEXT NOT NULL,
    foto_bukti VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'diproses', 'selesai')),
    tanggapan TEXT,
    admin_id INTEGER REFERENCES users(id),
    tanggal_keluhan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_selesai TIMESTAMP
);

CREATE INDEX idx_keluhan_lahan_id ON keluhan(lahan_id);
CREATE INDEX idx_keluhan_status ON keluhan(status);
CREATE INDEX idx_keluhan_tanggal ON keluhan(tanggal_keluhan DESC);

-- Artikel Table
CREATE TABLE artikel (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES users(id),
    judul VARCHAR(200) NOT NULL,
    konten TEXT NOT NULL,
    gambar_utama VARCHAR(255),
    kategori VARCHAR(50),
    views INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artikel_admin_id ON artikel(admin_id);
CREATE INDEX idx_artikel_kategori ON artikel(kategori);

-- Komentar Table
CREATE TABLE komentar (
    id SERIAL PRIMARY KEY,
    artikel_id INTEGER NOT NULL REFERENCES artikel(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    konten TEXT NOT NULL,
    parent_id INTEGER REFERENCES komentar(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_komentar_artikel_id ON komentar(artikel_id);
CREATE INDEX idx_komentar_parent_id ON komentar(parent_id);

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lahan_updated_at BEFORE UPDATE ON lahan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artikel_updated_at BEFORE UPDATE ON artikel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/v1/auth/register` | Register petani baru | Public |
| POST | `/v1/auth/login` | Login user | Public |
| POST | `/v1/auth/logout` | Logout user | Private |
| POST | `/v1/auth/refresh-tokens` | Refresh access token | Private |
| POST | `/v1/auth/forgot-password` | Send reset password email | Public |
| POST | `/v1/auth/reset-password` | Reset password | Public |

### Lahan Endpoints

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| POST | `/v1/lahan` | Create new lahan | Private | Petani |
| GET | `/v1/lahan` | Get user's lahan list | Private | Petani |
| GET | `/v1/lahan/:id` | Get lahan detail | Private | Petani |
| PATCH | `/v1/lahan/:id` | Update lahan | Private | Petani |
| DELETE | `/v1/lahan/:id` | Delete lahan | Private | Petani |
| GET | `/v1/lahan/all` | Get all lahan (admin) | Private | Admin |
| GET | `/v1/lahan/check-overlap` | Check geometry overlap | Private | Petani |

### Panen Endpoints

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| POST | `/v1/panen` | Create harvest report | Private | Petani |
| GET | `/v1/panen` | Get user's harvest reports | Private | Petani |
| GET | `/v1/panen/:id` | Get harvest detail | Private | Petani |
| PATCH | `/v1/panen/:id` | Update harvest report | Private | Petani |
| DELETE | `/v1/panen/:id` | Delete harvest report | Private | Petani |
| GET | `/v1/panen/all` | Get all reports (admin) | Private | Admin |
| GET | `/v1/panen/statistik` | Get harvest statistics | Private | Admin |
| GET | `/v1/panen/trend/:lahanId` | Get harvest trend by lahan | Private | Admin |

### Keluhan Endpoints

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| POST | `/v1/keluhan` | Create complaint | Private | Petani |
| GET | `/v1/keluhan` | Get user's complaints | Private | Petani |
| GET | `/v1/keluhan/:id` | Get complaint detail | Private | Both |
| GET | `/v1/keluhan/all` | Get all complaints | Private | Admin |
| PATCH | `/v1/keluhan/:id` | Update complaint status | Private | Admin |
| DELETE | `/v1/keluhan/:id` | Delete complaint | Private | Petani |

### Artikel Endpoints

| Method | Endpoint | Description | Access | Role |
|--------|----------|-------------|--------|------|
| POST | `/v1/artikel` | Create article | Private | Admin |
| GET | `/v1/artikel` | Get all articles | Public | - |
| GET | `/v1/artikel/:id` | Get article detail | Public | - |
| PATCH | `/v1/artikel/:id` | Update article | Private | Admin |
| DELETE | `/v1/artikel/:id` | Delete article | Private | Admin |
| POST | `/v1/artikel/:id/komentar` | Add comment | Private | Both |
| GET | `/v1/artikel/:id/komentar` | Get article comments | Public | - |
| DELETE | `/v1/komentar/:id` | Delete comment | Private | Admin/Owner |

### Upload Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/v1/upload/foto-profil` | Upload profile photo | Private |
| POST | `/v1/upload/foto-panen` | Upload harvest photo | Private |
| POST | `/v1/upload/foto-keluhan` | Upload complaint photo | Private |
| POST | `/v1/upload/gambar-artikel` | Upload article image | Private (Admin) |

**Example Request:**

```bash
# Login
curl -X POST http://localhost:5000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3374010101900001",
    "password": "Password123!"
  }'

# Response
{
  "user": {
    "id": 1,
    "nik": "3374010101900001",
    "nama": "Budi Santoso",
    "role": "petani"
  },
  "tokens": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2025-10-04T12:00:00.000Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2025-11-03T11:30:00.000Z"
    }
  }
}

# Create Lahan
curl -X POST http://localhost:5000/v1/lahan \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "namaLahan": "Sawah Utara",
    "luas": 2.5,
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [110.5334, -6.8917],
        [110.5344, -6.8917],
        [110.5344, -6.8927],
        [110.5334, -6.8927],
        [110.5334, -6.8917]
      ]]
    },
    "jenisTanaman": "Padi",
    "desa": "Wonosalam",
    "kecamatan": "Demak"
  }'
```

**Swagger Documentation:** 

Akses lengkap API documentation di: `http://localhost:5000/v1/docs`

---

## 👨‍💻 Development Guide

### Prerequisites untuk Development

```bash
# Recommended Extensions untuk VS Code
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- PostCSS Language Support
- Thunder Client (REST API testing)
```

### Running Development Servers

```bash
# Terminal 1: Backend with hot reload
cd server
npm run dev

# Terminal 2: Frontend with HMR
cd client
npm run dev

# Terminal 3: Watch tests (optional)
cd server
npm run test:watch
```

### Code Style & Linting

```bash
# Backend
cd server
npm run lint          # Check linting errors
npm run lint:fix      # Auto-fix linting errors
npm run format        # Format code with Prettier

# Frontend
cd client
npm run lint
npm run lint:fix
npm run format
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Make changes and commit
git add .
git commit -m "feat: add authentication system"

# Push to remote
git push origin feature/nama-fitur

# Create Pull Request di GitHub
```

**Commit Message Convention:**

```
feat: new feature
fix: bug fix
docs: documentation update
style: code style/formatting
refactor: code refactoring
test: add/update tests
chore: maintenance tasks
```

### Database Migrations

```bash
# Create new migration
cd server
npx sequelize-cli migration:generate --name add-status-to-keluhan

# Run migrations
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Rollback all migrations
npx sequelize-cli db:migrate:undo:all
```

### Seed Data untuk Development

```bash
# Create seed file
npx sequelize-cli seed:generate --name demo-users

# Run all seeders
npx sequelize-cli db:seed:all

# Undo last seeder
npx sequelize-cli db:seed:undo
```

---

## 🧪 Testing

### Backend Testing (Jest)

```bash
cd server

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/unit/models/user.test.js

# Run tests in watch mode
npm run test:watch
```

**Example Unit Test:**

```javascript
// tests/unit/services/lahan.service.test.js
const { lahanService } = require('../../../src/services');

describe('Lahan Service', () => {
  describe('createLahan', () => {
    test('should create lahan successfully', async () => {
      const lahanData = {
        userId: 1,
        namaLahan: 'Test Sawah',
        luas: 2.5,
        geometry: { type: 'Polygon', coordinates: [[...]] },
        desa: 'Wonosalam',
        kecamatan: 'Demak'
      };

      const lahan = await lahanService.createLahan(lahanData);
      
      expect(lahan).toHaveProperty('id');
      expect(lahan.namaLahan).toBe('Test Sawah');
      expect(lahan.luas).toBe(2.5);
    });
  });
});
```

### Frontend Testing (Vitest)

```bash
cd client

# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

### Integration Testing

```bash
# Test API endpoints
cd server
npm run test:integration
```

### E2E Testing (Optional - Playwright)

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test

# Run with UI mode
npx playwright test --ui
```

---

## 🚀 Deployment

### Production Build

**Backend:**

```bash
cd server

# Install production dependencies only
npm ci --production

# Set environment
export NODE_ENV=production

# Run with PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

**Frontend:**

```bash
cd client

# Build for production
npm run build

# Preview production build locally
npm run preview

# Output in dist/ folder
```

### Environment Variables untuk Production

**Backend `.env`:**

```env
NODE_ENV=production
PORT=5000

DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=sipadi_db
DB_USER=sipadi_user
DB_PASSWORD=strong_production_password

JWT_SECRET=production_jwt_secret_very_long_and_random
JWT_ACCESS_EXPIRATION_MINUTES=30

# Email service
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your_production_email@gmail.com
SMTP_PASSWORD=your_app_password

# CORS
CORS_ORIGIN=https://sipadi-demak.com
```

**Frontend `.env.production`:**

```env
VITE_API_URL=https://api.sipadi-demak.com/v1
```

### Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Run in production
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

**docker-compose.prod.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:14-3.2
    environment:
      POSTGRES_DB: sipadi_db
      POSTGRES_USER: sipadi_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    networks:
      - sipadi-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
      DB_HOST: postgres
    depends_on:
      - postgres
    restart: always
    networks:
      - sipadi-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
    networks:
      - sipadi-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: always
    networks:
      - sipadi-network

volumes:
  postgres_data:

networks:
  sipadi-network:
    driver: bridge
```

### Hosting Recommendations

- **Backend**: Railway, Render, DigitalOcean App Platform
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Railway, Supabase, AWS RDS
- **File Storage**: AWS S3, Cloudinary, ImageKit

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. PostGIS Extension Error

```bash
# Error: extension "postgis" does not exist
# Solution:
psql -U postgres -d sipadi_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

#### 2. CORS Error di Frontend

```javascript
// Backend: src/app.js
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

#### 3. JWT Token Expired

```javascript
// Frontend: Setup token refresh
// src/lib/api.js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      try {
        const { data } = await axios.post('/v1/auth/refresh-tokens', {
          refreshToken
        });
        
        localStorage.setItem('token', data.access.token);
        originalRequest.headers.Authorization = `Bearer ${data.access.token}`;
        
        return api(originalRequest);
      } catch (err) {
        // Refresh failed, logout
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### 4. File Upload Size Limit

```javascript
// Backend: src/middlewares/upload.js
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
```

#### 5. Map Not Rendering

```jsx
// Frontend: Import Leaflet CSS
// src/main.jsx
import 'leaflet/dist/leaflet.css';

// Fix marker icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
```

#### 6. Database Connection Pool Exhausted

```javascript
// Backend: src/config/database.js
const sequelize = new Sequelize({
  // ...
  pool: {
    max: 10,          // Maximum connections
    min: 0,           // Minimum connections
    acquire: 30000,   // Maximum time to acquire connection
    idle: 10000       // Maximum time connection can be idle
  }
});
```

---

## 🗺️ Roadmap

### ✅ Version 1.0 (MVP) - Q4 2025

- [x] User authentication (petani & admin)
- [x] Lahan management dengan peta interaktif
- [x] Laporan panen
- [x] Sistem keluhan
- [x] CMS artikel & diskusi
- [x] Dashboard admin dengan analitik dasar

### 🚧 Version 1.1 - Q1 2026

- [ ] Progressive Web App (PWA)
  - Offline functionality
  - Install prompt
  - Push notifications
- [ ] Mobile responsive improvements
- [ ] Notifikasi real-time
  - Status keluhan update
  - Artikel baru
  - Reminder laporan panen

### 🔮 Version 1.2 - Q2 2026

- [ ] Advanced analytics
  - Prediksi hasil panen
  - Rekomendasi tanaman
  - Analisis cuaca historis
- [ ] Export data ke Excel/PDF
- [ ] Batch import lahan via CSV
- [ ] Multi-language support (Jawa/Indonesia)

### 🌟 Version 2.0 - Q3 2026

- [ ] Integrasi API pihak ketiga
  - Weather API
  - Market price API
  - Soil data API
- [ ] Machine Learning features
  - Disease detection from photos
  - Yield prediction
- [ ] Mobile native apps (React Native)
- [ ] Blockchain untuk traceability

---

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Berikut panduan untuk berkontribusi:

### How to Contribute

1. **Fork** repository ini
2. **Clone** fork Anda
   ```bash
   git clone https://github.com/YOUR_USERNAME/sipadi.git
   ```
3. **Create branch** untuk fitur baru
   ```bash
   git checkout -b feature/AmazingFeature
   ```
4. **Commit** perubahan Anda
   ```bash
   git commit -m 'feat: Add some AmazingFeature'
   ```
5. **Push** ke branch
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open Pull Request** di GitHub

### Contribution Guidelines

- Ikuti code style yang sudah ada (ESLint + Prettier)
- Tulis commit message yang descriptive
- Tambahkan tests untuk fitur baru
- Update dokumentasi jika perlu
- Pastikan semua tests passing sebelum PR

### Code Review Process

1. Maintainer akan review PR dalam 48 jam
2. Diskusi & feedback via PR comments
3. Revisi jika diperlukan
4. Merge setelah approval

---

## 📄 Lisensi

Project ini dilisensikan di bawah **MIT License**. 

```
MIT License

Copyright (c) 2025 Sipadi Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Kontak & Support

- **Email**: support@sipadi.com
- **GitHub Issues**: [github.com/yourusername/sipadi/issues](https://github.com/yourusername/sipadi/issues)
- **Documentation**: [docs.sipadi.com](https://docs.sipadi.com)

---

## 🙏 Acknowledgments

- [hagopj13](https://github.com/hagopj13) untuk backend starter kit yang luar biasa
- [theodorusclarence](https://github.com/theodorusclarence) untuk frontend starter kit
- Dinas Pertanian Kabupaten Demak untuk dukungan dan feedback
- Semua petani yang telah memberikan input berharga

---

<p align="center">
  Dibuat dengan ❤️ untuk memajukan pertanian Indonesia
</p>

<p align="center">
  <strong>Sipadi - Digitalisasi Pertanian untuk Indonesia Maju</strong>
</p>