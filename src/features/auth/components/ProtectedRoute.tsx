import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/shared/stores/authStore';
import { ROUTES } from '@/lib/constants/routes';

export const ProtectedRoute = () => {
  const { user, initialized } = useAuthStore();
  // Wait until auth is initialized before making any decisions
  if (!initialized) {
    return null; // or a loading spinner
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <Outlet />;
};