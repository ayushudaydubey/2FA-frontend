import React, { useState } from 'react';
import { axiosInstance } from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    twoFactorAuth: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const validateForm = () => {
  const errs = [];
  const { email, password, confirmPassword } = formData;

  // Email check
  if (!email.includes('@') || !email.includes('.')) {
    errs.push('Email must contain "@" and "."');
  } else {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');
    if (atIndex > dotIndex || atIndex === 0 || dotIndex === email.length - 1) {
      errs.push('Invalid email format');
    }
  }

  // Password checks
  if (password.length < 8) {
    errs.push('Password must be at least 8 characters');
  }

  let hasUpper = false;
  let hasNumber = false;
  let hasSpecial = false;
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  for (let char of password) {
    if (char >= 'A' && char <= 'Z') hasUpper = true;
    if (!isNaN(char)) hasNumber = true;
    if (specialChars.includes(char)) hasSpecial = true;
  }

  if (!hasUpper) errs.push('Password must contain at least one uppercase letter');
  if (!hasNumber) errs.push('Password must contain at least one number');
  if (!hasSpecial) errs.push('Password must contain at least one special character');

  if (password !== confirmPassword) {
    errs.push('Passwords do not match');
  }

  return errs;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateForm();

  if (validationErrors.length > 0) {
    validationErrors.forEach((err) => toast.error(err));
    return;
  }

  try {
    const { confirmPassword, ...dataToSend } = formData;
    const res = await axiosInstance.post('/register', dataToSend);
    toast.success(res.data.message || 'Registration successful!');
    setTimeout(() => navigate('/login'), 2000);
  } catch (err) {
    if (err.response?.data?.errors) {
      err.response.data.errors.forEach((e) => toast.error(e.msg));
    } else if (err.response?.data?.error) {
      toast.error(err.response.data.error);
    } else {
      toast.error('An unexpected error occurred');
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-white">
      
      <div className="backdrop-blur-3xl border border-blue-200 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <p></p>
        <h2 className="text-2xl font-normal text-center text-white mb-6">Create Account</h2>
   
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-zinc-900 text-blue-200 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-2 bg-zinc-900 text-blue-200 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create Strong Password"
            className="w-full px-4 py-2 bg-zinc-900 text-blue-200 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 bg-zinc-900 text-blue-200 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition"
          >
           Create
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-400 text-center font-medium">{message}</p>
        )}

        {errors.length > 0 && (
          <div className="mt-4 text-red-400 text-sm space-y-1">
            {errors.map((err, idx) => (
              <div key={idx}>• {err}</div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
