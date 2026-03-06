import axios from 'axios';

// Always point to live Render backend during local Vite development
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_URL = isLocalDev
    ? 'http://localhost:5001/api' // Point to local Express backend for dev
    : '/api'; // Use relative path in production

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach Firebase Auth Token
apiClient.interceptors.request.use(async (config) => {
    // In a real app we'd fetch the Firebase user's current token
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
