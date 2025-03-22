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
      if (memberId) {
        queryClient.invalidateQueries({ queryKey: ["payments", memberId] });
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