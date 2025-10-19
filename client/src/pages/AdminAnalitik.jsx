import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../lib/api';

const AdminAnalitik = () => {
  const [analytics, setAnalytics] = useState({
    harvestTrend: [],
    regionalComparison: [],
    seasonalAnalysis: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    kecamatan: ''
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics', { params: filters });
      setAnalytics(response);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data analitik');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
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
          onClick={fetchAnalyticsData}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const totalHarvest = analytics.harvestTrend.reduce((sum, item) => sum + parseFloat(item.hasil_panen || 0), 0);
  const totalArea = analytics.regionalComparison.reduce((sum, item) => sum + parseFloat(item.luas_lahan || 0), 0);
  const averageProductivity = totalArea > 0 ? (totalHarvest / 1000) / totalArea : 0; // in ton/Ha

  const peakHarvestMonth = analytics.harvestTrend.length > 0
    ? analytics.harvestTrend.reduce((max, item) => parseFloat(item.hasil_panen) > parseFloat(max.hasil_panen) ? item : max).bulan
    : 'N/A';

  const topRegion = analytics.regionalComparison.length > 0
    ? analytics.regionalComparison.reduce((max, item) => parseFloat(item.hasil_panen) > parseFloat(max.hasil_panen) ? item : max).kecamatan
    : 'N/A';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analitik Pertanian - Admin</h1>

      {/* Filter Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Filter Analitik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Tahun
            </label>
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
          <div>
            <label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700 mb-1">
              Kecamatan
            </label>
            <select
              id="kecamatan"
              name="kecamatan"
              value={filters.kecamatan}
              onChange={handleFilterChange}
              className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
            >
              <option value="">Semua Kecamatan</option>
              <option value="Wonosalam">Wonosalam</option>
              <option value="Dempet">Dempet</option>
              <option value="Gajah">Gajah</option>
              <option value="Karanganyar">Karanganyar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Hasil Panen (Tahun Ini)</h3>
          <p className="text-2xl font-bold text-green-600">{(totalHarvest / 1000).toFixed(1)} ton</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Luas Lahan Panen (Tahun Ini)</h3>
          <p className="text-2xl font-bold text-blue-600">{totalArea.toFixed(2)} Ha</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Produktivitas Rata-rata</h3>
          <p className="text-2xl font-bold text-yellow-600">{averageProductivity.toFixed(2)} ton/Ha</p>
        </div>
      </div>

      {/* Trend Analisis Panen */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tren Hasil Panen Tahunan</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics.harvestTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="bulan" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="hasil_panen" stroke="#10b981" fillOpacity={1} fill="url(#colorUv)" name="Hasil Panen (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Perbandingan Wilayah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Perbandingan Hasil Panen per Kecamatan</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.regionalComparison}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kecamatan" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hasil_panen" name="Hasil Panen (kg)" stroke="#10b981" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="luas_lahan" name="Luas Lahan (Ha)" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analisis Musiman</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics.seasonalAnalysis}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="musim" angle={-45} textAnchor="end" height={60} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="hasil_panen" name="Hasil Panen (kg)" stroke="#10b981" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="produktivitas" name="Produktivitas (ton/Ha)" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Wawasan Analitik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="font-medium text-green-800">Puncak Musim Panen</h3>
            <p className="text-sm text-green-600 mt-1">
              {peakHarvestMonth !== 'N/A'
                ? `Puncak panen terjadi di bulan ${peakHarvestMonth}.`
                : 'Data tidak tersedia.'}
            </p>
          </div>
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-medium text-blue-800">Wilayah Tertinggi</h3>
            <p className="text-sm text-blue-600 mt-1">
              {topRegion !== 'N/A'
                ? `Kecamatan ${topRegion} memiliki hasil panen tertinggi.`
                : 'Data tidak tersedia.'}
            </p>
          </div>
          <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
            <h3 className="font-medium text-yellow-800">Tren Tahunan</h3>
            <p className="text-sm text-yellow-600 mt-1">Perbandingan data tahunan belum tersedia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalitik;