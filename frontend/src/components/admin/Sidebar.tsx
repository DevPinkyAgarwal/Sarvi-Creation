import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/admin/authStore';
import {
    LayoutDashboard, Package, Tag, ShoppingCart,
    Users, Percent, LogOut, Megaphone, MessageSquare, Mail
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
    { icon: Package, label: 'Products', to: '/admin/products' },
    { icon: Tag, label: 'Categories', to: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', to: '/admin/orders' },
    { icon: Users, label: 'Customers', to: '/admin/customers' },
    { icon: Percent, label: 'Coupons', to: '/admin/coupons' },
    { icon: Megaphone, label: 'Announcements', to: '/admin/announcements' },
    { icon: Mail, label: 'Newsletter', to: '/admin/newsletter' },
    { icon: MessageSquare, label: 'Inquiries', to: '/admin/contact' },
];

export default function Sidebar() {
    const location = useLocation();
    const { logout, user } = useAuthStore();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-30 font-sans shadow-sm">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100">
                <Link to="/admin" className="flex items-center gap-3">
                    <img 
                        src="/Sarvi Creation Logo without Background.png" 
                        alt="Sarvi Creation" 
                        className="h-16 w-auto object-contain"
                    />
                    <div>
                        <h1 className="text-slate-900 font-semibold text-[14px] tracking-tight">Admin</h1>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map(({ icon: Icon, label, to }) => {
                    const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-[#F9F5FF] text-[#7F56D9]'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#7F56D9]' : 'text-slate-400 group-hover:text-slate-600'} transition-colors duration-200`} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3 px-1">
                    <div className="w-9 h-9 rounded-full bg-[#F9F5FF] flex items-center justify-center text-[#7F56D9] text-sm font-bold shrink-0 border border-purple-100">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-slate-900 text-sm font-semibold truncate tracking-tight">{user?.name}</p>
                        <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
