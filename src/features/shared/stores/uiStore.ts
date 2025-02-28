import { create } from 'zustand';
import { ToastState, ToastMessage } from '@/features/shared/types/common';

interface UIState {
  isDrawerOpen: boolean;
  isDrawerCollapsed: boolean;
  toast: ToastState;
  showToast: (message: ToastMessage) => void;
  hideToast: () => void;
  toggleDrawer: () => void;
  toggleDrawerCollapse: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDrawerOpen: false,
  isDrawerCollapsed: false,
  toast: {
    open: false,
    type: 'info',
    message: '',
  },
  showToast: (message: ToastMessage) =>
    set({
      toast: {
        open: true,
        ...message,
      },
    }),
  hideToast: () =>
    set((state) => ({
      toast: {
        ...state.toast,
        open: false,
      },
    })),
  toggleDrawer: () =>
    set((state) => ({
      isDrawerOpen: !state.isDrawerOpen,
    })),
  toggleDrawerCollapse: () =>
    set((state) => ({
      isDrawerCollapsed: !state.isDrawerCollapsed,
    })),
}));