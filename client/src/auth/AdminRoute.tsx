import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-white">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!['ADMIN', 'EDITOR'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}