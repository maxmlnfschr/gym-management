import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import AppRoutes from "@/routes";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { RegisterPage } from "@/features/auth/components/RegisterPage";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { TestResponsive } from "@/features/shared/components/TestResponsive";
import { MemberList } from "@/features/members/components/MemberList";
import { MemberFormContainer } from "@/features/members/components/MemberFormContainer";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/shared/stores/authStore";
import { CircularProgress, Box } from "@mui/material";
import { MembershipFormContainer } from "@/features/memberships/components/MembershipFormContainer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { MemberDetails } from "@/features/members/components/MemberDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccessControlPage } from "@/features/access/components/AccessControlPage";
import { AccessList } from "@/features/access/components/AccessList";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { CssBaseline } from '@mui/material';
import { SettingsLayout } from '@/features/settings/components/SettingsLayout';
import { MembershipPlanManagement } from '@/features/memberships/components/MembershipPlanManagement';
import { GeneralSettings } from '@/features/settings/components/GeneralSettings';
import { Navigate } from 'react-router-dom';
import { MemberPayments } from "@/features/payments/pages/MemberPayments";
import { NewPayment } from "@/features/payments/pages/NewPayment";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Componente separado para manejar el estado de carga
function AppContent() {
  const { initialized } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (initialized) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialized]);

  if (!isReady) {
    return <LoadingScreen message="Cargando..." />;
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/members" element={<MemberList />} />
        <Route path="/access" element={<AccessControlPage />} />
        <Route path="/members/add" element={<MemberFormContainer />} />
        <Route path="/members/edit/:id" element={<MemberFormContainer />} />
        <Route path="/test-responsive" element={<TestResponsive />} />
        <Route path="/members/:id" element={<MemberDetails />} />
        <Route
          path="/members/:id/membership"
          element={<MembershipFormContainer />}
        />
        <Route path="/members/:id/payments" element={<MemberPayments />} />
        <Route path="/members/:id/payments/new" element={<NewPayment />} />
        {/* Mover las rutas de settings aquí dentro */}
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="/settings/general" replace />} />
          <Route path="general" element={<GeneralSettings />} />
          <Route path="membership-plans" element={<MembershipPlanManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}
