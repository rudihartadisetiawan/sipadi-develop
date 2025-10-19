--
-- PostgreSQL database dump
--

\restrict rm9SzbeefqhS1mb9pG4s3hEDdEAgXkkE8svbAhXxTFqLjwSMyMDAuTapntOrr1Q

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: update_lahan_centroid(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_lahan_centroid() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
          NEW.centroid := ST_Centroid(NEW.geometry);
          RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.update_lahan_centroid() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: artikel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artikel (
    id integer NOT NULL,
    admin_id integer NOT NULL,
    judul character varying(200) NOT NULL,
    konten text NOT NULL,
    gambar_utama character varying(255),
    kategori character varying(50),
    views integer DEFAULT 0,
    published boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.artikel OWNER TO postgres;

--
-- Name: artikel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.artikel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.artikel_id_seq OWNER TO postgres;

--
-- Name: artikel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.artikel_id_seq OWNED BY public.artikel.id;


--
-- Name: keluhan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keluhan (
    id integer NOT NULL,
    lahan_id integer NOT NULL,
    user_id integer NOT NULL,
    kategori character varying(50) NOT NULL,
    deskripsi text NOT NULL,
    foto_bukti text,
    status character varying(20) DEFAULT 'pending'::character varying,
    tanggapan text,
    admin_id integer,
    tanggal_keluhan timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    tanggal_selesai timestamp with time zone
);


ALTER TABLE public.keluhan OWNER TO postgres;

--
-- Name: keluhan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.keluhan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.keluhan_id_seq OWNER TO postgres;

--
-- Name: keluhan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.keluhan_id_seq OWNED BY public.keluhan.id;


--
-- Name: komentar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.komentar (
    id integer NOT NULL,
    artikel_id integer NOT NULL,
    user_id integer NOT NULL,
    konten text NOT NULL,
    parent_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.komentar OWNER TO postgres;

--
-- Name: komentar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.komentar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.komentar_id_seq OWNER TO postgres;

--
-- Name: komentar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.komentar_id_seq OWNED BY public.komentar.id;


--
-- Name: lahan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lahan (
    id integer NOT NULL,
    user_id integer NOT NULL,
    nama_lahan character varying(100) NOT NULL,
    luas numeric(10,2) NOT NULL,
    geometry public.geometry(Polygon,4326),
    centroid public.geometry(Point,4326),
    jenis_tanaman character varying(50),
    status character varying(20) DEFAULT 'aktif'::character varying,
    alamat text,
    desa character varying(50),
    kecamatan character varying(50),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lahan OWNER TO postgres;

--
-- Name: lahan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lahan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lahan_id_seq OWNER TO postgres;

--
-- Name: lahan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lahan_id_seq OWNED BY public.lahan.id;


--
-- Name: panen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.panen (
    id integer NOT NULL,
    lahan_id integer NOT NULL,
    tanggal_panen date NOT NULL,
    jumlah_panen numeric(10,2) NOT NULL,
    kualitas character varying(20),
    harga_jual numeric(12,2),
    catatan text,
    foto_panen character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.panen OWNER TO postgres;

--
-- Name: panen_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.panen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.panen_id_seq OWNER TO postgres;

--
-- Name: panen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.panen_id_seq OWNED BY public.panen.id;


--
-- Name: tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tokens (
    id integer NOT NULL,
    token character varying(255) NOT NULL,
    user_id integer NOT NULL,
    type character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL,
    blacklisted boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tokens OWNER TO postgres;

--
-- Name: tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tokens_id_seq OWNER TO postgres;

--
-- Name: tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tokens_id_seq OWNED BY public.tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nik character varying(16) NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255),
    no_telepon character varying(15),
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'petani'::character varying,
    alamat text,
    foto_profil character varying(255),
    is_email_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: artikel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artikel ALTER COLUMN id SET DEFAULT nextval('public.artikel_id_seq'::regclass);


--
-- Name: keluhan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keluhan ALTER COLUMN id SET DEFAULT nextval('public.keluhan_id_seq'::regclass);


--
-- Name: komentar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.komentar ALTER COLUMN id SET DEFAULT nextval('public.komentar_id_seq'::regclass);


--
-- Name: lahan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lahan ALTER COLUMN id SET DEFAULT nextval('public.lahan_id_seq'::regclass);


--
-- Name: panen id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panen ALTER COLUMN id SET DEFAULT nextval('public.panen_id_seq'::regclass);


--
-- Name: tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens ALTER COLUMN id SET DEFAULT nextval('public.tokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20251004031439-create-sipadi-schema.js
20251013093550-change-foto-bukti-to-text.js
\.


--
-- Data for Name: artikel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artikel (id, admin_id, judul, konten, gambar_utama, kategori, views, published, created_at, updated_at) FROM stdin;
10	3	DEBUG TEST ARTICLE - SHOULD BE PUBLISHED	This is a test article to check published status	https://example.com/debug-test.jpg	debug	3	f	2025-10-05 23:24:58.118+07	2025-10-05 23:27:03.687839+07
13	3	Hidroponik: Solusi Pertanian Modern di Lahan	Pendahuluan\n\nPertanian konvensional yang mengandalkan lahan luas dan ketersediaan air yang melimpah semakin menghadapi tantangan seiring dengan pesatnya pertumbuhan penduduk dan alih fungsi lahan. Di perkotaan, dimana lahan merupakan barang mewah, kegiatan bercocok tanam hampir mustahil dilakukan. Namun, berkat kemajuan teknologi, hadirlah sistem pertanian modern yang dikenal dengan nama Hidroponik. Hidroponik menawarkan solusi cerdas dan efisien untuk memproduksi bahan pangan secara mandiri, bahkan di halaman rumah atau balkon apartemen sekalipun.\n\nApa Itu Hidroponik?\n\nSecara sederhana, hidroponik adalah metode bercocok tanam tanpa menggunakan tanah sebagai media tumbuhnya. Kata "hidroponik" sendiri berasal dari bahasa Yunani, yaitu hydro yang berarti air dan ponos yang berarti daya. Jadi, hidroponik adalah sistem budidaya tanaman yang memanfaatkan air sebagai media utama untuk menyalurkan nutrisi.\n\nDalam sistem ini, unsur hara yang dibutuhkan tanaman dilarutkan ke dalam air, sehingga akar tanaman dapat menyerapnya secara langsung. Penggunaan media tanam seperti rockwool, sekam bakar, atau cocopeat hanya berfungsi sebagai pijakan akar dan penopang tanaman, bukan sebagai sumber nutrisi.\n\nKeunggulan Sistem Hidroponik\n\nTidak Memerlukan Lahan Luas: Hidroponik bisa diterapkan secara vertikal atau horizontal di ruang terbatas, seperti pekarangan, rooftop, atau garasi.\n\nPenggunaan Air yang Lebih Efisien: Sistem ini hanya menggunakan air sekitar 90% lebih sedikit dibandingkan pertanian konvensional karena air dialirkan secara sirkulasi dan tidak hilang karena peresapan ke dalam tanah.\n\nPertumbuhan Tanaman Lebih Cepat: Karena nutrisi tersedia secara langsung dan mudah diserap oleh akar, tanaman dapat tumbuh hingga 50% lebih cepat.\n\nBebas dari Gulma dan Hama Tanah: Tidak adanya tanah meminimalisir serangan hama dan penyakit yang berasal dari tanah, serta pertumbuhan gulma pengganggu.\n\nHasil Panen Berkualitas dan Higienis: Tanaman tumbuh dalam lingkungan yang lebih terkontrol, sehingga hasil panen cenderung lebih bersih, segar, dan bebas dari residu tanah.\n\nJenis-Jenis Sistem Hidroponik yang Populer\n\nBeberapa sistem hidroponik yang cocok untuk pemula dan skala rumahan antara lain:\n\nNutrient Film Technique (NFT): Sistem dimana larutan nutrisi dialirkan secara tipis (seperti film) melalui saluran (pipa PVC) yang di dalamnya terdapat akar tanaman. Sistem ini sangat efisien untuk tanaman daun seperti selada, kangkung, dan bayam.\n\nDeep Flow Technique (DFT): Mirip dengan NFT, tetapi akar tanaman terendam dalam larutan nutrisi yang lebih dalam dan dialirkan secara terus-menerus.\n\nWick System (Sistem Sumbu): Sistem paling sederhana dan pasif. Larutan nutrisi diserap oleh media tanam menggunakan bantuan sumbu (seperti kain flanel). Cocok untuk tanaman hias atau herba berukuran kecil.\n\nFloating Raft System: Media tanam dan tanaman diapungkan di atas larutan nutrisi dalam wadah tertutup. Akar tanaman akan menjuntai ke bawah dan menyerap nutrisi langsung dari air.\n\nLangkah-Langkah Memulai Hidroponik Sederhana\n\nPilih Sistem: Pilih sistem yang paling sesuai dengan kemampuan dan ruang yang Anda miliki, misalnya Wick System untuk pemula.\n\nSiapkan Bahan: Siapkan wadah (ember/talon), net pot, media tanam (rockwool), larutan nutrisi AB Mix, dan benih tanaman.\n\nSemai Benih: Semai benih pada media rockwool yang telah dibasahi hingga berkecambah.\n\nSiapkan Larutan Nutrisi: Campurkan larutan nutrisi A dan B ke dalam air sesuai takaran yang dianjurkan pada kemasan.\n\nPindahkan Bibit: Setelah bibit memiliki 3-4 daun, pindahkan ke dalam net pot yang telah ditempatkan di wadah berisi larutan nutrisi.\n\nPerawatan: Pantau tinggi air dan nutrisi, pastikan sirkulasi udara baik, dan amati dari serangan hama.\n\nKesimpulan\n\nHidroponik bukan lagi sekadar hobi, melainkan sebuah solusi nyata untuk ketahanan pangan, terutama di daerah perkotaan. Dengan memanfaatkan teknologi ini, siapa pun dapat menjadi petani urban, menyediakan sayuran segar untuk keluarga, sekaligus berkontribusi dalam menghijaukan lingkungan. Mari kita mulai langkah kecil dengan bercocok tanam hidroponik untuk masa depan yang lebih mandiri dan berkelanjutan.	-	Inovasi Teknologi Pertanian	0	f	2025-10-05 23:58:24.7+07	2025-10-05 23:58:24.7+07
14	3	Pertanian Regeneratif: Memulihkan Bumi sambil Menghasilkan Pangan	Pendahuluan\n\nSelama beberapa dekade, praktik pertanian intensif telah berhasil meningkatkan produksi pangan global. Namun, di balik kesuksesan itu, tersembunyi biaya lingkungan yang tinggi: degradasi tanah, hilangnya keanekaragaman hayati, dan emisi gas rumah kaca. Kini, sebuah paradigma baru yang disebut Pertanian Regeneratif hadir sebagai jawaban. Pertanian regeneratif bukan hanya sekadar "berkelanjutan" (mempertahankan kondisi yang ada), tetapi aktif memulihkan dan memperbaiki kesehatan ekosistem pertanian.\n\nApa itu Pertanian Regeneratif?\n\nPertanian regeneratif adalah pendekatan holistik terhadap budidaya tanaman dan ternak yang berfokus pada peningkatan kesehatan tanah, meningkatkan keanekaragaman hayati, dan memperbaiki siklus air dan nutrisi. Inti dari filosofi ini adalah melihat tanah sebagai organisme hidup yang harus dipelihara, bukan hanya sebagai media tumbuh.\n\nPrinsip-Prinsip Utama Pertanian Regeneratif\n\nMinimal Tillage (Pengolahan Tanah Minimum): Mengurangi atau menghilangkan pembajakan tanah untuk melindungi struktur tanah, menjaga kelembapan, dan tidak mengganggu kehidupan mikroorganisme di dalamnya.\n\nPenutupan Tanah yang Berkelanjutan: Tanah tidak boleh dibiarkan terbuka. Penggunaan mulsa atau tanaman penutup tanah (cover crop) seperti kacang-kacangan berfungsi untuk mencegah erosi, menekan gulma, dan menambahkan bahan organik ke dalam tanah.\n\nRotasi Tanaman dan Polikultur: Menanam berbagai jenis tanaman secara bergiliran atau bersamaan dalam satu lahan. Ini memutus siklus hama dan penyakit, serta meningkatkan kesuburan tanah.\n\nIntegrasi Ternak dan Tanaman: Mengembalikan ternak ke dalam sistem pertanian. Ternak tidak hanya menghasilkan pupuk alami (kompos) yang kaya, tetapi juga dapat membantu mengelola tanaman penutup tanah dengan cara digembalakan.\n\nMenghindari Pupuk dan Pestisida Kimia Sintetis: Bergantung pada pupuk alami (kompos, pupuk hijau) dan pengendalian hama secara biologis untuk menciptakan sistem yang seimbang.\n\nManfaat yang Ditawarkan\n\nKesehatan Tanah yang Meningkat: Tanah menjadi lebih gembur, kaya akan bahan organik, dan memiliki kemampuan menahan air yang lebih baik.\n\nKetahanan terhadap Perubahan Iklim: Tanah yang sehat dengan kandungan karbon organik yang tinggi berperan sebagai "penyimpan karbon" (carbon sink) yang efektif, membantu mitigasi perubahan iklim.\n\nPeningkatan Keanekaragaman Hayati: Sistem yang beragam menciptakan habitat bagi serangga penyerbuk, burung, dan mikroba menguntungkan.\n\nPengurangan Biaya Produksi: Petani dapat mengurangi ketergantungan pada input eksternal yang mahal seperti pupuk dan pestisida kimia.\n\nHasil Panen yang Lebih Berkualitas dan Tangguh: Tanaman yang tumbuh di tanah yang sehat cenderung lebih tahan terhadap stres kekeringan dan serangan penyakit.\n\nStudi Kasus: Kesuksesan di Nusa Tenggara Timur\n\nDi NTT, yang dikenal dengan lahan keringnya, penerapan pertanian regeneratif mulai menunjukkan hasil. Petani yang menerapkan teknik cover crop dan pengolahan tanah minimal melaporkan bahwa tanah mereka menjadi lebih "hidup" dan mampu menahan air lebih lama selama musim kemarau. Integrasi dengan ternak kambing juga memberikan nilai tambah ekonomi sekaligus sumber pupuk yang murah.\n\nKesimpulan\n\nPertanian regeneratif menawarkan masa depan yang cerah, di mana aktivitas pertanian tidak lagi menjadi bagian dari masalah, tetapi justru menjadi bagian dari solusi untuk krisis ekologis. Dengan mengadopsi praktik-praktik ini, kita tidak hanya memproduksi pangan, tetapi juga menjadi aktor aktif dalam memulihkan kesehatan planet bumi untuk generasi mendatang. Sudah saatnya kita bercocok tanam dengan cara yang bekerja sama dengan alam, bukan melawannya.	-	Pertanian Berkelanjutan dan Konservasi Lahan	0	f	2025-10-06 00:13:11.125+07	2025-10-06 00:13:11.125+07
2	3	Testing Artikel - Updated	Ini adalah artikel testing yang diperbarui	https://example.com/image-updated.jpg	testing	2	f	2025-10-05 21:21:57.627+07	2025-10-05 22:00:46.167929+07
1	3	Tips Budidaya Padi Organik	Artikel tentang cara budidaya padi secara organik tanpa pestisida kimia...	\N	panduan	5	f	2025-10-05 20:52:06.555+07	2025-10-05 22:18:06.708593+07
15	3	Pertanian Regeneratif: Memulihkan Bumi sambil Menghasilkan	Pendahuluan\n\nSelama beberapa dekade, praktik pertanian intensif telah berhasil meningkatkan produksi pangan global. Namun, di balik kesuksesan itu, tersembunyi biaya lingkungan yang tinggi: degradasi tanah, hilangnya keanekaragaman hayati, dan emisi gas rumah kaca. Kini, sebuah paradigma baru yang disebut Pertanian Regeneratif hadir sebagai jawaban. Pertanian regeneratif bukan hanya sekadar "berkelanjutan" (mempertahankan kondisi yang ada), tetapi aktif memulihkan dan memperbaiki kesehatan ekosistem pertanian.\n\nApa itu Pertanian Regeneratif?\n\nPertanian regeneratif adalah pendekatan holistik terhadap budidaya tanaman dan ternak yang berfokus pada peningkatan kesehatan tanah, meningkatkan keanekaragaman hayati, dan memperbaiki siklus air dan nutrisi. Inti dari filosofi ini adalah melihat tanah sebagai organisme hidup yang harus dipelihara, bukan hanya sebagai media tumbuh.\n\nPrinsip-Prinsip Utama Pertanian Regeneratif\n\nMinimal Tillage (Pengolahan Tanah Minimum): Mengurangi atau menghilangkan pembajakan tanah untuk melindungi struktur tanah, menjaga kelembapan, dan tidak mengganggu kehidupan mikroorganisme di dalamnya.\n\nPenutupan Tanah yang Berkelanjutan: Tanah tidak boleh dibiarkan terbuka. Penggunaan mulsa atau tanaman penutup tanah (cover crop) seperti kacang-kacangan berfungsi untuk mencegah erosi, menekan gulma, dan menambahkan bahan organik ke dalam tanah.\n\nRotasi Tanaman dan Polikultur: Menanam berbagai jenis tanaman secara bergiliran atau bersamaan dalam satu lahan. Ini memutus siklus hama dan penyakit, serta meningkatkan kesuburan tanah.\n\nIntegrasi Ternak dan Tanaman: Mengembalikan ternak ke dalam sistem pertanian. Ternak tidak hanya menghasilkan pupuk alami (kompos) yang kaya, tetapi juga dapat membantu mengelola tanaman penutup tanah dengan cara digembalakan.\n\nMenghindari Pupuk dan Pestisida Kimia Sintetis: Bergantung pada pupuk alami (kompos, pupuk hijau) dan pengendalian hama secara biologis untuk menciptakan sistem yang seimbang.\n\nManfaat yang Ditawarkan\n\nKesehatan Tanah yang Meningkat: Tanah menjadi lebih gembur, kaya akan bahan organik, dan memiliki kemampuan menahan air yang lebih baik.\n\nKetahanan terhadap Perubahan Iklim: Tanah yang sehat dengan kandungan karbon organik yang tinggi berperan sebagai "penyimpan karbon" (carbon sink) yang efektif, membantu mitigasi perubahan iklim.\n\nPeningkatan Keanekaragaman Hayati: Sistem yang beragam menciptakan habitat bagi serangga penyerbuk, burung, dan mikroba menguntungkan.\n\nPengurangan Biaya Produksi: Petani dapat mengurangi ketergantungan pada input eksternal yang mahal seperti pupuk dan pestisida kimia.\n\nHasil Panen yang Lebih Berkualitas dan Tangguh: Tanaman yang tumbuh di tanah yang sehat cenderung lebih tahan terhadap stres kekeringan dan serangan penyakit.\n\nStudi Kasus: Kesuksesan di Nusa Tenggara Timur\n\nDi NTT, yang dikenal dengan lahan keringnya, penerapan pertanian regeneratif mulai menunjukkan hasil. Petani yang menerapkan teknik cover crop dan pengolahan tanah minimal melaporkan bahwa tanah mereka menjadi lebih "hidup" dan mampu menahan air lebih lama selama musim kemarau. Integrasi dengan ternak kambing juga memberikan nilai tambah ekonomi sekaligus sumber pupuk yang murah.\n\nKesimpulan\n\nPertanian regeneratif menawarkan masa depan yang cerah, di mana aktivitas pertanian tidak lagi menjadi bagian dari masalah, tetapi justru menjadi bagian dari solusi untuk krisis ekologis. Dengan mengadopsi praktik-praktik ini, kita tidak hanya memproduksi pangan, tetapi juga menjadi aktor aktif dalam memulihkan kesehatan planet bumi untuk generasi mendatang. Sudah saatnya kita bercocok tanam dengan cara yang bekerja sama dengan alam, bukan melawannya.	-	Pertanian Berkelanjutan dan Konservasi Lahan	23	f	2025-10-06 00:14:50.36+07	2025-10-06 00:51:01.766565+07
3	3	rudias	asd adsa  asda 	ads	asd	1	f	2025-10-05 21:28:52.485+07	2025-10-05 22:19:58.516348+07
16	3	Vertikultur: Teknik bercocok tanam secara vertikal.	Pendahuluan\n\nSelama beberapa dekade, praktik pertanian intensif telah berhasil meningkatkan produksi pangan global. Namun, di balik kesuksesan itu, tersembunyi biaya lingkungan yang tinggi: degradasi tanah, hilangnya keanekaragaman hayati, dan emisi gas rumah kaca. Kini, sebuah paradigma baru yang disebut Pertanian Regeneratif hadir sebagai jawaban. Pertanian regeneratif bukan hanya sekadar "berkelanjutan" (mempertahankan kondisi yang ada), tetapi aktif memulihkan dan memperbaiki kesehatan ekosistem pertanian.\n\nApa itu Pertanian Regeneratif?\n\nPertanian regeneratif adalah pendekatan holistik terhadap budidaya tanaman dan ternak yang berfokus pada peningkatan kesehatan tanah, meningkatkan keanekaragaman hayati, dan memperbaiki siklus air dan nutrisi. Inti dari filosofi ini adalah melihat tanah sebagai organisme hidup yang harus dipelihara, bukan hanya sebagai media tumbuh.\n\nPrinsip-Prinsip Utama Pertanian Regeneratif\n\nMinimal Tillage (Pengolahan Tanah Minimum): Mengurangi atau menghilangkan pembajakan tanah untuk melindungi struktur tanah, menjaga kelembapan, dan tidak mengganggu kehidupan mikroorganisme di dalamnya.\n\nPenutupan Tanah yang Berkelanjutan: Tanah tidak boleh dibiarkan terbuka. Penggunaan mulsa atau tanaman penutup tanah (cover crop) seperti kacang-kacangan berfungsi untuk mencegah erosi, menekan gulma, dan menambahkan bahan organik ke dalam tanah.\n\nRotasi Tanaman dan Polikultur: Menanam berbagai jenis tanaman secara bergiliran atau bersamaan dalam satu lahan. Ini memutus siklus hama dan penyakit, serta meningkatkan kesuburan tanah.\n\nIntegrasi Ternak dan Tanaman: Mengembalikan ternak ke dalam sistem pertanian. Ternak tidak hanya menghasilkan pupuk alami (kompos) yang kaya, tetapi juga dapat membantu mengelola tanaman penutup tanah dengan cara digembalakan.\n\nMenghindari Pupuk dan Pestisida Kimia Sintetis: Bergantung pada pupuk alami (kompos, pupuk hijau) dan pengendalian hama secara biologis untuk menciptakan sistem yang seimbang.\n\nManfaat yang Ditawarkan\n\nKesehatan Tanah yang Meningkat: Tanah menjadi lebih gembur, kaya akan bahan organik, dan memiliki kemampuan menahan air yang lebih baik.\n\nKetahanan terhadap Perubahan Iklim: Tanah yang sehat dengan kandungan karbon organik yang tinggi berperan sebagai "penyimpan karbon" (carbon sink) yang efektif, membantu mitigasi perubahan iklim.\n\nPeningkatan Keanekaragaman Hayati: Sistem yang beragam menciptakan habitat bagi serangga penyerbuk, burung, dan mikroba menguntungkan.\n\nPengurangan Biaya Produksi: Petani dapat mengurangi ketergantungan pada input eksternal yang mahal seperti pupuk dan pestisida kimia.\n\nHasil Panen yang Lebih Berkualitas dan Tangguh: Tanaman yang tumbuh di tanah yang sehat cenderung lebih tahan terhadap stres kekeringan dan serangan penyakit.\n\nStudi Kasus: Kesuksesan di Nusa Tenggara Timur\n\nDi NTT, yang dikenal dengan lahan keringnya, penerapan pertanian regeneratif mulai menunjukkan hasil. Petani yang menerapkan teknik cover crop dan pengolahan tanah minimal melaporkan bahwa tanah mereka menjadi lebih "hidup" dan mampu menahan air lebih lama selama musim kemarau. Integrasi dengan ternak kambing juga memberikan nilai tambah ekonomi sekaligus sumber pupuk yang murah.\n\nKesimpulan\n\nPertanian regeneratif menawarkan masa depan yang cerah, di mana aktivitas pertanian tidak lagi menjadi bagian dari masalah, tetapi justru menjadi bagian dari solusi untuk krisis ekologis. Dengan mengadopsi praktik-praktik ini, kita tidak hanya memproduksi pangan, tetapi juga menjadi aktor aktif dalam memulihkan kesehatan planet bumi untuk generasi mendatang. Sudah saatnya kita bercocok tanam dengan cara yang bekerja sama dengan alam, bukan melawannya.	/uploads/file-1759736167059-900813402.png	Inovasi Teknologi Pertanian	19	t	2025-10-06 00:15:53.953+07	2025-10-06 14:36:16.017388+07
6	3	Hidroponik: Solusi Pertanian Modern di Lahan Terbatas	Pendahuluan\n\nPertanian konvensional yang mengandalkan lahan luas dan ketersediaan air yang melimpah semakin menghadapi tantangan seiring dengan pesatnya pertumbuhan penduduk dan alih fungsi lahan. Di perkotaan, dimana lahan merupakan barang mewah, kegiatan bercocok tanam hampir mustahil dilakukan. Namun, berkat kemajuan teknologi, hadirlah sistem pertanian modern yang dikenal dengan nama Hidroponik. Hidroponik menawarkan solusi cerdas dan efisien untuk memproduksi bahan pangan secara mandiri, bahkan di halaman rumah atau balkon apartemen sekalipun.\n\nApa Itu Hidroponik?\n\nSecara sederhana, hidroponik adalah metode bercocok tanam tanpa menggunakan tanah sebagai media tumbuhnya. Kata "hidroponik" sendiri berasal dari bahasa Yunani, yaitu hydro yang berarti air dan ponos yang berarti daya. Jadi, hidroponik adalah sistem budidaya tanaman yang memanfaatkan air sebagai media utama untuk menyalurkan nutrisi.\n\nDalam sistem ini, unsur hara yang dibutuhkan tanaman dilarutkan ke dalam air, sehingga akar tanaman dapat menyerapnya secara langsung. Penggunaan media tanam seperti rockwool, sekam bakar, atau cocopeat hanya berfungsi sebagai pijakan akar dan penopang tanaman, bukan sebagai sumber nutrisi.\n\nKeunggulan Sistem Hidroponik\n\nTidak Memerlukan Lahan Luas: Hidroponik bisa diterapkan secara vertikal atau horizontal di ruang terbatas, seperti pekarangan, rooftop, atau garasi.\n\nPenggunaan Air yang Lebih Efisien: Sistem ini hanya menggunakan air sekitar 90% lebih sedikit dibandingkan pertanian konvensional karena air dialirkan secara sirkulasi dan tidak hilang karena peresapan ke dalam tanah.\n\nPertumbuhan Tanaman Lebih Cepat: Karena nutrisi tersedia secara langsung dan mudah diserap oleh akar, tanaman dapat tumbuh hingga 50% lebih cepat.\n\nBebas dari Gulma dan Hama Tanah: Tidak adanya tanah meminimalisir serangan hama dan penyakit yang berasal dari tanah, serta pertumbuhan gulma pengganggu.\n\nHasil Panen Berkualitas dan Higienis: Tanaman tumbuh dalam lingkungan yang lebih terkontrol, sehingga hasil panen cenderung lebih bersih, segar, dan bebas dari residu tanah.\n\nJenis-Jenis Sistem Hidroponik yang Populer\n\nBeberapa sistem hidroponik yang cocok untuk pemula dan skala rumahan antara lain:\n\nNutrient Film Technique (NFT): Sistem dimana larutan nutrisi dialirkan secara tipis (seperti film) melalui saluran (pipa PVC) yang di dalamnya terdapat akar tanaman. Sistem ini sangat efisien untuk tanaman daun seperti selada, kangkung, dan bayam.\n\nDeep Flow Technique (DFT): Mirip dengan NFT, tetapi akar tanaman terendam dalam larutan nutrisi yang lebih dalam dan dialirkan secara terus-menerus.\n\nWick System (Sistem Sumbu): Sistem paling sederhana dan pasif. Larutan nutrisi diserap oleh media tanam menggunakan bantuan sumbu (seperti kain flanel). Cocok untuk tanaman hias atau herba berukuran kecil.\n\nFloating Raft System: Media tanam dan tanaman diapungkan di atas larutan nutrisi dalam wadah tertutup. Akar tanaman akan menjuntai ke bawah dan menyerap nutrisi langsung dari air.\n\nLangkah-Langkah Memulai Hidroponik Sederhana\n\nPilih Sistem: Pilih sistem yang paling sesuai dengan kemampuan dan ruang yang Anda miliki, misalnya Wick System untuk pemula.\n\nSiapkan Bahan: Siapkan wadah (ember/talon), net pot, media tanam (rockwool), larutan nutrisi AB Mix, dan benih tanaman.\n\nSemai Benih: Semai benih pada media rockwool yang telah dibasahi hingga berkecambah.\n\nSiapkan Larutan Nutrisi: Campurkan larutan nutrisi A dan B ke dalam air sesuai takaran yang dianjurkan pada kemasan.\n\nPindahkan Bibit: Setelah bibit memiliki 3-4 daun, pindahkan ke dalam net pot yang telah ditempatkan di wadah berisi larutan nutrisi.\n\nPerawatan: Pantau tinggi air dan nutrisi, pastikan sirkulasi udara baik, dan amati dari serangan hama.\n\nKesimpulan\n\nHidroponik bukan lagi sekadar hobi, melainkan sebuah solusi nyata untuk ketahanan pangan, terutama di daerah perkotaan. Dengan memanfaatkan teknologi ini, siapa pun dapat menjadi petani urban, menyediakan sayuran segar untuk keluarga, sekaligus berkontribusi dalam menghijaukan lingkungan. Mari kita mulai langkah kecil dengan bercocok tanam hidroponik untuk masa depan yang lebih mandiri dan berkelanjutan.	-	Inovasi Teknologi Pertanian	1	f	2025-10-05 22:25:57.393+07	2025-10-05 22:26:06.963935+07
11	3	Hidroponik: Solusi Pertanian Modern di Lahan Terbatas	Pendahuluan\n\nPertanian konvensional yang mengandalkan lahan luas dan ketersediaan air yang melimpah semakin menghadapi tantangan seiring dengan pesatnya pertumbuhan penduduk dan alih fungsi lahan. Di perkotaan, dimana lahan merupakan barang mewah, kegiatan bercocok tanam hampir mustahil dilakukan. Namun, berkat kemajuan teknologi, hadirlah sistem pertanian modern yang dikenal dengan nama Hidroponik. Hidroponik menawarkan solusi cerdas dan efisien untuk memproduksi bahan pangan secara mandiri, bahkan di halaman rumah atau balkon apartemen sekalipun.\n\nApa Itu Hidroponik?\n\nSecara sederhana, hidroponik adalah metode bercocok tanam tanpa menggunakan tanah sebagai media tumbuhnya. Kata "hidroponik" sendiri berasal dari bahasa Yunani, yaitu hydro yang berarti air dan ponos yang berarti daya. Jadi, hidroponik adalah sistem budidaya tanaman yang memanfaatkan air sebagai media utama untuk menyalurkan nutrisi.\n\nDalam sistem ini, unsur hara yang dibutuhkan tanaman dilarutkan ke dalam air, sehingga akar tanaman dapat menyerapnya secara langsung. Penggunaan media tanam seperti rockwool, sekam bakar, atau cocopeat hanya berfungsi sebagai pijakan akar dan penopang tanaman, bukan sebagai sumber nutrisi.\n\nKeunggulan Sistem Hidroponik\n\nTidak Memerlukan Lahan Luas: Hidroponik bisa diterapkan secara vertikal atau horizontal di ruang terbatas, seperti pekarangan, rooftop, atau garasi.\n\nPenggunaan Air yang Lebih Efisien: Sistem ini hanya menggunakan air sekitar 90% lebih sedikit dibandingkan pertanian konvensional karena air dialirkan secara sirkulasi dan tidak hilang karena peresapan ke dalam tanah.\n\nPertumbuhan Tanaman Lebih Cepat: Karena nutrisi tersedia secara langsung dan mudah diserap oleh akar, tanaman dapat tumbuh hingga 50% lebih cepat.\n\nBebas dari Gulma dan Hama Tanah: Tidak adanya tanah meminimalisir serangan hama dan penyakit yang berasal dari tanah, serta pertumbuhan gulma pengganggu.\n\nHasil Panen Berkualitas dan Higienis: Tanaman tumbuh dalam lingkungan yang lebih terkontrol, sehingga hasil panen cenderung lebih bersih, segar, dan bebas dari residu tanah.\n\nJenis-Jenis Sistem Hidroponik yang Populer\n\nBeberapa sistem hidroponik yang cocok untuk pemula dan skala rumahan antara lain:\n\nNutrient Film Technique (NFT): Sistem dimana larutan nutrisi dialirkan secara tipis (seperti film) melalui saluran (pipa PVC) yang di dalamnya terdapat akar tanaman. Sistem ini sangat efisien untuk tanaman daun seperti selada, kangkung, dan bayam.\n\nDeep Flow Technique (DFT): Mirip dengan NFT, tetapi akar tanaman terendam dalam larutan nutrisi yang lebih dalam dan dialirkan secara terus-menerus.\n\nWick System (Sistem Sumbu): Sistem paling sederhana dan pasif. Larutan nutrisi diserap oleh media tanam menggunakan bantuan sumbu (seperti kain flanel). Cocok untuk tanaman hias atau herba berukuran kecil.\n\nFloating Raft System: Media tanam dan tanaman diapungkan di atas larutan nutrisi dalam wadah tertutup. Akar tanaman akan menjuntai ke bawah dan menyerap nutrisi langsung dari air.\n\nLangkah-Langkah Memulai Hidroponik Sederhana\n\nPilih Sistem: Pilih sistem yang paling sesuai dengan kemampuan dan ruang yang Anda miliki, misalnya Wick System untuk pemula.\n\nSiapkan Bahan: Siapkan wadah (ember/talon), net pot, media tanam (rockwool), larutan nutrisi AB Mix, dan benih tanaman.\n\nSemai Benih: Semai benih pada media rockwool yang telah dibasahi hingga berkecambah.\n\nSiapkan Larutan Nutrisi: Campurkan larutan nutrisi A dan B ke dalam air sesuai takaran yang dianjurkan pada kemasan.\n\nPindahkan Bibit: Setelah bibit memiliki 3-4 daun, pindahkan ke dalam net pot yang telah ditempatkan di wadah berisi larutan nutrisi.\n\nPerawatan: Pantau tinggi air dan nutrisi, pastikan sirkulasi udara baik, dan amati dari serangan hama.\n\nKesimpulan\n\nHidroponik bukan lagi sekadar hobi, melainkan sebuah solusi nyata untuk ketahanan pangan, terutama di daerah perkotaan. Dengan memanfaatkan teknologi ini, siapa pun dapat menjadi petani urban, menyediakan sayuran segar untuk keluarga, sekaligus berkontribusi dalam menghijaukan lingkungan. Mari kita mulai langkah kecil dengan bercocok tanam hidroponik untuk masa depan yang lebih mandiri dan berkelanjutan.	-	Inovasi Teknologi Pertanian	7	f	2025-10-05 23:35:20.985+07	2025-10-06 15:01:21.612377+07
8	3	Artikel Published untuk Testing	Ini adalah artikel yang akan di-publish untuk testing	https://example.com/test-published.jpg	testing	1	f	2025-10-05 23:03:06.744+07	2025-10-05 23:14:31.487136+07
9	3	DEBUG TEST ARTICLE - SHOULD BE PUBLISHED	This is a test article to check published status	https://example.com/debug-test.jpg	debug	9	f	2025-10-05 23:21:24.154+07	2025-10-06 00:51:45.239295+07
17	3	Pertanian Berkelanjutan: Menabur Masa Depan Pangan Indonesia yang Sehat dan Lestari	Indonesia, sebagai negara agraris, menempatkan sektor pertanian sebagai jantung perekonomian dan ketahanan nasional. Dari hamparan sawah di Jawa hingga perkebunan rempah di Maluku, pertanian adalah denyut nadi kehidupan jutaan rakyatnya. Namun, di tengah tantangan modern seperti perubahan iklim, ledakan populasi, dan degradasi lahan, kita dipaksa untuk bertanya: Sudahkah cara kita bertani saat ini mampu menjamin masa depan?\n\nJawabannya terletak pada sebuah konsep yang semakin mendesak untuk diterapkan: Pertanian Berkelanjutan.\n\nApa Itu Pertanian Berkelanjutan?\nPertanian berkelanjutan bukan sekadar tren, melainkan sebuah pendekatan holistik yang menyeimbangkan tiga pilar utama:\n\nLingkungan (Planet): Praktik pertanian yang ramah lingkungan, menjaga kesehatan tanah, menghemat air, mengurangi penggunaan bahan kimia sintetis, dan melindungi keanekaragaman hayati.\n\nSosial (People): Menjamin kesejahteraan petani, memberdayakan komunitas lokal, serta menyediakan pangan yang sehat dan aman bagi masyarakat luas.\n\nEkonomi (Profit): Memastikan kegiatan pertanian menguntungkan secara ekonomi dalam jangka panjang, tidak hanya untuk satu musim panen. Ini tentang efisiensi, stabilitas, dan viabilitas usaha tani.\n\nSederhananya, pertanian berkelanjutan adalah cara bertani yang memenuhi kebutuhan hari ini tanpa mengorbankan kemampuan generasi mendatang untuk memenuhi kebutuhan mereka.\n\nMengapa Ini Sangat Penting untuk Indonesia?\nPenerapan pertanian berkelanjutan di Indonesia bukan lagi pilihan, melainkan sebuah keharusan. Berikut adalah beberapa alasannya:\n\nAncaman Perubahan Iklim: Pola cuaca yang tidak menentu, seperti musim kemarau yang panjang dan curah hujan ekstrem, semakin sering terjadi. Praktik pertanian berkelanjutan seperti penggunaan mulsa, irigasi tetes, dan penanaman pohon pelindung dapat membantu petani beradaptasi.\n\nDegradasi Tanah: Penggunaan pupuk kimia berlebihan dan pestisida secara terus-menerus telah merusak struktur dan kesuburan tanah di banyak wilayah. Pertanian organik dan penggunaan pupuk kompos dapat memulihkan "kehidupan" tanah.\n\nKetahanan Pangan: Dengan populasi lebih dari 270 juta jiwa, Indonesia membutuhkan pasokan pangan yang stabil dan bergizi. Pertanian berkelanjutan fokus pada diversifikasi tanaman (tidak hanya padi) dan sistem yang tangguh terhadap guncangan, sehingga menjamin ketersediaan pangan di tingkat lokal.\n\nKesejahteraan Petani: Ketergantungan pada pupuk dan pestisida kimia sering kali menjebak petani dalam lingkaran utang. Dengan mengurangi biaya input eksternal dan meningkatkan kesehatan lahan, pendapatan petani dapat menjadi lebih stabil dan meningkat.\n\nPraktik Unggulan Pertanian Berkelanjutan di Indonesia\nKonsep ini bukanlah hal yang mustahil untuk diterapkan. Bahkan, beberapa praktik sudah menyatu dengan kearifan lokal nusantara.\n\nAgroforestri (Wanatani): Sistem ini menggabungkan tanaman pertanian (seperti kopi, kakao, atau sayuran) dengan pepohonan. Contohnya adalah sistem "tumpang sari" di Jawa. Manfaatnya luar biasa: mencegah erosi, menjaga kelembapan tanah, dan memberikan pendapatan ganda bagi petani.\n\nPertanian Organik: Menghindari sepenuhnya penggunaan pestisida dan pupuk kimia sintetis. Sebagai gantinya, petani memanfaatkan kompos, pupuk kandang, dan pestisida nabati. Hasilnya adalah produk yang lebih sehat dan tanah yang lebih subur.\n\nPengendalian Hama Terpadu (PHT): Daripada langsung menyemprotkan pestisida, PHT menggunakan pendekatan yang lebih cerdas. Ini melibatkan pemantauan hama, pemanfaatan musuh alami (seperti burung hantu untuk mengendalikan tikus), dan penggunaan pestisida sebagai pilihan terakhir.\n\nKonservasi Tanah dan Air: Teknik sederhana seperti membuat terasering (sengkedan) di lahan miring, menanam tanaman penutup tanah, dan membuat "rorak" atau lubang biopori dapat secara signifikan mengurangi erosi dan menjaga ketersediaan air.\n\nTantangan dan Jalan ke Depan\nMeskipun potensinya besar, transisi menuju pertanian berkelanjutan tidaklah mudah. Tantangan utamanya meliputi kurangnya akses petani terhadap pengetahuan dan teknologi, modal awal yang terkadang lebih tinggi, serta dukungan pasar yang belum optimal untuk produk-produk berkelanjutan.\n\nUntuk itu, kolaborasi dari semua pihak sangat dibutuhkan:\n\nPemerintah: Perlu membuat kebijakan yang mendukung, memberikan insentif, serta memperkuat program penyuluhan.\n\nPeneliti dan Akademisi: Terus berinovasi untuk menciptakan teknologi pertanian berkelanjutan yang efektif dan terjangkau.\n\nSektor Swasta: Membuka akses pasar yang adil bagi produk-produk pertanian berkelanjutan.\n\nKonsumen: Semakin sadar untuk memilih dan menghargai produk pangan yang dihasilkan dengan cara yang bertanggung jawab.\n\nPenutup\nPertanian berkelanjutan adalah investasi untuk masa depan Indonesia. Ini adalah jalan untuk memastikan bahwa lumbung pangan kita tidak hanya terisi hari ini, tetapi juga tetap melimpah untuk anak cucu kita. Dengan merawat tanah yang memberi kita makan, kita sejatinya sedang merawat masa depan bangsa. Mari bersama-sama mendukung petani dan praktik pertanian yang menjaga harmoni antara manusia dan alam.	/uploads/file-1759737140635-235751171.png	tips	30	t	2025-10-06 14:40:24.327+07	2025-10-19 16:32:39.250412+07
18	3	Pertanian Regeneratif: Memulihkan Bumi sambil Menghasilkan Pangan	Indonesia, sebagai negara agraris, menempatkan sektor pertanian sebagai jantung perekonomian dan ketahanan nasional. Dari hamparan sawah di Jawa hingga perkebunan rempah di Maluku, pertanian adalah denyut nadi kehidupan jutaan rakyatnya. Namun, di tengah tantangan modern seperti perubahan iklim, ledakan populasi, dan degradasi lahan, kita dipaksa untuk bertanya: Sudahkah cara kita bertani saat ini mampu menjamin masa depan?\n\nJawabannya terletak pada sebuah konsep yang semakin mendesak untuk diterapkan: Pertanian Berkelanjutan.\n\nApa Itu Pertanian Berkelanjutan?\nPertanian berkelanjutan bukan sekadar tren, melainkan sebuah pendekatan holistik yang menyeimbangkan tiga pilar utama:\n\nLingkungan (Planet): Praktik pertanian yang ramah lingkungan, menjaga kesehatan tanah, menghemat air, mengurangi penggunaan bahan kimia sintetis, dan melindungi keanekaragaman hayati.\n\nSosial (People): Menjamin kesejahteraan petani, memberdayakan komunitas lokal, serta menyediakan pangan yang sehat dan aman bagi masyarakat luas.\n\nEkonomi (Profit): Memastikan kegiatan pertanian menguntungkan secara ekonomi dalam jangka panjang, tidak hanya untuk satu musim panen. Ini tentang efisiensi, stabilitas, dan viabilitas usaha tani.\n\nSederhananya, pertanian berkelanjutan adalah cara bertani yang memenuhi kebutuhan hari ini tanpa mengorbankan kemampuan generasi mendatang untuk memenuhi kebutuhan mereka.\n\nMengapa Ini Sangat Penting untuk Indonesia?\nPenerapan pertanian berkelanjutan di Indonesia bukan lagi pilihan, melainkan sebuah keharusan. Berikut adalah beberapa alasannya:\n\nAncaman Perubahan Iklim: Pola cuaca yang tidak menentu, seperti musim kemarau yang panjang dan curah hujan ekstrem, semakin sering terjadi. Praktik pertanian berkelanjutan seperti penggunaan mulsa, irigasi tetes, dan penanaman pohon pelindung dapat membantu petani beradaptasi.\n\nDegradasi Tanah: Penggunaan pupuk kimia berlebihan dan pestisida secara terus-menerus telah merusak struktur dan kesuburan tanah di banyak wilayah. Pertanian organik dan penggunaan pupuk kompos dapat memulihkan "kehidupan" tanah.\n\nKetahanan Pangan: Dengan populasi lebih dari 270 juta jiwa, Indonesia membutuhkan pasokan pangan yang stabil dan bergizi. Pertanian berkelanjutan fokus pada diversifikasi tanaman (tidak hanya padi) dan sistem yang tangguh terhadap guncangan, sehingga menjamin ketersediaan pangan di tingkat lokal.\n\nKesejahteraan Petani: Ketergantungan pada pupuk dan pestisida kimia sering kali menjebak petani dalam lingkaran utang. Dengan mengurangi biaya input eksternal dan meningkatkan kesehatan lahan, pendapatan petani dapat menjadi lebih stabil dan meningkat.\n\nPraktik Unggulan Pertanian Berkelanjutan di Indonesia\nKonsep ini bukanlah hal yang mustahil untuk diterapkan. Bahkan, beberapa praktik sudah menyatu dengan kearifan lokal nusantara.\n\nAgroforestri (Wanatani): Sistem ini menggabungkan tanaman pertanian (seperti kopi, kakao, atau sayuran) dengan pepohonan. Contohnya adalah sistem "tumpang sari" di Jawa. Manfaatnya luar biasa: mencegah erosi, menjaga kelembapan tanah, dan memberikan pendapatan ganda bagi petani.\n\nPertanian Organik: Menghindari sepenuhnya penggunaan pestisida dan pupuk kimia sintetis. Sebagai gantinya, petani memanfaatkan kompos, pupuk kandang, dan pestisida nabati. Hasilnya adalah produk yang lebih sehat dan tanah yang lebih subur.\n\nPengendalian Hama Terpadu (PHT): Daripada langsung menyemprotkan pestisida, PHT menggunakan pendekatan yang lebih cerdas. Ini melibatkan pemantauan hama, pemanfaatan musuh alami (seperti burung hantu untuk mengendalikan tikus), dan penggunaan pestisida sebagai pilihan terakhir.\n\nKonservasi Tanah dan Air: Teknik sederhana seperti membuat terasering (sengkedan) di lahan miring, menanam tanaman penutup tanah, dan membuat "rorak" atau lubang biopori dapat secara signifikan mengurangi erosi dan menjaga ketersediaan air.\n\nTantangan dan Jalan ke Depan\nMeskipun potensinya besar, transisi menuju pertanian berkelanjutan tidaklah mudah. Tantangan utamanya meliputi kurangnya akses petani terhadap pengetahuan dan teknologi, modal awal yang terkadang lebih tinggi, serta dukungan pasar yang belum optimal untuk produk-produk berkelanjutan.\n\nUntuk itu, kolaborasi dari semua pihak sangat dibutuhkan:\n\nPemerintah: Perlu membuat kebijakan yang mendukung, memberikan insentif, serta memperkuat program penyuluhan.\n\nPeneliti dan Akademisi: Terus berinovasi untuk menciptakan teknologi pertanian berkelanjutan yang efektif dan terjangkau.\n\nSektor Swasta: Membuka akses pasar yang adil bagi produk-produk pertanian berkelanjutan.\n\nKonsumen: Semakin sadar untuk memilih dan menghargai produk pangan yang dihasilkan dengan cara yang bertanggung jawab.\n\nPenutup\nPertanian berkelanjutan adalah investasi untuk masa depan Indonesia. Ini adalah jalan untuk memastikan bahwa lumbung pangan kita tidak hanya terisi hari ini, tetapi juga tetap melimpah untuk anak cucu kita. Dengan merawat tanah yang memberi kita makan, kita sejatinya sedang merawat masa depan bangsa. Mari bersama-sama mendukung petani dan praktik pertanian yang menjaga harmoni antara manusia dan alam.	/uploads/file-1760344984217-912097469.png	Inovasi Teknologi Pertanian	95	t	2025-10-06 14:52:43.809+07	2025-10-19 16:35:34.182805+07
12	3	Hidroponik: Solusi Pertanian Modern di Lahan Terbatas	Pendahuluan\n\nPertanian konvensional yang mengandalkan lahan luas dan ketersediaan air yang melimpah semakin menghadapi tantangan seiring dengan pesatnya pertumbuhan penduduk dan alih fungsi lahan. Di perkotaan, dimana lahan merupakan barang mewah, kegiatan bercocok tanam hampir mustahil dilakukan. Namun, berkat kemajuan teknologi, hadirlah sistem pertanian modern yang dikenal dengan nama Hidroponik. Hidroponik menawarkan solusi cerdas dan efisien untuk memproduksi bahan pangan secara mandiri, bahkan di halaman rumah atau balkon apartemen sekalipun.\n\nApa Itu Hidroponik?\n\nSecara sederhana, hidroponik adalah metode bercocok tanam tanpa menggunakan tanah sebagai media tumbuhnya. Kata "hidroponik" sendiri berasal dari bahasa Yunani, yaitu hydro yang berarti air dan ponos yang berarti daya. Jadi, hidroponik adalah sistem budidaya tanaman yang memanfaatkan air sebagai media utama untuk menyalurkan nutrisi.\n\nDalam sistem ini, unsur hara yang dibutuhkan tanaman dilarutkan ke dalam air, sehingga akar tanaman dapat menyerapnya secara langsung. Penggunaan media tanam seperti rockwool, sekam bakar, atau cocopeat hanya berfungsi sebagai pijakan akar dan penopang tanaman, bukan sebagai sumber nutrisi.\n\nKeunggulan Sistem Hidroponik\n\nTidak Memerlukan Lahan Luas: Hidroponik bisa diterapkan secara vertikal atau horizontal di ruang terbatas, seperti pekarangan, rooftop, atau garasi.\n\nPenggunaan Air yang Lebih Efisien: Sistem ini hanya menggunakan air sekitar 90% lebih sedikit dibandingkan pertanian konvensional karena air dialirkan secara sirkulasi dan tidak hilang karena peresapan ke dalam tanah.\n\nPertumbuhan Tanaman Lebih Cepat: Karena nutrisi tersedia secara langsung dan mudah diserap oleh akar, tanaman dapat tumbuh hingga 50% lebih cepat.\n\nBebas dari Gulma dan Hama Tanah: Tidak adanya tanah meminimalisir serangan hama dan penyakit yang berasal dari tanah, serta pertumbuhan gulma pengganggu.\n\nHasil Panen Berkualitas dan Higienis: Tanaman tumbuh dalam lingkungan yang lebih terkontrol, sehingga hasil panen cenderung lebih bersih, segar, dan bebas dari residu tanah.\n\nJenis-Jenis Sistem Hidroponik yang Populer\n\nBeberapa sistem hidroponik yang cocok untuk pemula dan skala rumahan antara lain:\n\nNutrient Film Technique (NFT): Sistem dimana larutan nutrisi dialirkan secara tipis (seperti film) melalui saluran (pipa PVC) yang di dalamnya terdapat akar tanaman. Sistem ini sangat efisien untuk tanaman daun seperti selada, kangkung, dan bayam.\n\nDeep Flow Technique (DFT): Mirip dengan NFT, tetapi akar tanaman terendam dalam larutan nutrisi yang lebih dalam dan dialirkan secara terus-menerus.\n\nWick System (Sistem Sumbu): Sistem paling sederhana dan pasif. Larutan nutrisi diserap oleh media tanam menggunakan bantuan sumbu (seperti kain flanel). Cocok untuk tanaman hias atau herba berukuran kecil.\n\nFloating Raft System: Media tanam dan tanaman diapungkan di atas larutan nutrisi dalam wadah tertutup. Akar tanaman akan menjuntai ke bawah dan menyerap nutrisi langsung dari air.\n\nLangkah-Langkah Memulai Hidroponik Sederhana\n\nPilih Sistem: Pilih sistem yang paling sesuai dengan kemampuan dan ruang yang Anda miliki, misalnya Wick System untuk pemula.\n\nSiapkan Bahan: Siapkan wadah (ember/talon), net pot, media tanam (rockwool), larutan nutrisi AB Mix, dan benih tanaman.\n\nSemai Benih: Semai benih pada media rockwool yang telah dibasahi hingga berkecambah.\n\nSiapkan Larutan Nutrisi: Campurkan larutan nutrisi A dan B ke dalam air sesuai takaran yang dianjurkan pada kemasan.\n\nPindahkan Bibit: Setelah bibit memiliki 3-4 daun, pindahkan ke dalam net pot yang telah ditempatkan di wadah berisi larutan nutrisi.\n\nPerawatan: Pantau tinggi air dan nutrisi, pastikan sirkulasi udara baik, dan amati dari serangan hama.\n\nKesimpulan\n\nHidroponik bukan lagi sekadar hobi, melainkan sebuah solusi nyata untuk ketahanan pangan, terutama di daerah perkotaan. Dengan memanfaatkan teknologi ini, siapa pun dapat menjadi petani urban, menyediakan sayuran segar untuk keluarga, sekaligus berkontribusi dalam menghijaukan lingkungan. Mari kita mulai langkah kecil dengan bercocok tanam hidroponik untuk masa depan yang lebih mandiri dan berkelanjutan.	/uploads/file-1759736140330-774335092.png	Inovasi Teknologi Pertanian	5	t	2025-10-05 23:41:33.382+07	2025-10-06 14:35:40.358421+07
\.


--
-- Data for Name: keluhan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.keluhan (id, lahan_id, user_id, kategori, deskripsi, foto_bukti, status, tanggapan, admin_id, tanggal_keluhan, tanggal_selesai) FROM stdin;
3	4	5	pupuk	kjakdjs	\N	diproses	sedang di proses pln	\N	2025-10-13 15:46:44.976+07	\N
4	4	5	irigasi	-	http://localhost:5000/uploads/file-1760347875550-710758558.png	pending	\N	\N	2025-10-13 16:31:15.582+07	\N
5	4	5	hama	-	["http://localhost:5000/uploads/files-1760348739050-123130023.png","http://localhost:5000/uploads/files-1760348739051-433576435.png","http://localhost:5000/uploads/files-1760348739051-620670907.png"]	pending	\N	\N	2025-10-13 16:45:39.092+07	\N
\.


--
-- Data for Name: komentar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.komentar (id, artikel_id, user_id, konten, parent_id, created_at) FROM stdin;
\.


--
-- Data for Name: lahan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lahan (id, user_id, nama_lahan, luas, geometry, centroid, jenis_tanaman, status, alamat, desa, kecamatan, created_at, updated_at) FROM stdin;
4	5	coba	1.69	0103000020E61000000100000011000000344B02D4D4A85B405ED89AADBC941BC028D192C7D3A85B404D672783A3941BC02FA86F99D3A85B40F836FDD98F941BC0BCB20B06D7A85B40827170E998931BC03E7782FDD7A85B403E78EDD286931BC0388600E0D8A85B4011902FA182931BC03752B648DAA85B40B6BFB33D7A931BC0B9FC87F4DBA85B407100FDBE7F931BC0E9D1544FE6A85B40DD41EC4CA1931BC06C96CB46E7A85B4093E2E313B2931BC06C7C26FBE7A85B404983DBDAC2931BC0E2AC889AE8A85B40E84CDA54DD931BC0EE5A423EE8A85B40B5FE9600FC931BC0D2A92B9FE5A85B407A89B14CBF941BC0D3DD7536E4A85B405872158BDF941BC04B766C04E2A85B40CFF3A78DEA941BC0344B02D4D4A85B405ED89AADBC941BC0	0101000020E61000008760C227DEA85B401A5A83B532941BC0	padi	aktif	www	Bintoro	Demak	2025-10-11 19:49:17.375+07	2025-10-11 19:49:17.375+07
\.


--
-- Data for Name: panen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.panen (id, lahan_id, tanggal_panen, jumlah_panen, kualitas, harga_jual, catatan, foto_panen, created_at) FROM stdin;
3	4	2025-10-13	1000.00	baik	10000.00	bulog	\N	2025-10-13 16:02:28.233+07
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tokens (id, token, user_id, type, expires, blacklisted, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nik, name, email, no_telepon, password_hash, role, alamat, foto_profil, is_email_verified, created_at, updated_at) FROM stdin;
3	1234567890123456	Admin Sipadi	admin@sipadi.com	081234567890	$2a$08$B4FKeEDlDGiX.yQ.RPw0M.fCk123rzS4hx1rqKLeUq5Qchw8bB7yO	admin	Jl. Admin No. 1, Indonesia	\N	f	2025-10-05 20:21:15.497+07	2025-10-05 20:21:15.497+07
5	9876543210987654	Petani Sipadi	petani@sipadi.com	081234567891	$2a$08$00jR96qpOH8j7iXbABMwa.FCkvXl/VttrSxWDmHBAneFTnk0jrn42	petani	Jl. Petani No. 1, Indonesia	\N	f	2025-10-05 20:22:25.509+07	2025-10-05 20:22:25.509+07
\.


--
-- Name: artikel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.artikel_id_seq', 18, true);


--
-- Name: keluhan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.keluhan_id_seq', 5, true);


--
-- Name: komentar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.komentar_id_seq', 1, false);


--
-- Name: lahan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lahan_id_seq', 4, true);


--
-- Name: panen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.panen_id_seq', 3, true);


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tokens_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: artikel artikel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artikel
    ADD CONSTRAINT artikel_pkey PRIMARY KEY (id);


--
-- Name: keluhan keluhan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keluhan
    ADD CONSTRAINT keluhan_pkey PRIMARY KEY (id);


--
-- Name: komentar komentar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.komentar
    ADD CONSTRAINT komentar_pkey PRIMARY KEY (id);


--
-- Name: lahan lahan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lahan
    ADD CONSTRAINT lahan_pkey PRIMARY KEY (id);


--
-- Name: panen panen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panen
    ADD CONSTRAINT panen_pkey PRIMARY KEY (id);


--
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_nik_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_nik_key UNIQUE (nik);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_artikel_admin_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_artikel_admin_id ON public.artikel USING btree (admin_id);


--
-- Name: idx_artikel_kategori; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_artikel_kategori ON public.artikel USING btree (kategori);


--
-- Name: idx_keluhan_lahan_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keluhan_lahan_id ON public.keluhan USING btree (lahan_id);


--
-- Name: idx_keluhan_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keluhan_status ON public.keluhan USING btree (status);


--
-- Name: idx_keluhan_tanggal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_keluhan_tanggal ON public.keluhan USING btree (tanggal_keluhan);


--
-- Name: idx_komentar_artikel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_komentar_artikel_id ON public.komentar USING btree (artikel_id);


--
-- Name: idx_komentar_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_komentar_parent_id ON public.komentar USING btree (parent_id);


--
-- Name: idx_lahan_centroid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lahan_centroid ON public.lahan USING gist (centroid);


--
-- Name: idx_lahan_geometry; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lahan_geometry ON public.lahan USING gist (geometry);


--
-- Name: idx_lahan_kecamatan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lahan_kecamatan ON public.lahan USING btree (kecamatan);


--
-- Name: idx_lahan_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lahan_status ON public.lahan USING btree (status);


--
-- Name: idx_lahan_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lahan_user_id ON public.lahan USING btree (user_id);


--
-- Name: idx_panen_lahan_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_panen_lahan_id ON public.panen USING btree (lahan_id);


--
-- Name: idx_panen_tanggal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_panen_tanggal ON public.panen USING btree (tanggal_panen);


--
-- Name: lahan trigger_update_centroid; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_centroid BEFORE INSERT OR UPDATE OF geometry ON public.lahan FOR EACH ROW EXECUTE FUNCTION public.update_lahan_centroid();


--
-- Name: artikel update_artikel_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_artikel_updated_at BEFORE UPDATE ON public.artikel FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lahan update_lahan_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_lahan_updated_at BEFORE UPDATE ON public.lahan FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: artikel artikel_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artikel
    ADD CONSTRAINT artikel_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: keluhan keluhan_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keluhan
    ADD CONSTRAINT keluhan_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: keluhan keluhan_lahan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keluhan
    ADD CONSTRAINT keluhan_lahan_id_fkey FOREIGN KEY (lahan_id) REFERENCES public.lahan(id) ON DELETE CASCADE;


--
-- Name: keluhan keluhan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keluhan
    ADD CONSTRAINT keluhan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: komentar komentar_artikel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.komentar
    ADD CONSTRAINT komentar_artikel_id_fkey FOREIGN KEY (artikel_id) REFERENCES public.artikel(id) ON DELETE CASCADE;


--
-- Name: komentar komentar_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.komentar
    ADD CONSTRAINT komentar_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.komentar(id) ON DELETE CASCADE;


--
-- Name: komentar komentar_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.komentar
    ADD CONSTRAINT komentar_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lahan lahan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lahan
    ADD CONSTRAINT lahan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: panen panen_lahan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.panen
    ADD CONSTRAINT panen_lahan_id_fkey FOREIGN KEY (lahan_id) REFERENCES public.lahan(id) ON DELETE CASCADE;


--
-- Name: tokens tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rm9SzbeefqhS1mb9pG4s3hEDdEAgXkkE8svbAhXxTFqLjwSMyMDAuTapntOrr1Q

