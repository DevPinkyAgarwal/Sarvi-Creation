import { useState, useEffect, useRef, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Heart, Menu, X, ChevronDown, LogOut, Package, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: { url: string };
}

// --- Mega Menu Content & Sub-components ---

const MEGA_MENU_CONTENT = {
    byCategory: [
        { name: 'Rings', to: '/category/rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400' },
        { name: 'Necklaces', to: '/category/necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400' },
        { name: 'Earrings', to: '/category/earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400' },
        { name: 'Watches', to: '/category/watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400' },
        { name: 'Bracelets', to: '/category/bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' },
    ],
    featured: {
        title: 'The Solitaire Collection',
        description: 'Exquisite diamonds crafted for eternal moments.',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        to: '/category/solitaire'
    }
};

const NavLink = memo(({
    to,
    children,
    index,
}: {
    to: string,
    children: React.ReactNode,
    index: number,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="h-full flex items-center relative"
        >
            <Link
                to={to}
                className="text-[13px] font-medium transition-all whitespace-nowrap relative group py-2 tracking-[0.15em] uppercase font-sans text-[#1a1a1a] hover:text-black"
            >
                {children}
                <motion.span
                    className="absolute left-0 -bottom-1 w-full h-[0.5px] bg-black/40 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </Link>
        </motion.div>
    );
});


export default function Navbar() {
    const totalItems = useCartStore(state => state.totalItems());
    const wishlistItems = useWishlistStore(state => state.items.length);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const location = useLocation();

    const [categories, setCategories] = useState<Category[]>([]);
    const [announcement, setAnnouncement] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileCatsOpen, setMobileCatsOpen] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY > 38;
                    setIsScrolled(scrolled);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setSearchQuery('');
        }
    }, [isSearchOpen]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            // Fetch categories
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (err) {
                console.error("Navbar: Failed to fetch categories", err);
            }

            // Fetch active announcement (silent failure on 404)
            try {
                const { data } = await api.get('/announcements/active');
                if (data && data.message) {
                    setAnnouncement(data.message);
                }
            } catch (err: any) {
                // 404 is expected if no active announcement exists
                if (err.response?.status !== 404) {
                    console.error("Navbar: Failed to fetch active announcement", err);
                }
            }
        };
        fetchData();
    }, []);

    const dynamicNavLinks = categories.map(cat => ({
        name: cat.name,
        to: `/category/${cat.slug}`
    })).filter(link => link.name.toLowerCase() !== 'trending now');

    // Fallback nav links if categories are still loading or empty
    const staticNavLinks = [
        { name: 'Our Story', to: '/about' },
        { name: 'Women', to: '/category/women' },
        { name: 'Men', to: '/category/men' },
        { name: 'Rings', to: '/category/rings' },
        { name: 'Necklaces', to: '/category/necklaces' },
        { name: 'Watches', to: '/category/watches' },
        { name: 'Earrings', to: '/category/earrings' },
        { name: 'Gifts', to: '/category/gifts' },
        { name: 'Outlet', to: '/category/outlet' },
    ];

    const navLinks = dynamicNavLinks.length > 0 ? dynamicNavLinks : staticNavLinks;

    return (
        <div className="font-sans">
            {/* Top Utility Bar - Not Sticky */}
            {announcement && (
                <div className="bg-[#09090b] text-white overflow-hidden h-[38px] flex flex-col justify-center relative z-[60] w-full">
                    <div className="w-full flex-1 flex items-center">
                        <div className="flex w-max animate-marquee-slow text-[10px] tracking-[0.25em] font-medium uppercase">
                            <div className="flex items-center shrink-0">
                                {[...Array(6)].map((_, idx) => (
                                    <span key={`a-${idx}`} className="mx-8 whitespace-nowrap">{announcement}</span>
                                ))}
                            </div>
                            <div className="flex items-center shrink-0">
                                {[...Array(6)].map((_, idx) => (
                                    <span key={`b-${idx}`} className="mx-8 whitespace-nowrap">{announcement}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Header */}
            <header className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-500 flex flex-col ${isScrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-100/10'} ${announcement ? (isScrolled ? 'translate-y-0' : 'translate-y-[38px]') : 'translate-y-0'}`}>

                {/* Main Navigation Row */}
                <nav className="relative w-full">
                    <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16">
                        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-[72px]' : 'h-[96px]'}`}>

                            {/* Logo - Absolute Left */}
                            <div className="flex-none w-[200px] flex items-center">
                                <Link to="/" className="group relative z-50">
                                    <div className="flex flex-col">
                                        <span className={`font-serif tracking-[0.1em] text-black transition-all duration-500 ${isScrolled ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'}`}>SARVI </span>
                                        <span className={`tracking-[0.4em] text-gray-500 uppercase mt-0.5 ml-0.5 transition-all duration-500 ${isScrolled ? 'text-[8px]' : 'text-[12px]'}`}>CREATION</span>
                                    </div>
                                </Link>
                            </div>

                            {/* Desktop Main Links - Centered */}
                            <div className="hidden xl:flex flex-1 h-full justify-center items-center gap-8 2xl:gap-12">
                                {navLinks.map((link, idx) => (
                                    <NavLink
                                        key={link.name}
                                        to={link.to}
                                        index={idx}
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                            </div>

                            {/* Icons - Absolute Right */}
                            <div className="flex-none w-[200px] flex justify-end items-center gap-6 relative z-50">

                                {/* Search Toggle */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="text-black transition-transform hover:scale-110 p-2"
                                    aria-label="Search"
                                >
                                    <Search className="w-5 h-5 stroke-[1.2]" />
                                </motion.button>

                                {/* User Dropdown */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="relative cursor-pointer group/user"
                                >
                                    {user ? (
                                        <div className="flex items-center gap-1 text-black transition-opacity py-4 hover:opacity-60">
                                            <User className="w-5 h-5 stroke-[1.2]" />
                                        </div>
                                    ) : (
                                        <Link to="/login" className="flex items-center text-black py-4 transition-opacity hover:opacity-60" aria-label="Login">
                                            <User className="w-5 h-5 stroke-[1.2]" />
                                        </Link>
                                    )}

                                    {/* Dropdown Menu */}
                                    {user && (
                                        <div className="absolute right-0 top-[80px] w-56 bg-white shadow-2xl border border-gray-100 rounded-sm py-4 transition-all duration-300 origin-top-right opacity-0 scale-95 invisible pointer-events-none group-hover/user:opacity-100 group-hover/user:scale-100 group-hover/user:visible group-hover/user:pointer-events-auto">
                                            <div className="px-6 py-3 border-b border-gray-50 mb-2">
                                                <p className="text-[12px] font-bold tracking-widest text-gray-900 truncate uppercase">{user.name}</p>
                                                <p className="text-[10px] text-gray-500 truncate mt-1 tracking-wide">{user.email}</p>
                                            </div>
                                            <Link to="/profile" className="flex items-center gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors">
                                                <User className="w-4 h-4 text-gray-400 stroke-[1.2]" /> My Account
                                            </Link>
                                            <Link to="/profile" className="flex items-center gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors">
                                                <Package className="w-4 h-4 text-gray-400 stroke-[1.2]" /> Orders
                                            </Link>
                                            <div className="mt-2 pt-2 border-t border-gray-50">
                                                <button
                                                    onClick={() => logout()}
                                                    className="w-full flex items-center gap-4 px-6 py-3 text-[11px] uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4 text-red-400 stroke-[1.2]" /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <Link to="/wishlist" className="text-black hover:opacity-60 transition-transform hover:scale-110 p-2 block relative group" aria-label="Wishlist">
                                        <Heart className="w-5 h-5 stroke-[1.2]" />
                                        {wishlistItems > 0 && (
                                            <span className="absolute top-1 right-1 w-[16px] h-[16px] bg-black text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                                                {wishlistItems}
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <button 
                                        onClick={() => useCartStore.getState().setDrawerOpen(true)}
                                        className="text-black hover:opacity-60 transition-transform hover:scale-110 relative group p-2 block" 
                                        aria-label="Cart"
                                    >
                                        <ShoppingBag className="w-5 h-5 stroke-[1.2]" />
                                        {totalItems > 0 && (
                                            <span className="absolute top-1 right-1 w-[16px] h-[16px] bg-black text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                                                {totalItems}
                                            </span>
                                        )}
                                    </button>
                                </motion.div>

                                {/* Mobile Toggle */}
                                <div className="flex xl:hidden ml-2">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="p-2 text-black transition-opacity hover:opacity-70"
                                        aria-label="Toggle menu"
                                    >
                                        {isMobileMenuOpen ? (
                                            <X className="w-6 h-6 stroke-[1.2]" />
                                        ) : (
                                            <Menu className="w-6 h-6 stroke-[1.2]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Interactive Search Overlay */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className={`absolute left-0 w-full border-b border-gray-100 overflow-hidden z-[45] transition-all duration-500 
                                    ${isScrolled ? 'top-full bg-white/90 backdrop-blur-2xl' : 'top-full bg-white'}`}
                            >
                                <form onSubmit={handleSearch} className="max-w-4xl mx-auto px-6 py-12 flex items-center gap-6">
                                    <Search className="w-6 h-6 text-gray-400 stroke-[1.2]" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for jewellery, collections, or materials..."
                                        className="flex-1 text-2xl font-serif outline-none placeholder:text-gray-200 text-gray-900 bg-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="text-gray-400 hover:text-black transition-transform hover:scale-110 p-2"
                                    >
                                        <X className="w-6 h-6 stroke-[1.2]" />
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </header>

            {/* Mobile Menu Slide-in Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 bottom-0 left-0 w-[85%] max-w-sm bg-[#FAF9F6] z-[110] flex flex-col shadow-2xl overflow-hidden border-r border-gray-200"
                        >
                            <div className="flex items-center justify-between p-6 lg:p-8 border-b border-gray-200 bg-white/50 backdrop-blur-xl">
                                <span className="text-2xl font-serif tracking-wide text-gray-900">SARVI</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100" aria-label="Close menu">
                                    <X className="w-5 h-5 stroke-[1.5]" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto HideScrollbar">
                                <div className="flex flex-col">
                                    <div className="p-8 pb-4 space-y-6">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Discover</h3>
                                        <div className="flex flex-col gap-6">
                                            <Link to="/category/women" className="text-3xl font-serif text-gray-800 hover:text-[#D4AF37] transition-colors relative group w-fit">
                                                Women
                                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full"></span>
                                            </Link>
                                            <Link to="/category/men" className="text-3xl font-serif text-gray-800 hover:text-[#D4AF37] transition-colors relative group w-fit">
                                                Men
                                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full"></span>
                                            </Link>
                                            <Link to="/category/rings" className="text-3xl font-serif text-gray-800 hover:text-[#D4AF37] transition-colors relative group w-fit">
                                                Rings
                                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full"></span>
                                            </Link>
                                            <Link to="/category/necklaces" className="text-3xl font-serif text-gray-800 hover:text-[#D4AF37] transition-colors relative group w-fit">
                                                Necklaces
                                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full"></span>
                                            </Link>
                                            <Link to="/category/watches" className="text-3xl font-serif text-gray-800 hover:text-[#D4AF37] transition-colors relative group w-fit">
                                                Watches
                                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full"></span>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="px-8 py-4">
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>

                                    {/* Mobile Collapsible Categories */}
                                    <div className="px-8 space-y-6">
                                        <button
                                            onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
                                            className="flex items-center justify-between w-full group"
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">By Category</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-500 ease-[0.16,1,0.3,1] ${mobileCatsOpen ? 'rotate-180 text-black' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {mobileCatsOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                    className="grid grid-cols-1 gap-5 overflow-hidden border-l border-gray-200 ml-2 pl-6"
                                                >
                                                    {(categories.length > 0 ? categories : MEGA_MENU_CONTENT.byCategory).map((cat: any) => (
                                                        <Link key={cat._id || cat.name} to={cat.slug ? `/category/${cat.slug}` : cat.to} className="text-[15px] font-medium text-gray-500 hover:text-black transition-colors flex items-center justify-between group">
                                                            {cat.name}
                                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37] -translate-x-2 group-hover:translate-x-0 group-hover:duration-300" />
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="px-8 py-4">
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>

                                    {/* Mobile Featured Preview */}
                                    <div className="px-8">
                                        <div className="relative rounded-2xl overflow-hidden h-[220px] group/mobfeat shadow-lg">
                                            <Link to={MEGA_MENU_CONTENT.featured.to} className="block w-full h-full">
                                                <img src={MEGA_MENU_CONTENT.featured.image} alt="Featured" className="w-full h-full object-cover transition-transform duration-1000 group-hover/mobfeat:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                <div className="absolute bottom-6 left-6 text-white">
                                                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-2">Featured Collection</p>
                                                    <h4 className="text-2xl font-serif tracking-wide">{MEGA_MENU_CONTENT.featured.title}</h4>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="px-8 py-4 mt-4">
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>

                                    <div className="px-8 flex flex-col gap-6 pb-8">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Account</h3>
                                        <div className="flex flex-col gap-5">
                                            <Link to="/profile" className="flex items-center gap-4 text-[12px] uppercase tracking-[0.2em] font-medium text-gray-600 hover:text-black transition-colors">
                                                <User className="w-4 h-4 stroke-[1.5]" /> My account
                                            </Link>
                                            <Link to="/profile/orders" className="flex items-center gap-4 text-[12px] uppercase tracking-[0.2em] font-medium text-gray-600 hover:text-black transition-colors">
                                                <Package className="w-4 h-4 stroke-[1.5]" /> My orders
                                            </Link>
                                            <Link to="/wishlist" className="flex items-center justify-between text-[12px] uppercase tracking-[0.2em] font-medium text-gray-600 hover:text-black transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <Heart className="w-4 h-4 stroke-[1.5]" /> Wishlist
                                                </div>
                                                {wishlistItems > 0 && (
                                                    <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                                                        {wishlistItems}
                                                    </span>
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 lg:p-8 bg-white/50 backdrop-blur-xl border-t border-gray-200 mt-auto">
                                {user ? (
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="w-full py-4 text-center text-xs uppercase tracking-[0.2em] font-bold text-red-600 border border-red-200 hover:border-red-600 hover:bg-red-50 transition-colors rounded-full"
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="block w-full py-4 text-center text-xs uppercase tracking-[0.2em] font-bold bg-[#1a1a1a] text-white hover:bg-black hover:shadow-lg transition-all rounded-full"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
