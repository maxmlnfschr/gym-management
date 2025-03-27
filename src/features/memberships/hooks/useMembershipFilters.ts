import { useMemo } from "react";
import { Membership, PaymentStatus, MembershipStatus } from "../types";

// Separar las interfaces para mejor organización
interface MembershipStatusFilters {
  active: Membership[];
  expiring: Membership[];
  expired: Membership[];
  inactive: Membership[];
}

interface PaymentStatusFilters {
  paid: Membership[];
  pending: Membership[];
}

interface FilteredMemberships {
  status: MembershipStatusFilters;
  payment: PaymentStatusFilters;
  all: Membership[];
}

// Funciones auxiliares para separar la lógica
const getMembershipStatus = (membership: Membership, today: Date): keyof MembershipStatusFilters => {
  if (!membership.end_date) return 'inactive';
  
  const endDate = new Date(membership.end_date);
  const daysUntilExpiration = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (endDate < today) return 'expired';
  if (daysUntilExpiration <= 7) return 'expiring';
  return 'active';
};

export const useMembershipFilters = (memberships: Membership[]) => {
  return useMemo(() => {
    const today = new Date();
    const validMemberships = memberships.filter(m => !m.deleted_at);

    const filtered: FilteredMemberships = {
      status: {
        active: [],
        expiring: [],
        expired: [],
        inactive: [],
      },
      payment: {
        paid: [],
        pending: [],
      },
      all: validMemberships,
    };

    validMemberships.forEach((membership) => {
      // Clasificar por estado de membresía
      const status = getMembershipStatus(membership, today);
      filtered.status[status].push(membership);

      // Clasificar por estado de pago
      filtered.payment[membership.payment_status].push(membership);
    });

    return filtered;
  }, [memberships]);
};