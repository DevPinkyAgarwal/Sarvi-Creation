import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans text-center px-4">
            <div className="w-20 h-20 bg-[#F9F5FF] rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-[#7F56D9]">404</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
                Page not found
            </h1>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm">
                The page you are looking for doesn't exist or has been moved.
                Please check the URL or return to the dashboard.
            </p>

            <Link
                to="/"
                className="inline-flex items-center gap-2 bg-[#7F56D9] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#6941C6] transition-colors shadow-sm"
            >
                <LayoutDashboard className="w-4 h-4" />
                Back to Dashboard
            </Link>
        </div>
    );
}
