BAB I
PENDAHULUAN

1.1Latar Belakang
Ketahanan pangan merupakan salah satu pilar utama dalam menjaga stabilitas dan mendorong pembangunan nasional. Dalam upaya mendukung program strategis tersebut, Tentara Nasional Indonesia Angkatan Darat (TNI AD) menginisiasi sebuah program ketahanan pangan yang bersifat komprehensif. 
Seiring dengan berjalannya program, hasil identifikasi di lapangan menunjukkan bahwa proses manajemen data pertanian masih menghadapi berbagai tantangan. Proses pelaporan data krusial, seperti luas lahan tanam, estimasi dan realisasi hasil panen, serta keluhan petani (misalnya serangan hama, kegagalan panen, atau masalah irigasi), sebagian besar masih dilakukan secara manual dan kurang efficient.
Metode konvensional ini memiliki sejumlah kelemahan, antara lain data yang tidak terpusat, rentan terhadap kesalahan pencatatan, serta membutuhkan waktu lama untuk direkapitulasi dan dianalisis (Rizaldi & Hartono, 2022). Akibatnya, sering terjadi kesenjangan informasi antara petani di lapangan dengan dinas terkait yang bertugas mengambil keputusan. Ketiadaan sistem terintegrasi yang mampu menyajikan data secara real-time juga menghambat proses pemantauan kondisi agrikultur secara akurat (Putra, 2023). Kondisi tersebut dapat berdampak pada keterlambatan respons terhadap masalah kritis serta kesulitan dalam penyusunan strategi ketahanan pangan berbasis data.
Berdasarkan kondisi tersebut, dibutuhkan solusi digital yang mampu mengefisienkan pengelolaan data pertanian. Salah satu solusi yang diusulkan adalah digitalisasi manajemen data melalui pembangunan platform “SIPADI” (SISTEM INFORMASI DAN DIGITALISASI LAHAN PERTANIAN). Pemanfaatan teknologi informasi di sektor pertanian, atau yang dikenal sebagai agritech, diyakini dapat meningkatkan efisiensi dan efektivitas pengelolaan data (Wijaya, 2024). Sipadi dirancang sebagai sistem informasi terintegrasi berbasis web yang bertujuan untuk memodernisasi manajemen data pertanian serta menjembatani kesenjangan komunikasi antara petani dengan dinas terkait.
Aplikasi Sipadi merupakan bagian dari sistem informasi ketahanan pangan TNI AD yang berfungsi mendukung monitoring pertanian di tingkat daerah hingga nasional. Sebagai langkah awal, Kabupaten Demak dipilih sebagai lokasi percontohan (prototype) untuk implementasi dan pengembangan program ini. Dalam pelaksanaan kerja praktek ini, kami berfokus pada salah satu komponen paling krusial dari sistem tersebut, yaitu perancangan dan implementasi sistem backend. Komponen backend berperan sebagai “otak” aplikasi yang bertanggung jawab atas pengelolaan data, pemrosesan logika bisnis, manajemen keamanan, serta penyediaan Application Programming Interface (API) bagi aplikasi frontend.  

1.2Rumusan Masalah
Berdasarkan latar belakang di atas, maka rumusan masalah dalam pelaksanaan kerja praktek ini dapat dirumuskan sebagai berikut:
1.Bagaimana merancang arsitektur sistem backend yang mampu mengelola data agrikultur yang beragam secara efisien, meliputi data master (pengguna, lahan) dan data transaksional (panen, keluhan)?
2.Bagaimana membangun RESTful API yang aman, efisien, dan scalable menggunakan Node.js, Express.js, dan Sequelize (Hasan, 2022)?
3.Bagaimana mengimplementasikan pengelolaan data geospasial (lokasi lahan) di dalam basis data PostgreSQL dengan menggunakan ekstensi PostGIS (Obe & Hsu, 2021) agar data tersebut dapat divisualisasikan pada peta?

