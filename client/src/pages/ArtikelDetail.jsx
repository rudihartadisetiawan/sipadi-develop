import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api, { API_BASE_URL } from '../lib/api';

const ArtikelDetail = () => {
  const params = useParams();
  const location = useLocation();
  const { id: idFromParams } = params;
  
  // Jika useParams tidak memberikan ID, coba deteksi dari URL
  const match = location.pathname.match(/\/artikel\/(\d+)/);
  const idFromUrl = match ? match[1] : null;
  
  const id = idFromParams || idFromUrl;
  
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchArtikel();
    } else {
      setError('ID artikel tidak ditemukan');
      setLoading(false);
    }
  }, [id]);

  // Effect to increment view count, runs only once on mount
  useEffect(() => {
    if (id) {
      const incrementView = async () => {
        try {
          await api.post(`/artikel/${id}/view`);
        } catch (err) {
          // Log error but don't show it to the user, as it's not critical
          console.error('Failed to increment view count:', err);
        }
      };
      incrementView();
    }
  }, [id]); // Dependency on ID ensures it runs for new pages but not on re-renders

  const fetchArtikel = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/artikel/${id}`);
      setArtikel(response);
      setError(null);
    } catch (err) {
      setError('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchArtikel}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/artikel" className="text-green-600 hover:text-green-800 text-sm">
        &larr; Kembali ke daftar artikel
      </Link>

      {artikel && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {artikel.gambar_utama && (
            <img 
              src={`${API_BASE_URL}${artikel.gambar_utama}`} 
              alt={artikel.judul}
              className="w-full h-64 object-contain"
            />
          )}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{artikel.judul}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>Oleh: {artikel.admin?.name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(artikel.created_at).toLocaleDateString('id-ID')}</span>
              <span className="mx-2">•</span>
              <span>Kategori: {artikel.kategori || 'Umum'}</span>
              <span className="mx-2">•</span>
              <span>Dilihat {artikel.views || 0} kali</span>
            </div>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {artikel.konten}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtikelDetail;