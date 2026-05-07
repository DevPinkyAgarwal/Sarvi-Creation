import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5151/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if user is in admin pages, redirect to admin login
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else {
                // Ignore redirect on /login endpoint so it doesn't loop if they fail login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