1.3Batasan Masalah
Untuk menjaga agar pembahasan dalam laporan ini tetap fokus dan mendalam, kami menetapkan batasan masalah sebagai berikut:
1.Pekerjaan ini berfokus pada perancangan dan implementasi sistem backend (sisi server), yang mencakup perancangan basis data, logika bisnis, dan pengembangan endpoint API.
2.Laporan ini tidak akan membahas secara mendalam perancangan atau implementasi sistem frontend (sisi klien atau antarmuka pengguna), yang dikerjakan oleh bagian lain dalam tim proyek.
3.Teknologi yang digunakan untuk backend dibatasi pada runtime environment Node.js, framework Express.js, database PostgreSQL dengan ekstensi PostGIS, dan Object-Relational Mapping (ORM) Sequelize.
4.Sistem yang dikembangkan merupakan prototype yang difokuskan untuk studi kasus di wilayah Kabupaten Demak.
5.Pembahasan tidak mencakup proses deployment (penyebaran) dan pemeliharaan server di lingkungan produksi.

1.4Tujuan Penelitian
Selaras dengan rumusan masalah di atas, tujuan dari pelaksanaan Kerja Praktek yang kami lakukan adalah:
1.Menghasilkan rancangan arsitektur backend yang terstruktur dengan mengadopsi pola desain Model-View-Controller (MVC) untuk aplikasi Sipadi (Freeman & Robson, 2020).
2.Mengimplementasikan RESTful API yang fungsional untuk melayani semua kebutuhan fitur aplikasi, termasuk autentikasi pengguna, manajemen data lahan, pelaporan panen, dan penanganan keluhan.
3.Menerapkan penggunaan Sequelize yang terintegrasi dengan PostGIS untuk melakukan operasi Create, Read, Update, Delete (CRUD) pada data yang bersifat geospasial.

1.5Manfaat Penelitian
Hasil dari Kerja Praktek ini diharapkan dapat memberikan manfaat sebagai berikut:
1.Bagi Mitra INFOLAHTA KODAM IV/DIPONEGORO: Menyediakan infrastruktur backend yang siap pakai dan fungsional sebagai fondasi utama aplikasi Sipadi. Backend ini dapat segera diintegrasikan dengan frontend untuk mendukung digitalisasi program ketahanan pangan secara efektif.
2.Bagi Bidang Ilmu (Akademisi): Memberikan studi kasus praktis dan referensi teknis mengenai implementasi stack teknologi modern (Node.js, PostGIS, Sequelize) dalam penyelesaian masalah nyata di sektor agritech (teknologi pertanian) di Indonesia.
3.Bagi kami dan Mahasiswa Lain: Menjadi portofolio dan bukti kompetensi teknis dalam membangun sistem backend yang kompleks, khususnya dalam menangani data geospasial. Selain itu, laporan ini dapat menjadi referensi bagi mahasiswa lain yang tertarik mengambil topik serupa dan menambah pengalaman praktis dalam siklus pengembangan perangkat lunak.


BAB II
LANDASAN TEORI

Landasan berisi teori:teori, landasan, paradigma, cara pandang; metode – metode yang telah ada dan atau akan digunakan, atau konsep yang telah diuji kebenarannya. Buat Sub Bab yang diperlukan.

