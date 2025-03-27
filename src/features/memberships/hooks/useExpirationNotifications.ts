import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, format } from "date-fns";
import { useMembershipFilters } from "./useMembershipFilters";
import { Membership } from "../types";

export const useExpirationNotifications = () => {
  const { data: memberships, isLoading } = useQuery({
    queryKey: ["membership-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("latest_memberships")
        .select(
          `
          *,
          members!inner(
            first_name,
            last_name,
            email,
            deleted_at,
            status
          )
        `
        )
        .is("members.deleted_at", null)
        .neq("members.status", "deleted");

      if (error) throw error;

      // Convertir los datos al formato Membership
      return data?.map((membership) => ({
        ...membership,
        member_id: membership.member_id,
        plan_id: membership.plan_type,
        plan_type: membership.plan_type,
        status: membership.payment_status === "paid" ? "active" : "inactive",
        created_at: membership.start_date,
        members: {
          first_name: membership.members.first_name,
          last_name: membership.members.last_name,
          email: membership.members.email,
          status: membership.members.status,
        },
      })) as Membership[];
    },
  });

  // Usar useMembershipFilters para obtener las membresías filtradas
  const filters = useMembershipFilters(memberships || []);

  return {
    expiredMemberships: filters.status.expired,
    expiringMemberships: filters.status.expiring,
    pendingMemberships: filters.payment.pending,
    isLoading,
  };
};
