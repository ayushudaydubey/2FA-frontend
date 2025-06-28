import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axios';

const DashBoard = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsername(res.data.username);
      } catch (err) {
        setError('Failed to fetch user. Please login again.');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <h1 className="text-2xl font-normal ">Hello <span className='font-thin text-4xl px-2 text-orange-600 '>{username}  </span> <br />
           <h2 className='text-3xl font-normal' >Welcome to DashBoard</h2>

          </h1>
          
        )}
      </div>
    </div>
  );
};

export default DashBoard;
