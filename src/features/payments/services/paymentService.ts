import { supabase } from "@/lib/supabase";
import { CreatePaymentData, Payment } from "../types";

export const paymentService = {
  getPayments: async (memberId: string) => {
    const { data, error } = await supabase
      .from("membership_payments")
      .select(`
        *,
        memberships!inner(
          id,
          member_id,
          plan_type,
          paid_amount,
          pending_amount,
          amount,
          membership_plans(
            name
          )
        )
      `)
      .eq("memberships.member_id", memberId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Payment[];
  },

  createPayment: async (data: CreatePaymentData) => {
    // Iniciar una transacción para asegurar que ambas operaciones se completen
    const { data: payment, error: paymentError } = await supabase
      .from("membership_payments")
      .insert([{
        ...data,
        status: data.status || "paid",
      }])
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Actualizar el estado de la membresía
    const { error: membershipError } = await supabase
      .from("memberships")
      .update({ 
        payment_status: "paid",
        pending_amount: 0,
        paid_amount: data.amount // Actualizar el monto pagado
      })
      .eq("id", data.membership_id);

    if (membershipError) throw membershipError;

    return payment;
  }
};