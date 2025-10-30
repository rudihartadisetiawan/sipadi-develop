BAB II
LANDASAN TEORI

Landasan berisi teori:teori, landasan, paradigma, cara pandang; metode – metode yang telah ada dan atau akan digunakan, atau konsep yang telah diuji kebenarannya. Buat Sub Bab yang diperlukan.

2.1 Transformasi Digital di Sektor Pertanian (Agritech)
Transformasi digital telah merambah ke berbagai sektor, tidak terkecuali pertanian. Adaptasi teknologi di sektor ini melahirkan istilah Agritech (Agricultural Technology), yang menjadi solusi modern untuk tantangan pertanian konvensional.

2.1.1. Pengertian Agritech
Agritech adalah istilah yang mengacu pada penerapan teknologi, inovasi, dan prinsip-prinsip digital dalam rantai nilai sektor pertanian. Peran utamanya adalah untuk memodernisasi praktik pertanian tradisional—mulai dari persiapan lahan, penanaman, pemantauan, panen, hingga distribusi pasca-panen.
Dengan memanfaatkan teknologi seperti Internet of Things (IoT), big data, kecerdasan buatan (AI), dan sistem informasi terintegrasi, agritech bertujuan untuk meningkatkan efisiensi operasional, mengoptimalkan penggunaan sumber daya (seperti air dan pupuk), meningkatkan produktivitas dan kualitas hasil panen, serta mendorong keberlanjutan lingkungan. Salah satu terobosan utama dalam Agritech adalah pemanfaatan **data geospasial** untuk pemetaan lahan presisi, yang memungkinkan analisis kondisi tanah dan perencanaan tanam yang lebih akurat.

2.1.2. Manfaat Sistem Informasi Pertanian
Dalam konteks permasalahan yang diangkat dalam laporan ini, pembangunan sistem informasi pertanian yang terstruktur memberikan manfaat signifikan untuk mengatasi tantangan operasional, terutama dalam hal manajemen data dan pelaporan. Manfaat utamanya meliputi:
1.  **Data Terpusat dan Terstruktur:** Sistem informasi menggantikan metode pencatatan manual yang tersebar dan tidak konsisten. Sistem ini menyediakan satu sumber kebenaran (single source of truth) dalam sebuah basis data terpusat, memudahkan proses validasi, pencarian, dan pengelolaan data terkait lahan, komoditas, petani, dan progres siklus tanam.
2.  **Pengambilan Keputusan Berbasis Data (Data-Driven Decision Making):** Dengan ketersediaan data yang akurat dan real-time, pemangku kepentingan (seperti manajer perkebunan atau dinas pertanian) dapat beralih dari pengambilan keputusan berbasis intuisi ke berbasis fakta. Analisis data historis dan data terkini dapat membantu mengidentifikasi tren, memprediksi hasil panen, dan mengalokasikan sumber daya dengan lebih efektif.
3.  **Efisiensi Pelaporan:** Proses rekapitulasi data dan pembuatan laporan yang sebelumnya memakan waktu dan rentan terhadap human error dapat diotomatisasi. Sistem dapat dikonfigurasi untuk menghasilkan laporan berkala (harian, mingguan, bulanan) secara instan, memungkinkan tim manajemen untuk fokus pada analisis dan strategi, bukan pada kompilasi data manual.

2.2 Arsitektur Sistem Backend
Backend berfungsi sebagai "otak" dari aplikasi, menangani logika bisnis, pemrosesan data, dan komunikasi dengan database. Arsitektur yang baik sangat penting untuk memastikan sistem yang skalabel dan mudah dikelola.

