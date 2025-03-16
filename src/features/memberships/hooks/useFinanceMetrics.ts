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

      // Obtener pagos pendientes
      const { data: pendingPayments, error: pendingError } = await supabase
        .from("membership_payments")
        .select("amount")
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      const currentMonthIncome =
        monthPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const pendingAmount =
        pendingPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      return {
        currentMonthIncome,
        pendingPayments: pendingPayments?.length || 0,
        pendingAmount,
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
  });
};
