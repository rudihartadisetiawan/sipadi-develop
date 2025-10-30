### BAB III: HASIL DAN PEMBAHASAN

Bab ini menyajikan hasil implementasi teknis dari sistem backend "SIPADI" dan membahas bagaimana hasil tersebut menjawab rumusan masalah yang telah ditetapkan. Pembahasan mencakup arsitektur sistem yang diterapkan, implementasi RESTful API, pengelolaan data geospasial, hingga aspek keamanan.

---

#### **3.1 Arsitektur Sistem Backend**

Sistem backend SIPADI dibangun dengan mengikuti prinsip-prinsip rekayasa perangkat lunak modern untuk memastikan kode yang terstruktur, mudah dikelola, dan skalabel. Arsitektur ini didasarkan pada pola desain *Model-View-Controller* (MVC) yang dimodifikasi untuk konteks RESTful API.

**1. Struktur Direktori Proyek**

Untuk menerapkan *Separation of Concerns*, proyek backend diorganisir ke dalam struktur direktori yang logis. Setiap direktori memiliki tanggung jawab yang jelas:

```
/src
|-- /config         # Konfigurasi (database, passport, logger)
|-- /controllers    # Logika untuk menangani request dan response
|-- /docs           # Konfigurasi Swagger untuk dokumentasi API
|-- /middlewares    # Middleware (penanganan error, autentikasi)
|-- /models         # Definisi skema data (Sequelize Models)
|-- /routes         # Definisi endpoint API dan routing
|-- /services       # Logika bisnis utama (terpisah dari controller)
|-- /utils          # Fungsi-fungsi bantuan (helper functions)
|-- /validations    # Skema validasi input (menggunakan Joi)
|-- app.js          # Titik masuk utama aplikasi Express
|-- index.js        # Inisialisasi server
```

Struktur ini memisahkan logika database (Models), logika bisnis (Services), dan logika penanganan HTTP (Controllers), membuat aplikasi lebih modular dan mudah untuk diuji.

**2. Implementasi Pola MVC (Model-Service-Controller)**

Dalam konteks API, pola MVC diadaptasi menjadi **Model-Service-Controller**. *Service layer* ditambahkan untuk menampung logika bisnis yang kompleks, sehingga *Controller* tetap ramping dan hanya bertanggung jawab untuk orkestrasi alur data.

*   **Model:** Merepresentasikan struktur data aplikasi. Model didefinisikan menggunakan Sequelize ORM, yang memetakan tabel-tabel di database PostgreSQL ke dalam objek JavaScript. Contoh di bawah adalah model untuk `Lahan`, yang mencakup kolom `geom` untuk data geospasial.

    *Contoh Kode: `lahan.model.js`*
    ```javascript
    const { DataTypes } = require('sequelize');
    const sequelize = require('../config/database');

    const Lahan = sequelize.define('Lahan', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_lahan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      luas_lahan: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      // Kolom untuk menyimpan data geospasial (batas lahan)
      geom: {
        type: DataTypes.GEOMETRY('POLYGON', 4326),
        allowNull: false,
      },
      // ... kolom lainnya
    });

    module.exports = Lahan;
    ```

*   **Service:** Berisi logika bisnis inti. Misalnya, saat membuat lahan baru, *service* akan memastikan bahwa data yang masuk valid dan memformatnya sebelum disimpan ke database oleh *model*.

*   **Controller:** Bertindak sebagai jembatan antara klien dan aplikasi. Controller menerima permintaan HTTP, memanggil *service* yang sesuai, dan memformat respons JSON yang akan dikirim kembali ke klien.

    *Contoh Kode: `lahan.controller.js`*
    ```javascript
    const lahanService = require('../services/lahan.service');

    const createLahan = async (req, res) => {
      try {
        // Data lahan, termasuk GeoJSON dari body request
        const lahanData = req.body;
        const newLahan = await lahanService.createLahan(lahanData);
        res.status(201).json({
          message: 'Lahan berhasil ditambahkan',
          data: newLahan,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
    ```

**3. Alur Kerja Permintaan (Request Flow)**

Sebuah permintaan dari klien (aplikasi frontend) akan melewati serangkaian komponen sebelum menghasilkan respons:

1.  **Routing (`/routes`):** Permintaan `POST /v1/lahan` pertama kali diterima oleh router Express, yang kemudian meneruskannya ke controller yang sesuai (`lahan.controller.js`).
2.  **Middleware (`/middlewares`):** Sebelum mencapai controller, permintaan melewati middleware autentikasi (`auth.js`) untuk memverifikasi token JWT pengguna. Jika token tidak valid, proses dihentikan dan respons `401 Unauthorized` dikirim.
3.  **Validation (`/validations`):** Skema validasi Joi memeriksa apakah `req.body` berisi semua data yang diperlukan dengan format yang benar.
4.  **Controller (`/controllers`):** `lahanController.createLahan` menerima permintaan yang sudah divalidasi.
5.  **Service (`/services`):** Controller memanggil `lahanService.createLahan` dengan data dari request. Service memproses logika bisnis.
6.  **Model (`/models`):** Service menggunakan model Sequelize (`Lahan.create()`) untuk menyimpan data ke database PostgreSQL.
7.  **Response:** Alur kembali ke Controller, yang kemudian mengirimkan respons JSON dengan status `201 Created` ke klien.

