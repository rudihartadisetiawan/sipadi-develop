import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetaniDashboard from './pages/PetaniDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LahanList from './pages/LahanList';
import LahanForm from './pages/LahanForm';
import PanenList from './pages/PanenList';
import PanenForm from './pages/PanenForm';
import KeluhanList from './pages/KeluhanList';
import KeluhanForm from './pages/KeluhanForm';
import KeluhanDetail from './pages/KeluhanDetail';
import ArtikelList from './pages/ArtikelList';
import ArtikelDetail from './pages/ArtikelDetail';
import AdminPetaLahan from './pages/AdminPetaLahan';
import AdminLaporanTerpadu from './pages/AdminLaporanTerpadu';
import AdminAnalitik from './pages/AdminAnalitik';
import AdminManajemenKonten from './pages/AdminManajemenKonten';
import KeluhanEditForm from './pages/KeluhanEditForm';
import ArtikelForm from './pages/ArtikelForm';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Switch>
          {/* Rute publik */}
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          
          {/* Rute terproteksi untuk petani */}
          <ProtectedRoute exact path="/dashboard" component={PetaniDashboard} />
          <ProtectedRoute exact path="/lahan" component={LahanList} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/lahan/create" component={LahanForm} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/lahan/edit/:id" component={LahanForm} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/panen" component={PanenList} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/panen/create" component={PanenForm} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/panen/edit/:id" component={PanenForm} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/keluhan" component={KeluhanList} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/keluhan/create" component={KeluhanForm} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/keluhan/detail/:id" component={KeluhanDetail} allowedRoles={['petani', 'admin']} />
          <ProtectedRoute exact path="/keluhan/edit/:id" component={KeluhanEditForm} allowedRoles={['admin']} />
          <ProtectedRoute exact path="/artikel" component={ArtikelList} allowedRoles={['petani', 'admin']} />
          {/* Pindahkan route edit sebelum route artikel detail untuk menghindari konflik */}
          <ProtectedRoute exact path="/admin/artikel/edit/:id" component={ArtikelForm} allowedRoles={['admin']} />
          <ProtectedRoute exact path="/artikel/:id" component={ArtikelDetail} allowedRoles={['petani', 'admin']} />
          
          {/* Rute terproteksi untuk admin */}
          <ProtectedRoute exact path="/admin/dashboard" component={AdminDashboard} allowedRoles={['admin']} />
          <ProtectedRoute exact path="/admin/peta" component={AdminPetaLahan} allowedRoles={['admin']} />
          <ProtectedRoute exact path="/admin/laporan" component={AdminLaporanTerpadu} allowedRoles={['admin']} />
          <ProtectedRoute exact path="/admin/analitik" component={AdminAnalitik} allowedRoles={['admin']} />
          <ProtectedRoute exact path="/admin/manajemen-konten" component={AdminManajemenKonten} allowedRoles={['admin']} />
          <ProtectedRoute exact path="/admin/artikel/new" component={ArtikelForm} allowedRoles={['admin']} />
          
          {/* Rute default */}
          <Route path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </main>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

function AppRouter() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default AppRouter;
