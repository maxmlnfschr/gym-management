interface PaymentStatusInfo {
  color: string;
  status: string;
  severity: 'success' | 'warning' | 'error';
}

export const getPaymentStatus = (status: 'paid' | 'pending'): PaymentStatusInfo => {
  if (status === 'paid') {
    return {
      color: '#4caf50',
      status: 'Pagado',
      severity: 'success'
    };
  }
  
  return {
    color: '#ff9800',
    status: 'Pendiente',
    severity: 'warning'
  };
};
