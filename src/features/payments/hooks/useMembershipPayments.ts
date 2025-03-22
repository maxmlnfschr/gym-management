import { usePayments } from "./usePayments";

export const useMembershipPayments = (memberId?: string) => {
  return usePayments(memberId);
};