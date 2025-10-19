import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../lib/api';

const AdminManajemenKonten = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      console.log('Fetching articles...');
      const response = await api.get('/artikel');
      const articlesData = response.results || response;
      console.log('Fetched articles:', articlesData.length);
      setArticles(articlesData);
      
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal memuat data artikel';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Artikel yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a', // green-600
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/artikel/${id}`);
          toast.success('Artikel berhasil dihapus');
          fetchArticles(); // Refetch articles after deletion
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Gagal menghapus artikel';
          toast.error(errorMessage);
          console.error('Error deleting article:', err);
        }
      }
    });
  };

  // Filter articles berdasarkan pencarian
  const filteredArticles = articles.filter(article => {
    try {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        article.judul.toLowerCase().includes(searchTermLower) ||
        article.kategori.toLowerCase().includes(searchTermLower) ||
        (article.admin && article.admin.name && article.admin.name.toLowerCase().includes(searchTermLower))
      );
    } catch (error) {
      console.error('Error filtering article:', article.id, error);
      return true; // Tampilkan artikel jika terjadi error saat filter
    }
  });

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
          onClick={fetchArticles}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Konten - Admin</h1>
        <Link 
          to="/admin/artikel/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Tambah Artikel Baru
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Cari Artikel
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari judul, kategori, atau penulis..."
              className="py-2 px-3 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Artikel</h3>
          <p className="text-2xl font-bold text-green-600">{articles.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Artikel Terpublikasi</h3>
          <p className="text-2xl font-bold text-blue-600">{articles.filter(a => a.published).length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Artikel Draf</h3>
          <p className="text-2xl font-bold text-yellow-600">{articles.filter(a => !a.published).length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Dilihat</h3>
          <p className="text-2xl font-bold text-purple-600">{articles.reduce((sum, a) => sum + a.views, 0)}</p>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penulis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dilihat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{article.judul}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{article.kategori}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{article.admin.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {article.published ? 'Terpublikasi' : 'Draf'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/admin/artikel/edit/${article.id}`} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Tidak ada artikel yang sesuai dengan pencarian Anda.</p>
        </div>
      )}
    </div>
  );
};

export default AdminManajemenKonten;