2.2.1. RESTful API (Representational State Transfer)
Inti dari sistem backend yang dibangun adalah Application Programming Interface (API) yang mengadopsi gaya arsitektur REST (Representational State Transfer). REST adalah sekumpulan prinsip desain untuk membangun layanan web yang ringan, cepat, dan mudah diskalakan. Prinsip-prinsip dasar REST meliputi:
*   **Arsitektur Client-Server:** Terdapat pemisahan yang jelas antara klien (yang meminta data) dan server (yang menyediakan data).
*   **Stateless (Tanpa Status):** Setiap permintaan dari klien harus berisi semua informasi yang diperlukan server untuk memproses permintaan tersebut. Server tidak menyimpan status sesi klien.
*   **Cacheable (Dapat Di-cache):** Respons dari server dapat ditandai sebagai cacheable untuk mengurangi latensi dan beban server.
*   **Sistem Berlapis (Layered System):** Klien tidak perlu tahu apakah ia terhubung langsung ke server akhir atau melalui perantara.

Dalam implementasinya, RESTful API memanfaatkan metode HTTP standar untuk operasi CRUD (Create, Read, Update, Delete) terhadap sumber daya, dengan format data umumnya menggunakan JSON (JavaScript Object Notation).

2.2.2. Pola Desain Model-Service-Controller
Untuk memastikan kode aplikasi terstruktur, penelitian ini mengadopsi pola desain **Model-Service-Controller**, sebuah adaptasi dari pola MVC (Model-View-Controller) yang umum digunakan untuk pengembangan API.
1.  **Model:** Merepresentasikan data dan logika bisnis inti. Komponen ini bertanggung jawab langsung untuk berinteraksi dengan database (mengambil, menyimpan, memperbarui data).
2.  **View:** Dalam konteks RESTful API, "View" bukanlah halaman HTML, melainkan representasi data yang dikirim kembali ke klien, umumnya dalam format JSON.
3.  **Controller:** Bertindak sebagai penghubung antara klien dan aplikasi. Controller menerima permintaan HTTP, memanggil *service* yang sesuai, dan memformat *view* (respons JSON) yang akan dikembalikan.

Justifikasi utama dari adaptasi ini adalah penambahan **Service Layer** sebagai komponen terpisah. *Service Layer* secara eksplisit ditambahkan untuk menampung logika bisnis yang kompleks. Hal ini memastikan *Controller* tetap ramping dan hanya bertanggung jawab pada alur permintaan dan respons HTTP. Dengan memisahkan logika bisnis ke dalam *service*, kode menjadi lebih modular, dapat digunakan kembali (*reusable*) di beberapa *controller*, dan lebih mudah untuk diuji secara terisolasi (*unit testing*).

2.3 Teknologi yang Digunakan

2.3.1. Node.js
Node.js adalah runtime environment JavaScript sisi server yang dibangun di atas mesin V8 Google. Keunggulan utamanya adalah arsitektur event-driven dan non-blocking I/O, yang membuatnya sangat efisien untuk aplikasi yang menangani banyak koneksi secara bersamaan seperti RESTful API.

2.3.2. Express.js
Express.js adalah kerangka kerja (framework) web yang minimalis dan fleksibel untuk Node.js. Express.js menyediakan serangkaian fitur dasar yang kuat untuk menyederhanakan proses-proses fundamental dalam pengembangan backend, seperti Routing, Manajemen Middleware, dan Penanganan Permintaan/Respons.

2.3.3. PostgreSQL dan PostGIS
PostgreSQL dipilih sebagai sistem manajemen basis data relasional (RDBMS) karena dikenal andal, robust, dan patuh terhadap standar SQL. Untuk mendukung fitur inti proyek ini, digunakan **PostGIS**, sebuah ekstensi spasial untuk PostgreSQL. PostGIS memungkinkan database untuk memahami dan bekerja dengan objek geografis, seperti menyimpan tipe data `POINT` dan `POLYGON`, serta melakukan kueri spasial.

2.3.4. Sequelize
Sequelize adalah Object-Relational Mapper (ORM) berbasis Promise untuk Node.js. Sequelize berfungsi sebagai jembatan antara aplikasi dan database, memungkinkan developer untuk berinteraksi dengan tabel database menggunakan objek dan metode JavaScript, yang secara signifikan mengurangi kompleksitas penulisan kueri SQL manual.

