import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log(`[Axios] Request to ${config.url} with token: ${token.substring(0, 10)}...`);
      } else {
        console.warn(`[Axios] Request to ${config.url} MISSING TOKEN`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // console.log(`[Axios] Raw response from ${response.config.url}:`, response.data);
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const body = response.data;
      if (body.isError) {
        return Promise.reject({
          message: body.message,
          response: { data: body }
        });
      }

      response.data = body.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(`[Axios] 401 Unauthorized detected for ${error.config.url}. Clearing token and redirecting.`);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Avoid redirect loop if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
