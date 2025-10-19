import { Link } from 'react-router-dom';
import { getCurrentUser, logout } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">Sipadi - Sistem Inventaris Persediaan Barang</Link>
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user.username || user.email}</span>
              <ul className="flex space-x-4">
                <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
                <li><Link to="/products" className="hover:underline">Products</Link></li>
                <li><Link to="/categories" className="hover:underline">Categories</Link></li>
                <li><Link to="/reports" className="hover:underline">Reports</Link></li>
                {user.role === 'admin' && (
                  <li><Link to="/users" className="hover:underline">Users</Link></li>
                )}
                <li>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <ul className="flex space-x-4">
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/register" className="hover:underline">Register</Link></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;