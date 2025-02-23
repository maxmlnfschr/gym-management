import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { RegisterPage } from '@/features/auth/components/RegisterPage';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { TestResponsive } from '@/features/shared/components/TestResponsive';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path="/test-responsive" element={<TestResponsive />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}