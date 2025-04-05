import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatePaymentData } from "../types";
import { paymentService } from "../services/paymentService";

export const usePayments = (memberId?: string) => {
  const queryClient = useQueryClient();

  const getPayments = useQuery({
    queryKey: ["payments", memberId],
    queryFn: () => paymentService.getPayments(memberId!),
    enabled: !!memberId,
  });

  const createPayment = useMutation({
    mutationFn: paymentService.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      if (memberId) {
        queryClient.invalidateQueries({ queryKey: ["payments", memberId] });
        queryClient.invalidateQueries({ queryKey: ["member-memberships", memberId] });
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