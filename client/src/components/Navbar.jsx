import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getCurrentUser, logout } from '../lib/auth';

const Navbar = () => {
  const history = useHistory();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="text-xl font-bold">
              Sipadi
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {user && user.role === 'petani' && (
                  <>
                    <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Dashboard
                    </Link>
                    <Link to="/lahan" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Lahan Saya
                    </Link>
                    <Link to="/panen" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Laporan Panen
                    </Link>
                    <Link to="/keluhan" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Laporan Keluhan
                    </Link>
                    <Link to="/artikel" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Artikel
                    </Link>
                    <Link to="/peta-toko" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Peta Toko
                    </Link>
                  </>
                )}
                {user && user.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Dashboard
                    </Link>
                    <Link to="/admin/peta" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Peta Lahan
                    </Link>
                    <Link to="/admin/laporan" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Laporan Terpadu
                    </Link>
                    <Link to="/admin/analitik" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Analitik
                    </Link>
                    <Link to="/admin/manajemen-konten" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Manajemen Konten
                    </Link>
                    <Link to="/keluhan" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Manajemen Keluhan
                    </Link>
                    <Link to="/admin/toko" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                      Manajemen Toko
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm hidden md:inline">Halo, {user.nama}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;