import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { axiosInstance } from './utils/axios';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Setup2FA from './pages/Setup2FA';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      await axiosInstance.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/2fa"
        element={
          localStorage.getItem('tempToken') ? (
            <Setup2FA setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default App;
