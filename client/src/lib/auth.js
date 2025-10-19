import { jwtDecode } from 'jwt-decode';

// Fungsi untuk menyimpan token ke localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Fungsi untuk mendapatkan token dari localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Fungsi untuk menghapus token
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Fungsi untuk mengecek apakah user sudah login
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Cek apakah token masih valid (belum expired)
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

// Fungsi untuk mendapatkan informasi user dari localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Fungsi untuk login
export const login = async (nik, password) => {
  try {
    const response = await fetch('http://localhost:5000/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nik, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Simpan token ke localStorage
      setAuthToken(data.tokens.access.token);
      // Simpan data pengguna ke localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return { success: true, user: data.user, tokens: data.tokens };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error' };
  }
};

// Fungsi untuk register
export const register = async (nik, nama, email, password, no_telepon, alamat) => {
  try {
    const response = await fetch('http://localhost:5000/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        nik, 
        nama, 
        email, 
        password,
        no_telepon,
        alamat
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error' };
  }
};

// Fungsi untuk logout
export const logout = () => {
  removeAuthToken();
  localStorage.removeItem('currentUser');
};