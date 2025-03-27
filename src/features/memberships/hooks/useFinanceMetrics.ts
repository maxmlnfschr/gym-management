import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfMonth, endOfMonth } from "date-fns";
import { useMembershipFilters } from "./useMembershipFilters";
import { Membership } from "../types";

interface FinanceMetrics {
  currentMonthIncome: number;
  pendingPayments: number;
  pendingAmount: number;
}

interface MembershipWithPlan {
  id: string;
  plan: {
    price: number;
  } | null;
}

export const useFinanceMetrics = (memberships?: Membership[]) => {
  const { payment: paymentFilters } = useMembershipFilters(memberships || []);

  return useQuery({
    queryKey: ["finance-metrics"],
    queryFn: async (): Promise<FinanceMetrics> => {
      const currentDate = new Date();
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // Obtener pagos del mes actual
      const { data: monthPayments, error: monthError } = await supabase
        .from("memberships")
        .select("paid_amount")
        .gte("created_at", startOfMonth.toISOString())
        .lte("created_at", endOfMonth.toISOString());

      if (monthError) throw monthError;

      const currentMonthIncome =
        monthPayments?.reduce((sum, payment) => sum + payment.paid_amount, 0) ||
        0;

      // Obtener membresías con pagos pendientes y sus montos
      const { data: pendingMemberships, error: pendingError } = await supabase
        .from("memberships")
        .select(
          `
          id,
          member_id,
          amount,
          pending_amount
        `
        )
        .eq("payment_status", "pending")
        .gt("end_date", currentDate.toISOString());

      if (pendingError) throw pendingError;

      const totalPendingAmount =
        pendingMemberships?.reduce(
          (sum, membership) => sum + (membership.pending_amount || 0),
          0
        ) || 0;

      const uniquePendingMembers = new Set(
        pendingMemberships?.map((m) => m.member_id)
      ).size;

      console.log("Métricas calculadas:", {
        ingresosMes: currentMonthIncome,
        montoPendiente: totalPendingAmount,
        miembrosPendientes: uniquePendingMembers,
      });

      return {
        currentMonthIncome,
        pendingPayments: uniquePendingMembers,
        pendingAmount: totalPendingAmount,
      };
    },
    enabled: true,
    refetchInterval: 5 * 60 * 1000,
  });
};
