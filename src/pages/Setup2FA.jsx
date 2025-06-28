import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axios';
import { toast } from 'react-toastify';

const Setup2FA = ({ setIsAuthenticated }) => {
  const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const tempToken = localStorage.getItem('tempToken');

    if (!tempToken) {
      toast.error('Session expired. Please login again.');
      return;
    }

    try {
      const res = await axiosInstance.post('/2FA-verify', {
        token: otp,
        tempToken,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.removeItem('tempToken');
      localStorage.removeItem('loginEmail');
      localStorage.removeItem('loginPassword');
      setIsAuthenticated(true);
      toast.success('2FA verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP verification failed');
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem('loginEmail');
    const password = localStorage.getItem('loginPassword');

    if (!email || !password) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    try {
      setIsResending(true);
      const res = await axiosInstance.post('/login', { email, password });

      if (res.data.tempToken) {
        localStorage.setItem('tempToken', res.data.tempToken);
        toast.success('OTP resent. Check your email or authenticator app.');
      } else {
        toast.error('Unable to resend OTP. Please login again.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="backdrop-blur-3xl border border-blue-200 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-normal text-center text-white mb-4">Enter OTP</h2>

        <p className="text-sm text-blue-200 text-center mb-6">
          For your security, we use <span className="text-blue-400 font-medium">Two-Factor Authentication (2FA)</span>.
          Please enter the 6-digit OTP sent to your authenticator app or email. This OTP is valid for <span className="text-orange-300 font-semibold">5 minutes</span>.
          Make sure to check your mailbox.
        </p>


        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 text-blue-200 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-200"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition"
          >
            Verify
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={isResending}
          className="mt-4 w-full text-sm text-blue-400 hover:underline disabled:text-gray-400"
        >
          {isResending ? 'Resending OTP...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default Setup2FA;
