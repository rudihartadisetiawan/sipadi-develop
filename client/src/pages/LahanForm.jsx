import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../lib/api';
import MapInput from '../components/MapInput'; // Impor komponen peta

const LahanForm = () => {
  const { id } = useParams();
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    nama_lahan: '',
    luas: '',
    jenis_tanaman: '',
    alamat: '',
    desa: '',
    kecamatan: '',
    geometry: null, // Tambahkan state untuk geometry
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadLahan();
    }
  }, [id]);

  const loadLahan = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lahan/${id}`);
      setFormData(response);
    } catch (err) {
      setError('Gagal memuat data lahan');
      console.error('Error loading lahan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGeometryChange = (geometry) => {
    setFormData(prev => ({ ...prev, geometry }));
  };

  const handleAreaChange = (areaInHectares) => {
    setFormData(prev => ({ ...prev, luas: areaInHectares.toFixed(4) }));
  };

  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      ...locationData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validasi bahwa geometry tidak null saat membuat lahan baru
      if (!id && !formData.geometry) {
        setError('Silakan gambar lahan terlebih dahulu di peta');
        setLoading(false);
        return;
      }

      // Create a new geometry object with Z dimension removed
      let geometry2D = null;
      if (formData.geometry && formData.geometry.coordinates) {
        geometry2D = {
          ...formData.geometry,
          coordinates: formData.geometry.coordinates.map(ring =>
            ring.map(point => (point.length > 2 ? [point[0], point[1]] : point))
          ),
        };
      }

      // Siapkan data untuk dikirim ke server
      const submitData = {
        ...formData,
        // Pastikan geometry dalam format yang benar
        geometry: geometry2D,
        // Hapus field-field yang tidak diperlukan karena dihitung otomatis di server
        centroid: undefined, // Biarkan server menghitung centroid
      };

      // Hapus undefined values dari submitData
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      console.log('Data yang akan dikirim:', submitData); // Log untuk debugging
      
      if (id) {
        // Update lahan
        await api.patch(`/lahan/${id}`, submitData);
        toast.success('Data lahan berhasil diperbarui!');
      } else {
        // Create lahan
        await api.post('/lahan', submitData);
        toast.success('Lahan baru berhasil ditambahkan!');
      }
      history.push('/lahan');
    } catch (err) {
      console.error('Detil error:', err.response?.data || err.message); // Log detil error
      setError('Gagal menyimpan data lahan: ' + (err.response?.data?.message || err.message));
      console.error('Error saving lahan:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {id ? 'Edit Lahan' : 'Tambah Lahan Baru'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-md p-6 space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="nama_lahan" className="block text-sm font-medium text-gray-700">
              Nama Lahan
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="nama_lahan"
                id="nama_lahan"
                value={formData.nama_lahan}
                onChange={handleChange}
                required
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="luas" className="block text-sm font-medium text-gray-700">
              Luas (Hektar)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="luas"
                id="luas"
                value={formData.luas}
                onChange={handleChange}
                required
                readOnly // Make the field read-only
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="jenis_tanaman" className="block text-sm font-medium text-gray-700">
              Jenis Tanaman
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="jenis_tanaman"
                id="jenis_tanaman"
                value={formData.jenis_tanaman}
                onChange={handleChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700">
              Kecamatan
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="kecamatan"
                id="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
                disabled={!!id}
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="desa" className="block text-sm font-medium text-gray-700">
              Desa
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="desa"
                id="desa"
                value={formData.desa}
                onChange={handleChange}
                disabled={!!id}
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Poligon Lahan di Peta
            </label>
            <MapInput 
              onGeometryChange={handleGeometryChange} 
              onAreaChange={handleAreaChange} 
              onLocationChange={handleLocationChange} 
              initialGeometry={formData.geometry}
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
              Alamat Lengkap
            </label>
            <div className="mt-1">
              <textarea
                id="alamat"
                name="alamat"
                rows={3}
                value={formData.alamat}
                onChange={handleChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => history.push('/lahan')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : (id ? 'Update' : 'Simpan')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LahanForm;