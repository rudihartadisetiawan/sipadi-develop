import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const ArtikelList = () => {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtikels();
  }, []);

  const fetchArtikels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/artikel');
      setArtikels(response.results || response);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data artikel');
      console.error('Error fetching artikels:', err);
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
          onClick={fetchArtikels}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Artikel Pertanian</h1>

      {artikels.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Belum ada artikel tersedia saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artikels.map((artikel) => (
            <div key={artikel.id} className="bg-white shadow rounded-lg overflow-hidden">
              {artikel.gambar_utama && (
                <img 
                  src={`${import.meta.env.VITE_API_URL.replace('/v1', '')}${artikel.gambar_utama}`} 
                  alt={artikel.judul}
                  className="w-full h-48 object-contain"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{artikel.judul}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Oleh: {artikel.admin?.name} • {new Date(artikel.created_at).toLocaleDateString('id-ID')}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Kategori: {artikel.kategori || 'Umum'} • Dilihat {artikel.views || 0} kali
                </p>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/artikel/${artikel.id}`} 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtikelList;