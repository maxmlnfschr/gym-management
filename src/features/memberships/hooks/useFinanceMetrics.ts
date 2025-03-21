import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfMonth, endOfMonth } from "date-fns";

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

export const useFinanceMetrics = () => {
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
        .from("membership_payments")
        .select("amount")
        .gte("payment_date", startOfMonth.toISOString())
        .lte("payment_date", endOfMonth.toISOString())
        .eq("status", "paid");

      if (monthError) throw monthError;

      const currentMonthIncome =
        monthPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      // Obtener membresías activas con pagos pendientes
      const { data: pendingMemberships, error: membershipsError } = await supabase
        .from("memberships")
        .select(`
          id,
          member_id,
          amount,
          members!inner (
            deleted_at
          )
        `)
        .eq("payment_status", "pending")
        .is("members.deleted_at", null);
      
      if (membershipsError) throw membershipsError;

      // Calcular el monto total pendiente
      const totalPendingAmount =
        pendingMemberships?.reduce(
          (sum, membership) => sum + (membership.amount || 0),
          0
        ) || 0;

      // Contar miembros únicos con pagos pendientes
      const uniquePendingMembers = new Set(
        pendingMemberships?.map((m) => m.member_id)
      ).size;

      return {
        currentMonthIncome,
        pendingPayments: uniquePendingMembers,
        pendingAmount: totalPendingAmount,
      };
    },
    refetchInterval: 5 * 60 * 1000,
  });
};
