import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/shared/stores/authStore';
import { CircularProgress, Box } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';

export const RouterProvider = () => {
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
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="#fff"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};