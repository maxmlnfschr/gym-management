import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToast = () => {
  const showToast = useCallback((message: string, type: ToastType) => {
    // For now, we'll use console.log. Later we can implement a proper toast system
    console.log(`[${type}] ${message}`);
  }, []);

  return { showToast };
};