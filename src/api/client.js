import axios from 'axios';

// Change this based on production url later
const API_URL = 'http://localhost:5001/api';

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
