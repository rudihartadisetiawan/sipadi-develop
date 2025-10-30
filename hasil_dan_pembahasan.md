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

*   **Model:** Merepresentasikan struktur data aplikasi. Model didefinisikan menggunakan Sequelize ORM, yang memetakan tabel-tabel di database PostgreSQL ke dalam objek JavaScript.
*   **Service:** Berisi logika bisnis inti. Misalnya, saat membuat lahan baru, *service* akan memastikan bahwa data yang masuk valid dan memformatnya sebelum disimpan ke database oleh *model*.
*   **Controller:** Bertindak sebagai jembatan antara klien dan aplikasi. Controller menerima permintaan HTTP, memanggil *service* yang sesuai, dan memformat respons JSON yang akan dikirim kembali ke klien.

**3. Alur Kerja Permintaan (Request Flow)**

Sebuah permintaan dari klien (aplikasi frontend) akan melewati serangkaian komponen sebelum menghasilkan respons:

1.  **Routing (`/routes`):** Permintaan `POST /v1/lahan` pertama kali diterima oleh router Express, yang kemudian meneruskannya ke controller yang sesuai (`lahan.controller.js`).
2.  **Middleware (`/middlewares`):** Sebelum mencapai controller, permintaan melewati middleware autentikasi (`auth.js`) untuk memverifikasi token JWT pengguna.
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

*   **Langkah 1: Autentikasi:** Pengguna melakukan `POST` ke `/v1/auth/login` dengan NIK dan password. Server merespons dengan token JWT.
*   **Langkah 2: Mengirim Request Ter-autentikasi:** Klien mengirim request `POST` ke `/v1/lahan` dengan menyertakan token pada *header* `Authorization` dan data lahan pada *body*.
*   **Langkah 3: Menerima Respons:** Server memproses permintaan dan jika berhasil, akan mengembalikan respons `201 Created` beserta data lahan yang baru dibuat.

---

#### **3.3 Pengelolaan Data Geospasial dengan PostGIS**

Salah satu tujuan utama proyek ini adalah mengelola data lokasi lahan secara efisien. Ini berhasil dicapai dengan mengintegrasikan **PostgreSQL + PostGIS** dengan **Sequelize**.

**1. Penyimpanan Data Geospasial**

Data batas lahan pertanian (poligon) dan lokasi toko (titik) disimpan menggunakan tipe data `GEOMETRY` dari PostGIS. Pada definisi model Sequelize, tipe data ini dideklarasikan sebagai `DataTypes.GEOMETRY('POLYGON', 4326)` untuk lahan dan `DataTypes.GEOMETRY('POINT', 4326)` untuk toko. Angka `4326` adalah SRID (Spatial Reference System Identifier) untuk WGS 84, sistem koordinat standar yang digunakan oleh GPS dan peta web.

**2. Operasi CRUD pada Data Geospasial**

Sequelize menangani operasi CRUD pada data geospasial secara transparan. Saat klien mengirimkan data dalam format GeoJSON, Sequelize otomatis mengonversinya ke format yang dapat dipahami PostGIS. Sebaliknya, saat data dibaca, Sequelize mengonversinya kembali ke GeoJSON, sehingga siap divisualisasikan oleh library frontend seperti Leaflet atau Mapbox.

---

#### **3.4 Implementasi Keamanan**

Keamanan sistem diimplementasikan pada beberapa lapisan untuk melindungi data dan memastikan hanya pengguna yang berwenang yang dapat mengakses fungsionalitas tertentu.

**1. Autentikasi Menggunakan JSON Web Tokens (JWT)**

Setiap endpoint yang memerlukan hak akses dilindungi oleh middleware autentikasi. Alurnya dimulai dari login, mendapatkan token, hingga menyertakan token tersebut di setiap *request* untuk divalidasi oleh server.

**2. Otorisasi Berbasis Peran (Role-Based Access Control)**

Selain autentikasi, sistem juga menerapkan otorisasi untuk membatasi akses berdasarkan peran pengguna (`petani` vs `admin`). Middleware otorisasi memeriksa peran pengguna yang didapat dari token JWT dan menolak akses jika tidak sesuai, seperti pada endpoint yang hanya boleh diakses admin (`POST /v1/artikel`).

**3. Keamanan Data**

*   **Password Hashing:** Password pengguna di-hash menggunakan `bcrypt` sebelum disimpan ke database.
*   **Validasi Input:** Semua input dari klien divalidasi menggunakan `Joi` untuk mencegah serangan umum seperti *injection*.

---

#### **3.5 Implementasi Fitur Fungsional**

Bagian ini membahas implementasi dari fitur-fitur fungsional inti yang menjadi tujuan utama dari Sistem Informasi dan Digitalisasi Lahan Pertanian (Sipadi).

**3.5.1 Manajemen Pengguna dan Otentikasi**

Fitur fundamental dalam sistem Sipadi adalah manajemen pengguna dan proses otentikasi yang aman. Fitur ini memastikan bahwa setiap pengguna memiliki identitas yang unik dan hak akses yang sesuai dengan perannya.

*   **Model Data `User`**: Data pengguna direpresentasikan oleh model `User` yang dikelola oleh Sequelize. Atribut pentingnya meliputi `nik` (unik, untuk login), `name`, `email`, `role` (`petani` atau `admin`), dan `password_hash` yang di-enkripsi menggunakan `bcryptjs`.
*   **Proses Otentikasi**: Proses ini ditangani oleh endpoint `/v1/auth` untuk registrasi (`/register`) dan login (`/login`). Proses login yang berhasil akan menghasilkan JWT sebagai kunci akses.
*   **Manajemen Pengguna (CRUD)**: Fungsionalitas CRUD untuk data pengguna disediakan melalui endpoint `/v1/users` dan hanya dapat diakses oleh `admin` untuk memastikan keamanan dan integritas data.

