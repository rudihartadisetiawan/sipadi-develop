import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const ArtikelForm = () => {
  const params = useParams();
  const [judul, setJudul] = useState('');
  const [konten, setKonten] = useState('');
  const [kategori, setKategori] = useState('');
  const [published, setPublished] = useState(false); // false for Draft, true for Published
  const [gambarUtama, setGambarUtama] = useState('');
  const [gambarFile, setGambarFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  
  // Coba dapatkan id dari useParams terlebih dahulu
  const { id: idFromParams } = params;
  
  // Jika useParams tidak memberikan ID, coba deteksi dari URL
  const location = useLocation();
  const match = location.pathname.match(/\/admin\/artikel\/edit\/(\d+)/);
  const idFromUrl = match ? match[1] : null;
  
  // Gunakan id dari URL jika tidak ada dari useParams
  const id = idFromParams || idFromUrl;
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        setLoading(true);
        try {
          const article = await api.get(`/artikel/${id}`);
          if (article) {
            setJudul(article.judul);
            setKonten(article.konten);
            setKategori(article.kategori);
            setPublished(article.published || false);
            setGambarUtama(article.gambar_utama || '');
          } else {
            // Handle case where article is null/undefined from API
            setError('Gagal memuat data artikel: Artikel tidak ditemukan.');
          }
        } catch (err) {
          setError('Gagal memuat artikel');
          console.error('Error fetching article:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, isEdit]);

  const handleFileChange = (e) => {
    setGambarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const user = getCurrentUser();
    if (!user || !user.id || user.role !== 'admin') {
      setError('Hanya admin yang dapat membuat atau mengedit artikel.');
      setLoading(false);
      return;
    }

    let imageUrl = gambarUtama;

    if (gambarFile) {
      const formData = new FormData();
      formData.append('file', gambarFile);

      try {
        const response = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = response.url;
      } catch (err) {
        setError('Gagal mengunggah gambar');
        console.error('Error uploading image:', err);
        setLoading(false);
        return;
      }
    }

    const articleData = {
      judul,
      konten,
      kategori,
      published,
      gambar_utama: imageUrl,
    };

    try {
      if (isEdit) {
        await api.put(`/artikel/${id}`, articleData);
      } else {
        await api.post('/artikel', articleData);
      }
      history.push('/admin/manajemen-konten');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
      console.error('Error submitting article:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Artikel' : 'Tambah Artikel Baru'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
            Judul
          </label>
          <input
            type="text"
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="konten" className="block text-sm font-medium text-gray-700">
            Konten
          </label>
          <textarea
            id="konten"
            rows="10"
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
            required
            className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div>
          <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <input
            type="text"
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={published}
            onChange={(e) => setPublished(e.target.value === 'true')}
            className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
          >
            <option value="false">Draft</option>
            <option value="true">Publish</option>
          </select>
        </div>
        <div>
          <label htmlFor="gambarFile" className="block text-sm font-medium text-gray-700">
            Gambar Utama
          </label>
          <input
            type="file"
            id="gambarFile"
            onChange={handleFileChange}
            className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
          />
          {gambarUtama && !gambarFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Gambar saat ini:</p>
              <img src={`${import.meta.env.VITE_API_URL.replace('/v1', '')}${gambarUtama}`} alt="Gambar Utama" className="mt-2 w-32 h-32 object-cover rounded" />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => history.push('/admin/manajemen-konten')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Simpan Artikel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArtikelForm;
