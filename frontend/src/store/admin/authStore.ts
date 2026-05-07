import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../lib/api';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: AdminUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: AdminUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post('/users/login', { email, password });
                    if (data.role !== 'admin') {
                        throw new Error('Access denied. Admin privileges required.');
                    }
                    set({ user: data, isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false });
                    throw error;
                }
            },
            logout: async () => {
                await api.post('/users/logout');
                set({ user: null });
            },
            setUser: (user) => set({ user }),
        }),
        { name: 'admin-auth' }
    )
);
