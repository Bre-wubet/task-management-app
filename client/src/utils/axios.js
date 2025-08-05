import axios from 'axios';
import { BASE_URL } from './apiPaths';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // handle common errors
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (error.response.status === 500) {
            console.error('Server error:', error.response.data);
        } else if (error.response.status === 404) {
            console.error('Resource not found:', error.response.data);
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;