---

#### **3.2 Implementasi RESTful API**

Backend menyediakan serangkaian RESTful API yang fungsional untuk melayani semua kebutuhan fitur aplikasi. Pengujian API dilakukan secara sistematis menggunakan **Postman** untuk memastikan setiap endpoint bekerja sesuai harapan.

**1. Dokumentasi dan Contoh Endpoint API**

Berikut adalah beberapa contoh endpoint kunci yang telah diimplementasikan:

| Fitur | Metode | Endpoint | Deskripsi | Membutuhkan Autentikasi |
| :--- | :--- | :--- | :--- | :--- |
| Registrasi User | `POST` | `/v1/auth/register` | Mendaftarkan pengguna baru (petani). | Tidak |
| Login User | `POST` | `/v1/auth/login` | Autentikasi pengguna & mendapatkan token JWT. | Tidak |
| Menambah Lahan | `POST` | `/v1/lahan` | Membuat data lahan baru (termasuk geospasial). | Ya |
| Mengambil Semua Lahan | `GET` | `/v1/lahan` | Mengambil daftar semua lahan dalam format GeoJSON. | Ya |
| Mengajukan Keluhan | `POST` | `/v1/keluhan` | Mengirim laporan keluhan baru dari petani. | Ya |
| Melihat Detail Keluhan | `GET` | `/v1/keluhan/:id` | Mengambil detail spesifik dari sebuah keluhan. | Ya |
| Mengelola Artikel | `POST` | `/v1/artikel` | (Admin) Membuat artikel atau berita baru. | Ya (Admin) |

**2. Contoh Pengujian API: Menambahkan Lahan Baru**

Pengujian untuk fitur penambahan lahan menunjukkan alur kerja API secara keseluruhan.

*   **Langkah 1: Autentikasi:** Pengguna melakukan `POST` ke `/v1/auth/login` dengan email dan password. Server merespons dengan token JWT.

*   **Langkah 2: Mengirim Request Ter-autentikasi:** Klien mengirim request `POST` ke `/v1/lahan`.
    *   **Headers:** `Authorization` diisi dengan `Bearer <token_jwt>`.
    *   **Body:** Berisi data lahan dalam format JSON, termasuk objek `geom` dalam format GeoJSON.

    *Contoh Body Request di Postman:*
    ```json
    {
      "nama_lahan": "Sawah Blok C",
      "luas_lahan": 1.5,
      "pemilik_id": 12,
      "geom": {
        "type": "Polygon",
        "coordinates": [
          [
            [110.643, -6.878],
            [110.644, -6.879],
            [110.645, -6.878],
            [110.643, -6.878]
          ]
        ]
      }
    }
    ```

*   **Langkah 3: Menerima Respons:** Server memproses permintaan dan jika berhasil, akan mengembalikan respons `201 Created` beserta data lahan yang baru dibuat.

    *Contoh Respons dari Server:*
    ```json
    {
      "message": "Lahan berhasil ditambahkan",
      "data": {
        "id": 5,
        "nama_lahan": "Sawah Blok C",
        "luas_lahan": 1.5,
        "geom": {
          "type": "Polygon",
          "coordinates": [
            [
              [110.643, -6.878],
              [110.644, -6.879],
              [110.645, -6.878],
              [110.643, -6.878]
            ]
          ]
        },
        "createdAt": "2025-10-29T10:00:00.000Z",
        "updatedAt": "2025-10-29T10:00:00.000Z"
      }
    }
    ```
Hasil pengujian ini memvalidasi bahwa endpoint penambahan lahan berfungsi dengan benar, mulai dari autentikasi, validasi input, hingga penyimpanan data geospasial.

---

#### **3.3 Pengelolaan Data Geospasial dengan PostGIS**

Salah satu tujuan utama proyek ini adalah mengelola data lokasi lahan secara efisien. Ini berhasil dicapai dengan mengintegrasikan **PostgreSQL + PostGIS** dengan **Sequelize**.

**1. Penyimpanan Data Geospasial**

Data batas lahan pertanian, yang merupakan sebuah poligon, disimpan menggunakan tipe data `GEOMETRY` yang disediakan oleh PostGIS. Pada definisi model Sequelize, tipe data ini dideklarasikan sebagai `DataTypes.GEOMETRY('POLYGON', 4326)`. Angka `4326` adalah SRID (Spatial Reference System Identifier) untuk WGS 84, sistem koordinat standar yang digunakan oleh GPS dan peta web.

