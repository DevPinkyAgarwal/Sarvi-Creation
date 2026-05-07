import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/admin/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuthStore();
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};
