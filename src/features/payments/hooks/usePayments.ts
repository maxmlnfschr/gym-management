import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import { CreatePaymentData } from "../types";

export const usePayments = (memberId?: string) => {
  const queryClient = useQueryClient();

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ["payments", memberId],
    queryFn: () => paymentService.getPayments(memberId!),
    enabled: !!memberId
  });

  const createPayment = useMutation({
    mutationFn: (data: CreatePaymentData) => paymentService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", memberId] });
      queryClient.invalidateQueries({ queryKey: ["memberships", memberId] });
    }
  });

  const createPartialPayment = useMutation({
    mutationFn: (data: CreatePaymentData) => paymentService.createPartialPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", memberId] });
      queryClient.invalidateQueries({ queryKey: ["memberships", memberId] });
    }
  });

  return {
    payments,
    isLoading,
    error,
    createPayment,
    createPartialPayment
  };
};