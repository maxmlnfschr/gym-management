import { create } from 'zustand';

interface UIState {
  isDrawerOpen: boolean;
  isDrawerCollapsed: boolean;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawerCollapse: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDrawerOpen: true,
  isDrawerCollapsed: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  toggleDrawerCollapse: () => set((state) => ({ isDrawerCollapsed: !state.isDrawerCollapsed })),
  setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),
}));