interface Membership {
  end_date: string;
  payment_status: 'paid' | 'pending' | 'overdue';
}

interface MembershipStatusInfo {
  color: string;
  status: string;
  severity: 'success' | 'warning' | 'error' | 'default';
  paymentStatus?: string;
}

export const getMembershipStatus = (membership: Membership | null): MembershipStatusInfo => {
  if (!membership) {
    return {
      color: '#9e9e9e',
      status: 'Sin membresía',
      severity: 'default'
    };
  }

  const today = new Date();
  const endDate = new Date(membership.end_date);
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Verificar primero si está vencida por fecha (independiente del pago)
  if (endDate < today) {
    return {
      color: '#f44336',
      status: 'Membresía vencida',
      severity: 'error',
      paymentStatus: membership.payment_status
    };
  }

  // Luego verificar si está por vencer
  if (endDate <= sevenDaysFromNow) {
    return {
      color: '#ff9800',
      status: 'Por vencer',
      severity: 'warning',
      paymentStatus: membership.payment_status
    };
  }

  // Membresía activa (con información de pago separada)
  return {
    color: '#4caf50',
    status: 'Membresía activa',
    severity: 'success',
    paymentStatus: membership.payment_status
  };
};