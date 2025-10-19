import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../lib/api';

const AdminLaporanTerpadu = () => {
  const [reports, setReports] = useState({
    harvestByRegion: [],
    complaintsByStatus: [],
    complaintsByCategory: [],
    recentComplaints: [],
    totalLahan: 0,
    totalPetani: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    kecamatan: ''
  });
  const [kecamatanOptions, setKecamatanOptions] = useState([]);

  useEffect(() => {
    const fetchKecamatanOptions = async () => {
      try {
        const response = await fetch('/batas_kecamatan_demak.geojson');
        const geojsonData = await response.json();
        const options = [...new Set(geojsonData.features.map(feature => feature.properties.WADMKC))].sort();
        setKecamatanOptions(options);
      } catch (error) {
        console.error("Failed to fetch kecamatan options:", error);
      }
    };
    fetchKecamatanOptions();
  }, []);

  useEffect(() => {
    fetchLaporanData();
  }, [filters]);

  const fetchLaporanData = async () => {
    try {
      setLoading(true);

      const [harvestRes, complaintStatusRes, complaintCatRes, dashboardRes] = await Promise.all([
        api.get('/admin/harvest-stats/region', { params: filters }),
        api.get('/admin/complaints-stats/status', { params: filters }),
        api.get('/admin/complaints-stats/category', { params: filters }),
        api.get('/admin/dashboard')
      ]);

      // Add a new, separate call for filtered complaints
      const filteredComplaintsRes = await api.get('/keluhan', { params: filters });
      
      setReports({
        harvestByRegion: harvestRes,
        complaintsByStatus: complaintStatusRes,
        complaintsByCategory: complaintCatRes,
        recentComplaints: filteredComplaintsRes.results || [], // Use the new filtered data
        totalLahan: dashboardRes.totalLahan, // Use the original dashboard data
        totalPetani: dashboardRes.totalPetani // Use the original dashboard data
      });

      setError(null);
    } catch (err) {
      setError('Gagal memuat data laporan');
      console.error('Error fetching laporan data:', err);
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
          onClick={fetchLaporanData}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Laporan Terpadu - Admin</h1>

      {/* Filter Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Filter Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
            />
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
              {kecamatanOptions.map(kec => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Laporan Panen</h3>
          <p className="text-2xl font-bold text-green-600">{reports.harvestByRegion.reduce((sum, item) => sum + item.jumlah_laporan, 0)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Laporan Keluhan</h3>
          <p className="text-2xl font-bold text-yellow-600">{reports.complaintsByStatus.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Lahan Terdaftar</h3>
          <p className="text-2xl font-bold text-blue-600">{reports.totalLahan}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Petani Aktif</h3>
          <p className="text-2xl font-bold text-purple-600">{reports.totalPetani}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harvest by Region Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Jumlah Panen per Kecamatan</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reports.harvestByRegion}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kecamatan" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_panen" name="Total Hasil Panen (kg)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints by Status Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Laporan Keluhan per Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reports.complaintsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reports.complaintsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Complaints by Category Chart */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Laporan Keluhan per Kategori</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reports.complaintsByCategory}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kategori" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Jumlah Laporan" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Laporan Keluhan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lahan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Petani
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.recentComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.lahan?.nama_lahan || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.lahan?.user?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.kategori}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        complaint.status === 'diproses' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {complaint.status === 'pending' ? 'Pending' : 
                       complaint.status === 'diproses' ? 'Diproses' : 'Selesai'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(complaint.tanggal_keluhan).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLaporanTerpadu;