import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
    _id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
}

interface WishlistState {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    toggleItem: (item: WishlistItem) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                if (!get().items.find(i => i._id === item._id)) {
                    set({ items: [...get().items, item] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter(i => i._id !== id) });
            },
            toggleItem: (item) => {
                if (get().isInWishlist(item._id)) {
                    get().removeItem(item._id);
                } else {
                    get().addItem(item);
                }
            },
            isInWishlist: (id) => {
                return get().items.some(i => i._id === id);
            },
            clearWishlist: () => set({ items: [] }),
        }),
        { name: 'sarvi-wishlist' }
    )
);
