'use strict';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'react-toastify';
import MapInput from '../components/MapInput';

const AdminTokoForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState({
    nama_toko: '',
    jam_buka: '',
    jam_tutup: '',
    produk: '',
    status: 'aktif',
    geometry: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchToko = async () => {
        try {
          setLoading(true);
          const data = await api.get(`/toko/${id}`);
          setFormData({
            ...data,
            jam_buka: data.jam_buka?.substring(0, 5) || '',
            jam_tutup: data.jam_tutup?.substring(0, 5) || '',
          });
        } catch (err) {
          toast.error('Gagal memuat data toko.');
          setError('Gagal memuat data toko.');
        } finally {
          setLoading(false);
        }
      };
      fetchToko();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGeometryChange = (geometry) => {
    setFormData((prev) => ({ ...prev, geometry }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.geometry) {
      setError('Silakan tandai lokasi toko di peta.');
      return;
    }

    setLoading(true);
    setError(null);

    // Create a clean payload with only the allowed fields
    const payload = {
      nama_toko: formData.nama_toko,
      jam_buka: formData.jam_buka || null,
      jam_tutup: formData.jam_tutup || null,
      produk: formData.produk,
      status: formData.status,
      // Ensure geometry is a clean object, stripping properties like 'crs'
      geometry: {
        type: formData.geometry.type,
        coordinates: formData.geometry.coordinates,
      },
    };

    try {
      if (id) {
        await api.patch(`/toko/${id}`, payload);
        toast.success('Data toko berhasil diperbarui!');
      } else {
        await api.post('/toko', payload);
        toast.success('Toko baru berhasil ditambahkan!');
      }
      history.push('/admin/toko', { refresh: Math.random() });
    } catch (err) {
      const message = err.response?.data?.message || (id ? 'Gagal memperbarui toko' : 'Gagal membuat toko');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {id ? 'Edit Toko Pertanian' : 'Tambah Toko Pertanian Baru'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-md p-6 space-y-6">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="nama_toko" className="block text-sm font-medium text-gray-700">Nama Toko</label>
            <input type="text" name="nama_toko" id="nama_toko" value={formData.nama_toko} onChange={handleChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="jam_buka" className="block text-sm font-medium text-gray-700">Jam Buka</label>
            <input type="time" name="jam_buka" id="jam_buka" value={formData.jam_buka} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="jam_tutup" className="block text-sm font-medium text-gray-700">Jam Tutup</label>
            <input type="time" name="jam_tutup" id="jam_tutup" value={formData.jam_tutup} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="produk" className="block text-sm font-medium text-gray-700">Produk yang Dijual</label>
            <textarea name="produk" id="produk" value={formData.produk} onChange={handleChange} rows="3" className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" placeholder="Contoh: Pupuk Urea, Pestisida, Bibit Padi..."></textarea>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md">
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non-Aktif</option>
            </select>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Toko</label>
            <MapInput
              geometryType="Point"
              onGeometryChange={handleGeometryChange}
              initialGeometry={formData.geometry}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => history.push('/admin/toko')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
            Batal
          </button>
          <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTokoForm;
