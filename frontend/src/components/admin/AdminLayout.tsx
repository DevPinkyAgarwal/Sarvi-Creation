import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
