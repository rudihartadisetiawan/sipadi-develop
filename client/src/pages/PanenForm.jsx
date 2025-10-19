import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import api from '../lib/api';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const PanenForm = () => {
  const { id } = useParams();
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    lahan_id: '',
    tanggal_panen: '',
    jumlah_panen: '',
    kualitas: '',
    harga_jual: '',
    catatan: ''
  });
  
  const [lahans, setLahans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLahans();
    if (id) {
      loadPanen();
    }
  }, [id]);

  const fetchLahans = async () => {
    try {
      const response = await api.get('/lahan');
      setLahans(response.results || response);
    } catch (err) {
      setError('Gagal memuat data lahan');
      console.error('Error loading lahans:', err);
    }
  };

  const loadPanen = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/panen/${id}`);
      setFormData({
        ...response,
        tanggal_panen: format(parseISO(response.tanggal_panen), 'yyyy-MM-dd')
      });
    } catch (err) {
      setError('Gagal memuat data laporan panen');
      console.error('Error loading panen:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        // Update panen
        await api.patch(`/panen/${id}`, formData);
      } else {
        // Create panen
        await api.post('/panen', formData);
      }
      history.push('/panen');
    } catch (err) {
      setError('Gagal menyimpan laporan panen');
      console.error('Error saving panen:', err);
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
        {id ? 'Edit Laporan Panen' : 'Tambah Laporan Panen Baru'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-md p-6 space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="lahan_id" className="block text-sm font-medium text-gray-700">
              Pilih Lahan
            </label>
            <div className="mt-1">
              <select
                id="lahan_id"
                name="lahan_id"
                value={formData.lahan_id}
                onChange={handleChange}
                required
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              >
                <option value="">Pilih lahan...</option>
                {lahans.map((lahan) => (
                  <option key={lahan.id} value={lahan.id}>
                    {lahan.nama_lahan} - {lahan.desa}, {lahan.kecamatan}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="tanggal_panen" className="block text-sm font-medium text-gray-700">
              Tanggal Panen
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="tanggal_panen"
                id="tanggal_panen"
                value={formData.tanggal_panen}
                onChange={handleChange}
                required
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="jumlah_panen" className="block text-sm font-medium text-gray-700">
              Jumlah Hasil Panen (kg)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="jumlah_panen"
                id="jumlah_panen"
                value={formData.jumlah_panen}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="kualitas" className="block text-sm font-medium text-gray-700">
              Kualitas Hasil
            </label>
            <div className="mt-1">
              <select
                id="kualitas"
                name="kualitas"
                value={formData.kualitas}
                onChange={handleChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              >
                <option value="">Pilih kualitas...</option>
                <option value="baik">Baik</option>
                <option value="sedang">Sedang</option>
                <option value="kurang">Kurang</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="harga_jual" className="block text-sm font-medium text-gray-700">
              Harga Jual (Rp/kg)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="harga_jual"
                id="harga_jual"
                value={formData.harga_jual || ''}
                onChange={handleChange}
                min="0"
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">
              Catatan (Opsional)
            </label>
            <div className="mt-1">
              <textarea
                id="catatan"
                name="catatan"
                rows={3}
                value={formData.catatan}
                onChange={handleChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => history.push('/panen')}
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

export default PanenForm;