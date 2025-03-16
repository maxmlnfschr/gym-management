import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface CreatePaymentData {
  membership_id: string;
  amount: number;
  payment_method: "cash" | "card" | "transfer" | "other";
  notes?: string;
}

export const useMembershipPayments = (memberId?: string) => {
  const queryClient = useQueryClient();

  const getPayments = useQuery({
    queryKey: ["membership-payments", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_payments")
        .select(
          `
          *,
          memberships!inner(member_id)
        `
        )
        .eq("memberships.member_id", memberId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
  });

  const createPayment = useMutation({
    mutationFn: async (data: CreatePaymentData) => {
      const { error } = await supabase.from("membership_payments").insert([
        {
          ...data,
          status: "paid",
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-metrics"] });
      if (memberId) {
        queryClient.invalidateQueries({
          queryKey: ["membership-payments", memberId],
        });
      }
    },
  });

  return {
    payments: getPayments.data || [],
    isLoading: getPayments.isLoading,
    error: getPayments.error,
    createPayment,
  };
};
