import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const KeluhanList = () => {
  const currentUser = getCurrentUser();
  const [keluhans, setKeluhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKeluhans();
  }, []);

  const fetchKeluhans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/keluhan');
      setKeluhans(response.results || response);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data laporan keluhan');
      console.error('Error fetching keluhans:', err);
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
          onClick={fetchKeluhans}
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
        <h1 className="text-2xl font-bold text-gray-900">Laporan Keluhan</h1>
        <Link 
          to="/keluhan/create" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Tambah Laporan Keluhan
        </Link>
      </div>

      {keluhans.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Anda belum memiliki laporan keluhan. Silakan tambah laporan pertama Anda.</p>
          <Link 
            to="/keluhan/create" 
            className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Tambah Laporan Keluhan
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {keluhans.map((keluhan) => (
              <li key={keluhan.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-green-600 truncate">
                      {keluhan.lahan?.nama_lahan || 'Lahan tidak ditemukan'}
                    </h3>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${keluhan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        keluhan.status === 'diproses' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {keluhan.status === 'pending' ? 'Pending' : 
                       keluhan.status === 'diproses' ? 'Diproses' : 'Selesai'}
                    </span>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Kategori: {keluhan.kategori}
                      </p>
                      <span className="mx-2">•</span>
                      <p className="flex items-center text-sm text-gray-500">
                        {new Date(keluhan.tanggal_keluhan).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Status: {keluhan.status === 'pending' ? 'Menunggu' : 
                                keluhan.status === 'diproses' ? 'Diproses' : 'Selesai'}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Deskripsi: {keluhan.deskripsi}
                  </div>
                  {keluhan.tanggapan && (
                    <div className="mt-2 text-sm text-blue-500">
                      <strong>Tanggapan Admin:</strong> {keluhan.tanggapan}
                    </div>
                  )}
                  {keluhan.foto_bukti && keluhan.foto_bukti.length > 0 && (
                    <div className="mt-2">
                      <div className="relative w-24 h-24">
                        <a href={keluhan.foto_bukti[0]} target="_blank" rel="noopener noreferrer" title="Lihat gambar bukti">
                          <img 
                            src={keluhan.foto_bukti[0]} 
                            alt="Foto bukti 1" 
                            className="h-24 w-24 object-cover rounded-md border border-gray-200 hover:opacity-80 transition-opacity"
                          />
                        </a>
                        {keluhan.foto_bukti.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-gray-800 bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
                            +{keluhan.foto_bukti.length - 1}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex space-x-4">
                    {currentUser && currentUser.role === 'admin' ? (
                      <Link 
                        to={`/keluhan/edit/${keluhan.id}`} 
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        Tanggapi / Edit
                      </Link>
                    ) : (
                      <Link 
                        to={`/keluhan/detail/${keluhan.id}`} 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        Lihat Detail
                      </Link>
                    )}


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

export default KeluhanList;