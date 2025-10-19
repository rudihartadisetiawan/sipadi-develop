import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const PetaniDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/petani');
      setDashboardData(response);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data dashboard');
      console.error('Error fetching dashboard data:', err);
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
          onClick={fetchDashboardData}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Petani</h1>
        <p className="text-gray-600">Selamat datang di Sipadi - Sistem Informasi Pertanian Demak</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Jumlah Lahan</h3>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.summary?.lahanCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Laporan Panen</h3>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.summary?.panenCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Laporan Keluhan</h3>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.summary?.keluhanCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Artikel Terbaru</h3>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.artikel?.recent?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Panens */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Laporan Panen Terbaru</h2>
          {dashboardData?.panen?.latest && dashboardData.panen.latest.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {dashboardData.panen.latest.map((panen) => (
                <li key={panen.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {panen.lahan.nama_lahan}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(panen.tanggal_panen).toLocaleDateString('id-ID')} • {panen.jumlah_panen} kg
                      </p>
                    </div>
                    <Link to={`/panen/edit/${panen.id}`} className="text-sm text-green-600 hover:text-green-900">
                      Lihat
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Belum ada laporan panen</p>
          )}
        </div>

        {/* Recent Complaints */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Laporan Keluhan Terbaru</h2>
          {dashboardData?.keluhan?.latest && dashboardData.keluhan.latest.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {dashboardData.keluhan.latest.map((keluhan) => (
                <li key={keluhan.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {keluhan.lahan.nama_lahan}
                      </p>
                      <p className="text-sm text-gray-500">
                        {keluhan.kategori} • {keluhan.status}
                      </p>
                    </div>
                    <Link to={`/keluhan/edit/${keluhan.id}`} className="text-sm text-green-600 hover:text-green-900">
                      Lihat
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Belum ada laporan keluhan</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/lahan/create" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center transition duration-150 ease-in-out"
          >
            Tambah Lahan
          </Link>
          <Link 
            to="/panen/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center transition duration-150 ease-in-out"
          >
            Laporan Panen
          </Link>
          <Link 
            to="/keluhan/create" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-center transition duration-150 ease-in-out"
          >
            Lapor Keluhan
          </Link>
          <Link 
            to="/artikel" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-center transition duration-150 ease-in-out"
          >
            Artikel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetaniDashboard;