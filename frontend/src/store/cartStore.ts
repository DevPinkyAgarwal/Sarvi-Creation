import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    product: string;
    name: string;
    variantSku: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (sku: string) => void;
    updateQuantity: (sku: string, quantity: number) => void;
    clearCart: () => void;
    isDrawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isDrawerOpen: false,
            setDrawerOpen: (open) => set({ isDrawerOpen: open }),
            addItem: (newItem) => {
                const items = get().items;
                const existing = items.find(i => i.variantSku === newItem.variantSku);
                if (existing) {
                    set({
                        items: items.map(i =>
                            i.variantSku === newItem.variantSku
                                ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.stock) }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...items, newItem] });
                }
            },
            removeItem: (sku) => set({ items: get().items.filter(i => i.variantSku !== sku) }),
            updateQuantity: (sku, qty) => set({
                items: get().items.map(i => i.variantSku === sku ? { ...i, quantity: qty } : i)
            }),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        { name: 'sarvi-cart' }
    )
);