**2. Operasi CRUD pada Data Geospasial**

Sequelize, dikombinasikan dengan `sequelize-postgis`, mampu menangani operasi CRUD pada data geospasial secara transparan.

*   **Create/Update:** Saat klien mengirimkan data lahan baru dalam format GeoJSON (seperti pada contoh di 3.2), service backend langsung meneruskannya ke model Sequelize. Sequelize secara otomatis mengonversi objek GeoJSON tersebut menjadi format WKT (Well-Known Text) yang dapat dipahami dan disimpan oleh PostGIS di dalam kolom `geom`.

*   **Read:** Saat klien melakukan `GET` ke `/v1/lahan`, backend mengambil data dari PostgreSQL. PostGIS mengembalikan data geometri dalam format internalnya, dan Sequelize secara otomatis mengonversinya kembali menjadi format GeoJSON. Hasilnya, API dapat menyajikan data yang siap divisualisasikan oleh library frontend seperti Leaflet atau Mapbox.

Endpoint `GET /v1/lahan` dirancang untuk mengembalikan seluruh koleksi lahan sebagai satu objek `FeatureCollection` GeoJSON, yang merupakan format standar untuk menampilkan banyak fitur di peta.

*Contoh Respons `GET /v1/lahan` (Format GeoJSON FeatureCollection):*
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [/* ... */]
      },
      "properties": {
        "id": 1,
        "nama_lahan": "Sawah Utama",
        "luas": 2.0
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [/* ... */]
      },
      "properties": {
        "id": 2,
        "nama_lahan": "Tegalrejo",
        "luas": 1.2
      }
    }
  ]
}
```
Format ini secara langsung menjawab kebutuhan frontend untuk visualisasi data spasial, membuktikan bahwa integrasi antara Node.js dan PostGIS berhasil diimplementasikan.

---

#### **3.4 Implementasi Keamanan**

Keamanan sistem diimplementasikan pada beberapa lapisan untuk melindungi data dan memastikan hanya pengguna yang berwenang yang dapat mengakses fungsionalitas tertentu.

**1. Autentikasi Menggunakan JSON Web Tokens (JWT)**

Setiap endpoint yang memerlukan hak akses dilindungi oleh middleware autentikasi.

*   **Alur Kerja:**
    1.  Pengguna mengirimkan kredensial (email/password) ke endpoint `/v1/auth/login`.
    2.  Server memvalidasi kredensial. Jika valid, server membuat sebuah JWT yang berisi *payload* (misalnya, `id` dan `role` pengguna) dan menandatanganinya dengan sebuah *secret key*.
    3.  Token ini dikirim kembali ke klien.
    4.  Untuk setiap permintaan selanjutnya ke endpoint yang dilindungi, klien wajib menyertakan token ini dalam *header* `Authorization` dengan skema `Bearer`.
    5.  Middleware `auth.js` di sisi server akan mengekstrak, memverifikasi tanda tangan, dan memeriksa masa berlaku token. Jika semua valid, data pengguna dari *payload* token akan ditambahkan ke objek `request` dan permintaan diteruskan ke controller.

**2. Otorisasi Berbasis Peran (Role-Based Access Control)**

Selain autentikasi, sistem juga menerapkan otorisasi untuk membatasi akses berdasarkan peran pengguna (misalnya, `petani` vs `admin`).

*   **Implementasi:** Middleware otorisasi dibuat untuk memeriksa peran pengguna yang telah diekstrak dari token JWT. Middleware ini dipasang pada rute-rute yang hanya boleh diakses oleh peran tertentu.

    *Contoh Kode: Middleware Otorisasi*
    ```javascript
    const authorize = (roles) => (req, res, next) => {
      // Ambil peran dari objek request yang sudah diisi oleh middleware auth
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Access is denied' });
      }
      next();
    };

    // Penggunaan pada router
    // Hanya admin yang bisa mengakses endpoint ini
    router.post('/artikel', auth, authorize(['admin']), artikelController.createArtikel);
    ```
Pengujian menunjukkan bahwa pengguna dengan peran `petani` akan menerima respons `403 Forbidden` jika mencoba mengakses endpoint yang dikhususkan untuk `admin`.

**3. Keamanan Data**

*   **Password Hashing:** Password pengguna tidak pernah disimpan dalam bentuk teks biasa. Library `bcrypt` digunakan untuk melakukan *hashing* pada password sebelum disimpan ke database, sehingga aman dari pembacaan jika terjadi kebocoran data.
*   **Validasi Input:** Semua input dari klien divalidasi menggunakan library `Joi` untuk mencegah serangan umum seperti *injection* (meskipun ORM sudah memberikan lapisan proteksi terhadap SQL Injection).
