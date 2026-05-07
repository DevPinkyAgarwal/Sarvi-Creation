import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function MobileBottomNav() {
    const location = useLocation();
    const { items } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/products' },
        { icon: ShoppingBag, label: 'Bag', path: '/cart', count: cartCount },
        { icon: Heart, label: 'Wishlist', path: '/wishlist', count: wishlistCount },
        { icon: User, label: 'Account', path: '/profile' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-gray-100 lg:hidden px-4 pb-safe">
            <div className="flex justify-between items-center h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className="relative flex flex-col items-center justify-center w-full space-y-1 group"
                        >
                            <div className={`relative p-1 rounded-xl transition-colors ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                                {item.count !== undefined && item.count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-black' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
