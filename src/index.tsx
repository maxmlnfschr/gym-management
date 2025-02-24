import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { theme } from '@/theme';
import '@/index.css';
import App from '@/App';
import { RouterProvider } from '@/routes/RouterProvider';
import { AuthProvider } from "@/features/auth/components/AuthProvider";

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider />
      </AuthProvider>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