2.4 Keamanan Sistem Backend
Keamanan merupakan aspek non-fungsional yang krusial dalam perancangan sistem backend untuk melindungi data dan memastikan integritas layanan.

2.4.1. Autentikasi dan Otorisasi
Autentikasi adalah proses verifikasi identitas pengguna, sedangkan otorisasi adalah proses menentukan hak aksesnya.
*   **Autentikasi dengan JWT:** Sistem ini menggunakan **JSON Web Tokens (JWT)**. JWT adalah standar terbuka yang ringkas dan *self-contained* untuk mentransmisikan informasi antar pihak secara aman sebagai objek JSON. Token ini ditandatangani secara digital untuk memastikan keasliannya.
*   **Otorisasi dengan RBAC:** Otorisasi diimplementasikan menggunakan model **Role-Based Access Control (RBAC)**. Dalam model ini, hak akses tidak diberikan kepada pengguna secara individu, melainkan melalui peran (*role*) yang dimiliki pengguna tersebut, seperti `admin` atau `petani`. Middleware di sisi server akan memeriksa peran pengguna sebelum memberikan akses ke endpoint tertentu, memastikan hanya pengguna dengan peran yang sesuai yang dapat melakukan operasi sensitif.

2.4.2. Keamanan Data
Perlindungan data diterapkan pada dua fase:
*   **Data in Transit (Data dalam Perjalanan):** Komunikasi antara klien dan server diamankan menggunakan protokol HTTPS (Hypertext Transfer Protocol Secure), yang mengenkripsi data menggunakan Transport Layer Security (TLS) untuk mencegah penyadapan.
*   **Data at Rest (Data Tersimpan):** Data sensitif seperti password tidak pernah disimpan sebagai teks biasa. Teknik *hashing* menggunakan algoritma **bcrypt** diterapkan untuk mengubah password menjadi string acak yang tidak dapat dibalik (*irreversible*).

2.4.3. Pencegahan Serangan Umum
*   **SQL Injection:** Penggunaan ORM seperti Sequelize secara signifikan mengurangi risiko ini karena Sequelize menggunakan *prepared statements* (parameterisasi kueri) secara default, yang memisahkan data dari perintah SQL.
*   **Validasi Input Sisi Server:** Sebagai lapisan pertahanan pertama, semua input dari klien divalidasi secara ketat di sisi server menggunakan library **Joi**. Validasi ini memastikan bahwa data yang masuk memiliki format, tipe, dan batasan yang benar sebelum diproses lebih lanjut, mencegah data yang tidak valid atau berpotensi berbahaya masuk ke dalam sistem.
*   **Cross-Site Scripting (XSS):** Meskipun lebih sering menjadi masalah di frontend, validasi input yang ketat di backend juga membantu mencegah penyimpanan skrip berbahaya yang dapat dieksekusi di sisi klien.

2.5 Pengelolaan Data Geospasial
Fitur inti dari sistem ini adalah kemampuannya untuk mengelola data pemetaan lahan.

2.5.1. Konsep Data Spasial
Data spasial adalah data yang memiliki informasi lokasi geografis. Model data vektor adalah yang paling relevan untuk proyek ini, dengan tipe data yang umum digunakan meliputi:
*   **Point (Titik):** Merepresentasikan lokasi tunggal (misalnya, lokasi toko pertanian).
*   **Polygon (Poligon):** Serangkaian titik terhubung yang membentuk area tertutup, digunakan untuk merepresentasikan batas-batas petak lahan.

2.5.2. GeoJSON
GeoJSON adalah format standar terbuka berbasis JSON yang dirancang untuk merepresentasikan fitur geografis. Format ini sangat penting untuk interoperabilitas data geospasial di web. Dalam arsitektur sistem ini, backend mengonversi data geometri dari PostGIS ke format GeoJSON sebelum dikirim melalui API, sehingga klien dapat dengan mudah memvisualisasikannya di peta interaktif.