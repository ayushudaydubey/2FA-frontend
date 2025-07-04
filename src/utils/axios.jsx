import axios from 'axios';


const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : 'https://twofa-backend-jlj1.onrender.com';


export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
 
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
