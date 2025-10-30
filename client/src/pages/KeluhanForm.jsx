import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../lib/api';

const KeluhanForm = () => {
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    lahan_id: '',
    kategori: '',
    deskripsi: '',
    foto_bukti: ''
  });
  
  const [lahans, setLahans] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLahans();
  }, []);

  const fetchLahans = async () => {
    try {
      const response = await api.get('/lahan');
      setLahans(response.results || response);
    } catch (err) {
      setError('Gagal memuat data lahan');
      console.error('Error loading lahans:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert('Anda hanya dapat mengunggah maksimal 3 file.');
      setImageFiles(files.slice(0, 3));
    } else {
      setImageFiles(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedLahanId = parseInt(formData.lahan_id, 10);
    if (isNaN(parsedLahanId)) {
      setError('Lahan harus dipilih. Silakan pilih salah satu lahan dari daftar.');
      return;
    }

    setLoading(true);
    setError(null);

    let imageUrls = [];

    try {
      // 1. Upload images if they exist
      if (imageFiles.length > 0) {
        const uploadFormData = new FormData();
        imageFiles.forEach(file => {
          uploadFormData.append('files', file);
        });

        const uploadResponse = await api.post('/uploads', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrls = uploadResponse.urls;
      }

      // 2. Submit complaint with the image URLs
      const payload = {
        lahan_id: parsedLahanId,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        foto_bukti: imageUrls, // Use the new array of URLs
      };

      await api.post('/keluhan', payload);
      toast.success('Laporan keluhan berhasil dikirim!');
      history.push('/keluhan');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal menyimpan laporan keluhan';
      setError(errorMessage);
      console.error('Error saving keluhan:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Tambah Laporan Keluhan Baru
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

          <div className="sm:col-span-6">
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">
              Kategori Keluhan
            </label>
            <div className="mt-1">
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
              >
                <option value="">Pilih kategori...</option>
                <option value="irigasi">Irigasi</option>
                <option value="hama">Hama</option>
                <option value="pupuk">Pupuk</option>
                <option value="penyakit">Penyakit Tanaman</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
              Deskripsi Keluhan
            </label>
            <div className="mt-1">
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={4}
                value={formData.deskripsi}
                onChange={handleChange}
                required
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                placeholder="Jelaskan secara detail masalah yang terjadi pada lahan Anda..."
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="foto_bukti" className="block text-sm font-medium text-gray-700">
              Foto Bukti (Opsional)
            </label>
            <div className="mt-1">
              <input
                type="file"
                name="foto_bukti"
                id="foto_bukti"
                onChange={handleFileChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                multiple
                accept="image/png, image/jpeg, image/gif"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Unggah hingga 3 gambar bukti (opsional, maks 5MB per file).
            </p>
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
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Kirim Laporan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KeluhanForm;