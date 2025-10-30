'use strict';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AdminTokoList = () => {
  const [tokos, setTokos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchTokos();
  }, [location]);

  const fetchTokos = async () => {
    try {
      setLoading(true);
      // Admin gets all shops, including non-aktif
      const response = await api.get('/toko', { params: { status: 'all' } });
      setTokos(response.results || []);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data toko pertanian');
      console.error('Error fetching toko:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data toko yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/toko/${id}`);
          toast.success('Toko berhasil dihapus');
          fetchTokos();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Gagal menghapus toko');
        }
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Toko Pertanian</h1>
        <Link to="/admin/toko/create" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
          Tambah Toko
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Toko</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Operasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tokos.length > 0 ? (
              tokos.map((toko) => (
                <tr key={toko.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{toko.nama_toko}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{toko.jam_buka} - {toko.jam_tutup}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        toko.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {toko.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/toko/edit/${toko.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(toko.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Belum ada data toko.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTokoList;
