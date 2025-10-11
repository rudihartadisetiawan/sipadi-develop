# Testing dan Debugging Sistem Sipadi

## API Endpoints yang Digunakan

### Auth Routes
- `POST /v1/auth/register` - Registrasi pengguna baru
- `POST /v1/auth/login` - Login pengguna
- `POST /v1/auth/logout` - Logout pengguna

### Product Routes
- `GET /v1/products` - Mendapatkan semua produk
- `POST /v1/products` - Membuat produk baru
- `GET /v1/products/:id` - Mendapatkan produk berdasarkan ID
- `PUT /v1/products/:id` - Memperbarui produk
- `DELETE /v1/products/:id` - Menghapus produk

### Category Routes
- `GET /v1/categories` - Mendapatkan semua kategori
- `POST /v1/categories` - Membuat kategori baru
- `GET /v1/categories/:id` - Mendapatkan kategori berdasarkan ID
- `PUT /v1/categories/:id` - Memperbarui kategori
- `DELETE /v1/categories/:id` - Menghapus kategori

### User Routes (Admin only)
- `GET /v1/users` - Mendapatkan semua pengguna
- `POST /v1/users` - Membuat pengguna baru
- `GET /v1/users/:id` - Mendapatkan pengguna berdasarkan ID
- `PUT /v1/users/:id` - Memperbarui pengguna
- `DELETE /v1/users/:id` - Menghapus pengguna

### Report (akan diimplementasikan di backend)
- `GET /v1/reports/stock` - Laporan stok produk
- `GET /v1/reports/low-stock` - Laporan produk stok rendah
- `GET /v1/reports/out-of-stock` - Laporan produk habis stok

## Cara Menggunakan Sistem

1. **Registrasi Pengguna Baru**
   - Akses `/register` untuk membuat akun baru
   - Isi formulir dengan informasi yang valid

2. **Login**
   - Akses `/login` untuk masuk ke sistem
   - Gunakan email dan password yang telah didaftarkan
   - Token otentikasi akan disimpan di localStorage

3. **Dashboard**
   - Setelah login, Anda akan diarahkan ke `/dashboard`
   - Dashboard menampilkan ringkasan produk, kategori, dan pengguna

4. **Manajemen Produk**
   - Akses `/products` untuk melihat daftar produk
   - Gunakan `/products/new` untuk menambah produk baru
   - Gunakan `/products/edit/:id` untuk mengedit produk

5. **Manajemen Kategori**
   - Akses `/categories` untuk melihat daftar kategori
   - Gunakan `/categories/new` untuk menambah kategori baru
   - Gunakan `/categories/edit/:id` untuk mengedit kategori

6. **Manajemen Pengguna (Admin only)**
   - Akses `/users` untuk melihat daftar pengguna (hanya untuk admin)
   - Gunakan `/users/new` untuk menambah pengguna baru (hanya untuk admin)
   - Gunakan `/users/edit/:id` untuk mengedit pengguna (hanya untuk admin)

7. **Laporan Inventaris**
   - Akses `/reports` untuk melihat laporan inventaris
   - Pilih jenis laporan dan rentang tanggal yang diinginkan
   - Gunakan tombol "Export Report" untuk mengekspor laporan

## Fitur Keamanan

- Semua rute API dilindungi dengan JWT token
- Middleware otentikasi memastikan hanya pengguna terotentikasi yang dapat mengakses fitur
- Header Authorization otomatis ditambahkan ke setiap permintaan API
- Jika token kadaluarsa, pengguna akan diarahkan ke halaman login

## Error Handling

- Sistem menangani error dari API dan menampilkannya ke pengguna
- Jika terjadi error 401 (Unauthorized), pengguna akan otomatis logout
- Validasi formulir dilakukan di sisi klien sebelum mengirim data ke server

## Testing Manual

1. Pastikan server berjalan di `http://localhost:3000`
2. Pastikan client berjalan di `http://localhost:5173`
3. Lakukan registrasi pengguna baru
4. Lakukan login dengan akun yang telah dibuat
5. Uji fitur CRUD produk dan kategori
6. Jika memiliki akun admin, uji fitur manajemen pengguna
7. Uji fitur laporan inventaris
8. Pastikan logout berfungsi dengan benar
9. Coba akses halaman yang dilindungi tanpa login, harus diarahkan ke halaman login