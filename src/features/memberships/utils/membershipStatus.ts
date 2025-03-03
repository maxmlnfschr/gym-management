interface MembershipStatusInfo {
  color: string;
  status: string;
  severity: 'success' | 'warning' | 'error' | 'default';
}

export const getMembershipStatus = (membership: any): MembershipStatusInfo => {
  if (!membership) {
    return {
      color: '#9e9e9e',
      status: 'Sin membresía',
      severity: 'error'
    };
  }

  const today = new Date();
  const endDate = new Date(membership.end_date);
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (membership.payment_status === 'pending' || endDate < today) {
    return {
      color: '#f44336',
      status: 'Membresía vencida',
      severity: 'error'
    };
  }

  if (endDate <= sevenDaysFromNow) {
    return {
      color: '#ff9800',
      status: 'Por vencer',
      severity: 'warning'
    };
  }

  return {
    color: '#4caf50',
    status: 'Membresía activa',
    severity: 'success'
  };
};