2.1Transformasi Digital di Sektor Pertanian (Agritech)
Transformasi digital telah merambah ke berbagai sektor, tidak terkecuali pertanian. Adaptasi teknologi di sektor ini melahirkan istilah Agritech (Agricultural Technology), yang menjadi solusi modern untuk tantangan pertanian konvensional.
2.1.1.Pengertian Agritech
Agritech adalah istilah yang mengacu pada penerapan teknologi, inovasi, dan prinsip-prinsip digital dalam rantai nilai sektor pertanian. Peran utamanya adalah untuk memodernisasi praktik pertanian tradisional—mulai dari persiapan lahan, penanaman, pemantauan, panen, hingga distribusi pasca-panen.
Dengan memanfaatkan teknologi seperti Internet of Things (IoT), big data, kecerdasan buatan (AI), dan sistem informasi terintegrasi, agritech bertujuan untuk meningkatkan efisiensi operasional, mengoptimalkan penggunaan sumber daya (seperti air dan pupuk), meningkatkan produktivitas dan kualitas hasil panen, serta mendorong keberlanjutan lingkungan.
2.1.2.Manfaat Sistem Informasi Pertanian
Dalam konteks permasalahan yang diangkat dalam laporan ini, pembangunan sistem informasi pertanian yang terstruktur memberikan manfaat signifikan untuk mengatasi tantangan operasional, terutama dalam hal manajemen data dan pelaporan. Manfaat utamanya meliputi:
1.Data Terpusat dan Terstruktur: Sistem informasi menggantikan metode pencatatan manual yang tersebar dan tidak konsisten. Sistem ini menyediakan satu sumber kebenaran (single source of truth) dalam sebuah basis data terpusat, memudahkan proses validasi, pencarian, dan pengelolaan data terkait lahan, komoditas, petani, dan progres siklus tanam.
2.Pengambilan Keputusan Berbasis Data (Data-Driven Decision Making): Dengan ketersediaan data yang akurat dan real-time, pemangku kepentingan (seperti manajer perkebunan atau dinas pertanian) dapat beralih dari pengambilan keputusan berbasis intuisi ke berbasis fakta. Analisis data historis dan data terkini dapat membantu mengidentifikasi tren, memprediksi hasil panen, dan mengalokasikan sumber daya dengan lebih efektif.
3.Efisiensi Pelaporan: Proses rekapitulasi data dan pembuatan laporan yang sebelumnya memakan waktu dan rentan terhadap human error dapat diotomatisasi. Sistem dapat dikonfigurasi untuk menghasilkan laporan berkala (harian, mingguan, bulanan) secara instan, memungkinkan tim manajemen untuk fokus pada analisis dan strategi, bukan pada kompilasi data manual.

