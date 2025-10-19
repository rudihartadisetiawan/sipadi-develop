import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const LahanList = () => {
  const [lahans, setLahans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLahans();
  }, []);

  const fetchLahans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lahan');
      setLahans(response.results || response);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data lahan');
      console.error('Error fetching lahan:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLahan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lahan ini?')) {
      try {
        await api.delete(`/lahan/${id}`);
        fetchLahans(); // Refresh the list
      } catch (err) {
        setError('Gagal menghapus lahan');
        console.error('Error deleting lahan:', err);
      }
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
          onClick={fetchLahans}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Lahan Saya</h1>
        <Link 
          to="/lahan/create" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Tambah Lahan
        </Link>
      </div>

      {lahans.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Anda belum memiliki lahan. Silakan tambah lahan pertama Anda.</p>
          <Link 
            to="/lahan/create" 
            className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Tambah Lahan
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {lahans.map((lahan) => (
              <li key={lahan.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-green-600 truncate">
                      {lahan.nama_lahan}
                    </h3>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/lahan/edit/${lahan.id}`} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteLahan(lahan.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Luas: {lahan.luas} Ha
                      </p>
                      <span className="mx-2">•</span>
                      <p className="flex items-center text-sm text-gray-500">
                        Jenis Tanaman: {lahan.jenis_tanaman || 'N/A'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Desa: {lahan.desa || 'N/A'}</p>
                      <span className="mx-2">•</span>
                      <p>Kecamatan: {lahan.kecamatan || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LahanList;