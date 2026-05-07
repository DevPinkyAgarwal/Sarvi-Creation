import { Link, useLocation } from 'react-router-dom';
import { MoveRight } from 'lucide-react';

export default function NotFoundPage() {
    const location = useLocation();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center font-sans">
            <h1 className="text-8xl md:text-9xl font-serif text-slate-100 tracking-tighter select-none mb-6">404</h1>
            <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-slate-900 mb-4">
                Page Not Found
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-10 text-[15px] leading-relaxed">
                We couldn't find the page you were looking for at <span className="font-semibold text-slate-700">"{location.pathname}"</span>. It might have been removed, renamed, or temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-slate-800 transition-colors"
                >
                    Return to Homepage
                </Link>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-transparent text-slate-900 border border-slate-200 px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-slate-900 transition-colors"
                >
                    Shop All <MoveRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
