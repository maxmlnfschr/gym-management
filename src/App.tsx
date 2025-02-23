import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import AppRoutes from "@/routes";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { RegisterPage } from '@/features/auth/components/RegisterPage';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { TestResponsive } from '@/features/shared/components/TestResponsive';
import { MemberList } from '@/features/members/components/MemberList';
import { MemberFormContainer } from '@/features/members/components/MemberFormContainer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/members/add" element={<MemberFormContainer />} />
            <Route path="/members/edit/:id" element={<MemberFormContainer />} />
            <Route path="/test-responsive" element={<TestResponsive />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