**3.5.2 Manajemen Lahan**

Fitur manajemen lahan adalah pusat dari proses digitalisasi. Fitur ini memungkinkan petani untuk mendaftarkan dan mengelola lahan pertanian mereka secara digital, lengkap dengan data spasial (peta) dan data atribut lainnya.

*   **Model Data `Lahan`**: Setiap lahan direpresentasikan oleh model `Lahan` dengan atribut kunci seperti `user_id` (pemilik), `nama_lahan`, `luas`, dan `geometry` (poligon PostGIS). Model ini juga menyimpan status lahan (`aktif`, `bera`, `bermasalah`) dan detail lokasi.
*   **Implementasi Fitur**: Fungsionalitas ini diekspos melalui endpoint `/v1/lahan`. Petani dapat melakukan operasi CRUD pada lahan miliknya. Sistem memastikan hanya pemilik lahan yang sah yang dapat mengubah atau menghapus datanya. Terdapat juga endpoint khusus untuk admin (`/v1/lahan/all`) untuk melihat semua lahan terdaftar.

**3.5.3 Manajemen Panen**

Fitur ini memungkinkan petani untuk mencatat data hasil panen dari setiap lahan yang mereka miliki, yang berharga untuk analisis produktivitas.

*   **Model Data `Panen`**: Terhubung dengan model `Lahan`, model `Panen` mencatat `tanggal_panen`, `jumlah_panen`, dan `kualitas` hasil panen.
*   **Implementasi Fitur**: Melalui endpoint `/v1/panen`, petani dapat mencatat dan melihat riwayat panen. Backend juga menyediakan endpoint analitik seperti `/v1/panen/statistik` untuk admin (menggunakan agregasi `SUM`, `AVG`) dan `/v1/panen/trend/:lahanId` untuk petani melihat tren produktivitas lahannya.

**3.5.4 Manajemen Keluhan**

Fitur ini berfungsi sebagai jembatan komunikasi antara petani dan admin. Petani dapat melaporkan masalah di lapangan untuk mendapatkan solusi.

*   **Model Data `Keluhan`**: Model ini menghubungkan `User` dan `Lahan`, serta mencatat `kategori` keluhan, `deskripsi`, `foto_bukti` (disimpan sebagai JSON), `status` (`pending`, `diproses`, `selesai`), dan `tanggapan` dari admin.
*   **Implementasi Fitur**: Endpoint `/v1/keluhan` memungkinkan petani membuat dan melihat keluhannya. Admin dapat melihat semua keluhan dan, yang terpenting, hanya admin yang bisa mengubah status dan memberi tanggapan melalui `PATCH /v1/keluhan/:keluhanId`.

**3.5.5 Manajemen Artikel dan Konten Edukasi**

Sistem menyediakan platform untuk berbagi pengetahuan melalui artikel yang dikelola oleh admin.

*   **Model Data `Artikel` dan `Komentar`**: Model `Artikel` memiliki flag `published` untuk kontrol perilisan konten. Model `Komentar` mendukung diskusi berantai (*threaded comments*) melalui `parent_id`.
*   **Implementasi Fitur**: Manajemen artikel di `/v1/artikel` dibatasi untuk admin. Pengguna publik hanya bisa melihat artikel yang sudah `published`. Sistem juga menyediakan endpoint untuk interaksi seperti menambah komentar dan menghitung jumlah `views` artikel.

**3.5.6 Direktori Toko Pertanian**

Fitur ini membantu petani menemukan lokasi toko kebutuhan pertanian melalui peta.

*   **Model Data `TokoPertanian`**: Model ini menyimpan `nama_toko` dan `geometry` dengan tipe `POINT` untuk menandai lokasi toko di peta.
*   **Implementasi Fitur**: Data toko dikelola oleh admin melalui `/v1/toko`. Endpoint untuk melihat daftar toko (`GET /v1/toko`) bersifat publik dan secara default hanya menampilkan toko yang `aktif`, memudahkan integrasi dengan fitur peta di frontend.

---

#### **3.6 Kesimpulan Hasil dan Pembahasan**

Dari hasil implementasi dan pembahasan yang telah diuraikan, dapat disimpulkan bahwa sistem backend untuk aplikasi "SIPADI" telah berhasil dibangun sesuai dengan perancangan. Arsitektur sistem yang modular dengan pola *Model-Service-Controller* berhasil diterapkan menggunakan Node.js, Express.js, dan Sequelize, menghasilkan fondasi yang kokoh dan mudah untuk dikembangkan lebih lanjut. Seluruh fitur fungsional utama—mulai dari manajemen pengguna, digitalisasi lahan berbasis geospasial dengan PostGIS, pencatatan panen, sistem keluhan, hingga penyebaran konten edukasi melalui artikel—telah berhasil diimplementasikan melalui RESTful API yang terstruktur. Aspek non-fungsional seperti keamanan melalui otentikasi JWT, otorisasi berbasis peran, dan validasi input juga telah diterapkan untuk menjamin integritas dan keamanan data. Dengan demikian, backend ini telah siap dan mampu menyediakan semua layanan yang dibutuhkan untuk mendukung fungsionalitas aplikasi di sisi frontend serta menjawab tujuan utama dari proyek Sistem Informasi dan Digitalisasi Lahan Pertanian.