export interface Payment {
  id: string;
  amount: number;
  payment_method: "cash" | "card" | "transfer" | "other";
  payment_date?: string;
  created_at: string;
  status: "paid" | "pending";
  notes?: string;
  membership_id: string;
  memberships: {
    member_id: string;
    plan_type: string;
    paid_amount: number;
    pending_amount: number;
    membership_plans: {
      name: string;
      price: number;
    };
  };
  // Nuevos campos para manejar pagos relacionados
  parent_payment_id?: string;
  is_partial_payment?: boolean;
  related_transactions?: Payment[];
}

export interface CreatePaymentData {
  membership_id: string;
  amount: number;
  payment_method: "cash" | "card" | "transfer" | "other";
  notes?: string;
  status?: "paid" | "pending";
  parent_payment_id?: string;
  is_partial_payment?: boolean;
}