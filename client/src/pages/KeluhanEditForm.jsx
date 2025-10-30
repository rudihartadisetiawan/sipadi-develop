import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import api from '../lib/api';

const KeluhanEditForm = () => {
  const { id } = useParams();
  const history = useHistory();
  
  const [originalKeluhan, setOriginalKeluhan] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    tanggapan: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadKeluhan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/keluhan/${id}`);
        setOriginalKeluhan(response);
        setFormData({
          status: response.status || 'pending',
          tanggapan: response.tanggapan || ''
        });
      } catch (err) {
        setError('Gagal memuat data laporan keluhan');
        console.error('Error loading keluhan:', err);
      } finally {
        setLoading(false);
      }
    };

    loadKeluhan();
  }, [id]);

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
      await api.patch(`/keluhan/${id}`, formData);
      history.push('/keluhan');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal memperbarui laporan keluhan';
      setError(errorMessage);
      console.error('Error updating keluhan:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !originalKeluhan) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-red-700">{error || 'Data keluhan tidak ditemukan.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tanggapi Laporan Keluhan</h1>

      {/* Display original complaint data as read-only */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Petani</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{originalKeluhan.lahan?.user?.name || 'N/A'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Lahan</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{originalKeluhan.lahan?.nama_lahan || 'N/A'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Deskripsi Masalah</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{originalKeluhan.deskripsi}</dd>
            </div>
            {originalKeluhan.foto_bukti && originalKeluhan.foto_bukti.length > 0 && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Foto Bukti</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-4">
                    {originalKeluhan.foto_bukti.map((url, index) => (
                      <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={url} 
                          alt={`Bukti keluhan ${index + 1}`}
                          className="rounded-lg max-w-xs h-40 w-40 object-cover border border-gray-200 hover:opacity-80 transition-opacity" 
                        />
                      </a>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Form for admin to update status and tanggapan */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-md p-6 space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Ubah Status
            </label>
            <div className="mt-1">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="tanggapan" className="block text-sm font-medium text-gray-700">
              Tanggapan Admin
            </label>
            <div className="mt-1">
              <textarea
                id="tanggapan"
                name="tanggapan"
                rows={4}
                value={formData.tanggapan}
                onChange={handleChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                placeholder="Berikan tanggapan atau solusi untuk keluhan ini..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => history.push('/keluhan')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Update Laporan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KeluhanEditForm;