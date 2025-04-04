import { usePayments } from "./usePayments";
import { useMembershipFilters } from "@/features/memberships/hooks/useMembershipFilters";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";

export const useMembershipPayments = (memberId?: string) => {
  const payments = usePayments(memberId);
  const { memberships } = useMemberships(memberId);
  const membershipFilters = useMembershipFilters(memberships);

  return {
    ...payments,
    membershipFilters,
  };
};