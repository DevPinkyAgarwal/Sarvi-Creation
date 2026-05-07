import { create } from 'zustand';
import api from '../../lib/api';

export interface Announcement {
    _id: string;
    message: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AnnouncementState {
    announcements: Announcement[];
    isLoading: boolean;
    error: string | null;
    fetchAnnouncements: () => Promise<void>;
    createAnnouncement: (data: { message: string; isActive: boolean }) => Promise<void>;
    updateAnnouncement: (id: string, data: { message?: string; isActive?: boolean }) => Promise<void>;
    deleteAnnouncement: (id: string) => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
    announcements: [],
    isLoading: false,
    error: null,

    fetchAnnouncements: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get('/announcements');
            set({ announcements: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch announcements', isLoading: false });
        }
    },

    createAnnouncement: async (announcementData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/announcements', announcementData);

            // If the new one is active, we should deactivate others in our local state
            const currentAnnouncements = get().announcements.map(a =>
                announcementData.isActive ? { ...a, isActive: false } : a
            );

            set({
                announcements: [data, ...currentAnnouncements],
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create announcement', isLoading: false });
            throw error;
        }
    },

    updateAnnouncement: async (id, updateData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.put(`/announcements/${id}`, updateData);

            // If we are making this one active, deactivate all others local state
            const currentAnnouncements = get().announcements.map(a => {
                if (a._id === id) return data;
                if (updateData.isActive) return { ...a, isActive: false };
                return a;
            });

            set({ announcements: currentAnnouncements, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update announcement', isLoading: false });
            throw error;
        }
    },

    deleteAnnouncement: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/announcements/${id}`);
            set({
                announcements: get().announcements.filter(a => a._id !== id),
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete announcement', isLoading: false });
            throw error;
        }
    }
}));
