import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/shared/stores/authStore';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';  // Changed from 'import App' to 'import { App }'
import { LoadingScreen } from '@/components/common/LoadingScreen';

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
    return <LoadingScreen message="Iniciando aplicación..." />;
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};