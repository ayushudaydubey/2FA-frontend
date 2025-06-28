import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axios';
import { toast } from 'react-toastify';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post('/login', formData);

      if (res.data.requires2FA) {
        localStorage.setItem('tempToken', res.data.tempToken);
        toast.info('2FA required. Check your email for OTP.', { autoClose: 4000 });
        navigate('/2fa');
      } else {
        localStorage.setItem('token', res.data.token);
        setIsAuthenticated(true);
        toast.success('Login successful!', { autoClose: 3000 });
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      toast.error(errorMsg, { autoClose: 4000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="backdrop-blur-3xl border border-blue-200 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-normal text-center text-white mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-900 text-blue-200 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-900 text-blue-200 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
