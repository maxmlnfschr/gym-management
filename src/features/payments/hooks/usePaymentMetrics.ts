import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PaymentMetrics } from "../types/metrics";

export const usePaymentMetrics = (memberId?: string) => {
  return useQuery({
    queryKey: ["payment-metrics", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_payments")
        .select("amount, status")
        .eq(memberId ? "memberships.member_id" : "id", memberId || "*");

      if (error) throw error;

      const metrics: PaymentMetrics = {
        totalPayments: data.length,
        pendingPayments: data.filter((p) => p.status === "pending").length,
        totalAmount: data.reduce((sum, p) => sum + p.amount, 0),
        pendingAmount: data
          .filter((p) => p.status === "pending")
          .reduce((sum, p) => sum + p.amount, 0),
      };

      return metrics;
    },
    enabled: true,
  });
};