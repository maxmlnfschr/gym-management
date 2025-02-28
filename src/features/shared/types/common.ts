export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
  details?: string;
  duration?: number;
}

export interface ToastState extends ToastMessage {
  open: boolean;
}