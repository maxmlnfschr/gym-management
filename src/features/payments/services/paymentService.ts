import { supabase } from "@/lib/supabase";
import { Payment, CreatePaymentData } from "../types";

export const paymentService = {
  getPayments: async (memberId: string) => {
    const { data, error } = await supabase
      .from("membership_payments")
      .select(
        `
        *,
        memberships!inner(
          id,
          member_id,
          plan_type,
          paid_amount,
          pending_amount,
          amount,
          membership_plans(
            name,
            price
          )
        )
      `
      )
      .eq("memberships.member_id", memberId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Payment[];
  },

  createPayment: async (data: CreatePaymentData) => {
    // Iniciar una transacción para asegurar que ambas operaciones se completen
    const { data: payment, error: paymentError } = await supabase
      .from("membership_payments")
      .insert([
        {
          ...data,
          status: data.status || "paid",
        },
      ])
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Actualizar el estado de la membresía
    const { error: membershipError } = await supabase
      .from("memberships")
      .update({
        payment_status: "paid",
        pending_amount: 0,
        paid_amount: data.amount,
      })
      .eq("id", data.membership_id);

    if (membershipError) throw membershipError;

    return payment;
  },

  async createPartialPayment(data: CreatePaymentData) {
    // First, get the current membership data
    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .select("pending_amount, paid_amount")
      .eq("id", data.membership_id)
      .single();

    if (membershipError) throw membershipError;

    const { data: payment, error } = await supabase
      .from("membership_payments")
      .insert({
        membership_id: data.membership_id,
        amount: data.amount,
        payment_method: data.payment_method,
        notes: data.notes,
        status: data.status || "pending",
      })
      .select(
        `
        *,
        memberships (
          member_id,
          plan_type,
          paid_amount,
          pending_amount,
          membership_plans (
            name
          )
        )
      `
      )
      .single();

    if (error) throw error;

    // Update membership amounts using current values
    const newPaidAmount = membership.paid_amount + data.amount;
    const newPendingAmount = Math.max(0, membership.pending_amount - data.amount);

    const { error: updateError } = await supabase
      .from("memberships")
      .update({
        paid_amount: newPaidAmount,
        pending_amount: newPendingAmount,
        payment_status: newPendingAmount === 0 ? "paid" : "pending"
      })
      .eq("id", data.membership_id);

    if (updateError) throw updateError;

    return payment;
  },

  async getPaymentWithTransactions(paymentId: string) {
    const { data: payment, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        memberships (
          member_id,
          plan_type,
          paid_amount,
          pending_amount,
          membership_plans (
            name
          )
        ),
        related_transactions:payments(*)
      `
      )
      .eq("id", paymentId)
      .single();

    if (error) throw error;
    return payment;
  },

  async updatePaymentStatus(
    paymentId: string,
    membershipId: string,
    totalPaid: number,
    totalAmount: number
  ) {
    const status = totalPaid >= totalAmount ? "paid" : "pending";

    const { error } = await supabase
      .from("membership_payments")
      .update({ status })
      .eq("id", paymentId);

    if (error) throw error;

    // Actualizar los montos en la membresía
    const { error: membershipError } = await supabase
      .from("memberships")
      .update({
        paid_amount: totalPaid,
        pending_amount: Math.max(0, totalAmount - totalPaid),
      })
      .eq("id", membershipId);

    if (membershipError) throw membershipError;
  },
};
