import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, format } from "date-fns";

export const useExpirationNotifications = () => {
  const { data: memberships, isLoading } = useQuery({
    queryKey: ["membership-notifications"],
    queryFn: async () => {
      const today = new Date();
      const todayStr = format(today, "yyyy-MM-dd");

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
      return data;
    },
  });

  const activeMembers = memberships || [];

  // Filtrar las membresías según su estado de vigencia (independiente del pago)
  const expiredMemberships = activeMembers.filter((membership) => {
    const endDate = new Date(membership.end_date);
    const today = new Date();
    return endDate < today;
  });

  const expiringMemberships = activeMembers.filter((membership) => {
    const endDate = new Date(membership.end_date);
    const today = new Date();
    const sevenDaysFromNow = addDays(today, 7);
    return endDate > today && endDate <= sevenDaysFromNow;
  });

  // Membresías con pago pendiente (independiente de su fecha de vencimiento)
  const pendingMemberships = activeMembers.filter(
    (membership) => membership.payment_status === "pending"
  );

  return {
    expiredMemberships,
    expiringMemberships,
    pendingMemberships,
    isLoading,
  };
};
