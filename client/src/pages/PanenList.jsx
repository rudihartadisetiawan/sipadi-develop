import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const PanenList = () => {
  const [panens, setPanens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPanens();
  }, []);

  const fetchPanens = async () => {
    try {
      setLoading(true);
      const response = await api.get('/panen');
      setPanens(response.results || response);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data laporan panen');
      console.error('Error fetching panens:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePanen = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan panen ini?')) {
      try {
        await api.delete(`/panen/${id}`);
        fetchPanens(); // Refresh the list
      } catch (err) {
        setError('Gagal menghapus laporan panen');
        console.error('Error deleting panen:', err);
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
          onClick={fetchPanens}
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
        <h1 className="text-2xl font-bold text-gray-900">Laporan Panen</h1>
        <Link 
          to="/panen/create" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Tambah Laporan Panen
        </Link>
      </div>

      {panens.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Anda belum memiliki laporan panen. Silakan tambah laporan pertama Anda.</p>
          <Link 
            to="/panen/create" 
            className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Tambah Laporan Panen
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {panens.map((panen) => (
              <li key={panen.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-green-600 truncate">
                      {panen.lahan?.nama_lahan || 'Lahan tidak ditemukan'}
                    </h3>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/panen/edit/${panen.id}`} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deletePanen(panen.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Tanggal: {new Date(panen.tanggal_panen).toLocaleDateString('id-ID')}
                      </p>
                      <span className="mx-2">•</span>
                      <p className="flex items-center text-sm text-gray-500">
                        Jumlah: {panen.jumlah_panen} kg
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Kualitas: {panen.kualitas || 'N/A'}</p>
                      {panen.harga_jual && (
                        <>
                          <span className="mx-2">•</span>
                          <p>Rp{panen.harga_jual.toLocaleString()}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {panen.catatan && (
                    <div className="mt-2 text-sm text-gray-500">
                      Catatan: {panen.catatan}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PanenList;