2.2Arsitektur Sistem Backend
Backend berfungsi sebagai "otak" dari aplikasi, menangani logika bisnis, pemrosesan data, dan komunikasi dengan database. Arsitektur yang baik sangat penting untuk memastikan sistem yang skalabel dan mudah dikelola.
2.2.1.RESTful API (Representational State Transfer)
Inti dari sistem backend yang dibangun adalah Application Programming Interface (API) yang mengadopsi gaya arsitektur REST (Representational State Transfer). REST adalah sekumpulan prinsip desain untuk membangun layanan web yang ringan, cepat, dan mudah diskalakan Prinsip-prinsip dasar REST meliputi:
Arsitektur Client-Server: Terdapat pemisahan yang jelas antara klien (yang meminta data, misal aplikasi mobile atau web) dan server (yang mengelola dan menyediakan data). Keduanya dapat berevolusi secara independen.
Stateless  (Tanpa Status): Setiap permintaan (request) dari klien ke server harus berisi semua informasi yang diperlukan server untuk memahami dan memproses permintaan tersebut. Server tidak menyimpan informasi konteks atau status sesi klien di antara permintaan.
Cacheable (Dapat Di-cache): Respons dari server dapat ditandai sebagai cacheable atau non-cacheable. Jika cacheable, klien dapat menyimpan salinan respons tersebut untuk digunakan kembali pada permintaan berikutnya, sehingga mengurangi latensi dan beban server.
Sistem Berlapis (Layered System): Klien tidak perlu tahu apakah ia terhubung langsung ke server akhir atau melalui perantara (seperti load balancer atau proxy).
Dalam implementasinya, RESTful API memanfaatkan metode HTTP standar untuk melakukan operasi Create, Read, Update, Delete (CRUD) terhadap sumber daya (resource):
GET: Digunakan untuk membaca atau mengambil data.
POST: Digunakan untuk membuat data baru.
PUT/PATCH: Digunakan untuk memperbarui data yang sudah ada.
DELETE: Digunakan untuk menghapus data.
Data yang dipertukarkan antara klien dan server umumnya menggunakan format JSON (JavaScript Object Notation). JSON dipilih karena formatnya yang ringan, mudah dibaca oleh manusia, dan mudah diproses oleh mesin (khususnya oleh JavaScript).
2.2.2.Pola Desain Model-View-Controller (MVC)
Untuk memastikan kode aplikasi terstruktur dengan baik, penelitian ini mengadopsi pola desain Model-View-Controller (MVC). MVC memisahkan aplikasi menjadi tiga komponen utama yang saling terhubung 
1.Model: Merepresentasikan data dan logika bisnis inti. Komponen ini bertanggung jawab langsung untuk berinteraksi dengan database (mengambil, menyimpan, memperbarui data) dan menerapkan aturan bisnis terkait data tersebut.
2.View: Merepresentasikan lapisan presentasi atau antarmuka pengguna (UI). Dalam konteks RESTful API, "View" bukanlah halaman HTML, melainkan representasi data yang dikirim kembali ke klien, seperti respons dalam format JSON.
3.Controller: Bertindak sebagai penghubung antara Model dan View. Controller menerima masukan dari pengguna (dalam hal ini, permintaan HTTP), memproses logika aplikasi, memanggil Model untuk melakukan operasi data yang diperlukan, dan kemudian menentukan View (respons JSON) mana yang harus dikembalikan ke klien.
Justifikasi penggunaan pola MVC adalah untuk menerapkan prinsip Separation of Concerns (Pemisahan Masalah). Dengan memisahkan logika data, logika bisnis, dan presentasi, aplikasi menjadi lebih terstruktur, modular, dan mudah dikelola. Hal ini menyederhanakan proses debugging, pengujian, dan pengembangan fitur baru di kemudian hari.
2.3Teknologi yang Digunakan
2.3.1.Node.js
Node.js adalah runtime environment JavaScript sisi server yang dibangun di atas mesin JavaScript V8 milik Google Chrome. Node.js memungkinkan eksekusi kode JavaScript di luar browser, menjadikannya pilihan populer untuk membangun aplikasi backend.
Keunggulan utama Node.js terletak pada arsitektur event-driven dan model non-blocking I/O. Arsitektur ini membuat Node.js sangat efisien dan cocok untuk aplikasi yang menangani banyak koneksi secara bersamaan, seperti RESTful API
2.3.2.Express.js
Express.js adalah kerangka kerja (framework) web yang minimalis, fleksibel, dan tidak "memaksa" (unopinionated) untuk Node.js. Express.js menyediakan serangkaian fitur dasar yang kuat untuk membangun aplikasi web dan API.
Fungsi utamanya adalah untuk menyederhanakan proses-proses fundamental dalam pengembangan backend, seperti Routing, Manajemen Middleware, dan Penanganan Permintaan/Respons.
2.3.3.PostgreSQL dan PostGIS
PostgreSQL dipilih sebagai sistem manajemen basis data relasional (RDBMS). PostgreSQL adalah RDBMS open-source yang dikenal sangat andal, robust, dan patuh terhadap standar SQL.
PostGIS adalah ekstensi spasial untuk database PostgreSQL. Ini adalah komponen krusial dalam proyek ini. PostGIS "mengajarkan" PostgreSQL cara memahami dan bekerja dengan objek dan data geografis, seperti menyimpan tipe data geometri (POINT, POLYGON) dan melakukan kueri spasial. Kemampuan ini sangat penting untuk menyimpan dan mengelola data pemetaan lahan pertanian.
2.3.4.Sequelize
Interaksi langsung dengan database menggunakan kueri SQL mentah bisa menjadi rumit. Untuk mengatasinya, digunakan Object-Relational Mapping (ORM).
Sequelize adalah ORM berbasis Promise untuk Node.js yang mendukung berbagai dialect SQL, termasuk PostgreSQL. Sequelize berfungsi sebagai jembatan antara aplikasi Node.js dan database PostgreSQL, memungkinkan pengembang untuk berinteraksi dengan database menggunakan objek dan metode JavaScript.
2.4Keamanan Sistem Backend
Keamanan merupakan aspek non-fungsional yang krusial dalam perancangan sistem backend, terutama untuk melindungi data sensitif pertanian dan memastikan integritas layanan.
2.4.1.Autentikasi dan Otorisasi
Autentikasi adalah proses verifikasi identitas pengguna (siapa Anda), sedangkan otorisasi adalah proses menentukan hak akses pengguna (apa yang boleh Anda lakukan). Dalam aplikasi modern, implementasi umum untuk API adalah menggunakan JSON Web Tokens (JWT). JWT adalah standar terbuka (open standard) yang ringkas dan self-contained untuk mentransmisikan informasi antar pihak secara aman sebagai objek JSON. Token ini ditandatangani secara digital untuk memastikan keasliannya
2.4.2.Keamanan Data
Perlindungan data diterapkan pada dua fase:
Data in Transit (Data dalam Perjalanan): Komunikasi antara klien (aplikasi) dan server (API) harus diamankan menggunakan protokol HTTPS (Hypertext Transfer Protocol Secure). HTTPS mengenkripsi data menggunakan Transport Layer Security (TLS), mencegah penyadapan (man-in-the-middle attack).
Data at Rest (Data Tersimpan): Data sensitif pengguna, terutama password, tidak boleh disimpan sebagai teks biasa (plain text) di database. Teknik hashing (seperti menggunakan algoritma bcrypt) harus digunakan. Hashing mengubah password menjadi string acak yang unik dan tidak dapat dibalik (irreversible), sehingga aman jika terjadi kebocoran database.
2.4.3.Pencegahan Serangan Umum
Framework dan library modern membantu mengurangi risiko serangan umum.

