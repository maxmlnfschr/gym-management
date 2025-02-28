import { useCallback } from 'react';
import { useUIStore } from '@/features/shared/stores/uiStore';
import { ToastMessage, ToastType } from '@/features/shared/types/common';

export const useToast = () => {
  const { showToast: showToastStore } = useUIStore();
  const showToast = useCallback((message: string, type: ToastType = 'info', details?: string) => {
    showToastStore({
      type,
      message,
      details,
    });
  }, [showToastStore]);
  return {
    showToast,
    success: (message: string, details?: string) => showToast(message, 'success', details),
    error: (message: string, details?: string) => showToast(message, 'error', details),
    warning: (message: string, details?: string) => showToast(message, 'warning', details),
    info: (message: string, details?: string) => showToast(message, 'info', details),
  };
};