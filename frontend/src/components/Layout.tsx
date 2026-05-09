import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import NewsletterPopup from './NewsletterPopup';
import MobileBottomNav from './MobileBottomNav';
import SchemaOrg from './SchemaOrg';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
            <SchemaOrg type="Organization" data={{}} />
            <SchemaOrg type="LocalBusiness" data={{}} />
            <Navbar />
            <main className="flex-grow pt-[96px] pb-16 lg:pb-0">
                <Outlet />
            </main>
            <Footer />
            <MobileBottomNav />
            <NewsletterPopup />
        </div>
    );
}