SQL Injection: Serangan ini terjadi ketika penyerang menyisipkan kueri SQL berbahaya melalui input pengguna. Penggunaan ORM seperti Sequelize secara signifikan mengurangi risiko ini karena Sequelize meng-abstraksi kueri SQL dan menggunakan prepared statements (parameterisasi kueri) secara default.
Cross-Site Scripting (XSS): Meskipun XSS lebih sering menjadi masalah di frontend, API dapat berkontribusi jika menyimpan dan mengembalikan data input pengguna yang tidak disanitasi. Menerapkan validasi input yang ketat di sisi server adalah lapisan pertahanan yang penting.
2.5Pengelolaan Data Geospasial
Fitur inti dari sistem ini adalah kemampuannya untuk mengelola data pemetaan lahan.
2.5.1.Konsep Data Spasial
Data spasial (atau data geospasial) adalah data yang memiliki informasi lokasi geografis. Dalam konteks proyek ini, model data vektor adalah yang paling relevan. Jenis data vektor yang umum digunakan meliputi:
Point (Titik): Merepresentasikan lokasi tunggal (misalnya, lokasi sensor).
Line (Garis): Serangkaian titik yang terhubung (misalnya, jalan irigasi).
Polygon (Poligon): Serangkaian titik terhubung yang membentuk area tertutup. Ini adalah jenis data yang paling penting untuk merepresentasikan batas-batas petak lahan.
2.5.2.GeoJSON
GeoJSON adalah format standar terbuka berbasis JSON yang dirancang khusus untuk merepresentasikan fitur geografis sederhana beserta atribut non-spasialnya. Format ini sangat penting untuk interoperabilitas data geospasial di web.
Dalam arsitektur sistem ini, ketika backend (via PostGIS) mengambil data geometri dari database, data tersebut akan dikonversi ke format GeoJSON sebelum dikirim melalui API. Klien (aplikasi frontend) kemudian dapat dengan mudah menerima data GeoJSON ini dan menggunakannya untuk visualisasi di peta interaktif.