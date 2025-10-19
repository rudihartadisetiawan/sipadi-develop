import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import api, { API_BASE_URL } from '../lib/api';

const KeluhanDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [keluhan, setKeluhan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKeluhan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/keluhan/${id}`);
        setKeluhan(response);
        setError(null);
      } catch (err) {
        setError('Gagal memuat detail keluhan.');
        console.error('Error fetching keluhan detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeluhan();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'diproses':
        return 'bg-blue-100 text-blue-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !keluhan) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-red-700">{error || 'Data keluhan tidak ditemukan.'}</p>
        <button onClick={() => history.push('/keluhan')} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md">
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detail Laporan Keluhan</h1>
        <button onClick={() => history.goBack()} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
          Kembali
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Lahan: {keluhan.lahan?.nama_lahan || 'N/A'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {keluhan.lahan?.desa}, {keluhan.lahan?.kecamatan}
              </p>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadge(keluhan.status)}`}>
              {keluhan.status}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tanggal Laporan</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(keluhan.tanggal_keluhan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Kategori</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {keluhan.kategori}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Deskripsi Masalah</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {keluhan.deskripsi}
              </dd>
            </div>
            {keluhan.foto_bukti && keluhan.foto_bukti.length > 0 && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Foto Bukti</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-4">
                    {keluhan.foto_bukti.map((url, index) => (
                      <a key={index} href={`${API_BASE_URL}${url}`} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={`${API_BASE_URL}${url}`} 
                          alt={`Bukti keluhan ${index + 1}`}
                          className="rounded-lg max-w-xs h-40 w-40 object-cover border border-gray-200 hover:opacity-80 transition-opacity" 
                        />
                      </a>
                    ))}
                  </div>
                </dd>
              </div>
            )}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
              <dt className="text-sm font-medium text-gray-700">Tanggapan Admin</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {keluhan.tanggapan || 'Belum ada tanggapan dari admin.'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default KeluhanDetail;