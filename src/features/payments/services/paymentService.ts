import { supabase } from "@/lib/supabase";
import { CreatePaymentData, Payment } from "../types";

export const paymentService = {
  getPayments: async (memberId: string) => {
    const { data, error } = await supabase
      .from("membership_payments")
      .select(`
        *,
        memberships!inner(
          member_id,
          plan_type,
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
    const { error } = await supabase
      .from("membership_payments")
      .insert([{
        ...data,
        status: data.status || "paid",
      }]);

    if (error) throw error;
  }
};