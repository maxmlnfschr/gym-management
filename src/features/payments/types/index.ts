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
    membership_plans: {
      name: string;
    };
  };
}

export interface CreatePaymentData {
  membership_id: string;
  amount: number;
  payment_method: "cash" | "card" | "transfer" | "other";
  notes?: string;
  status?: "paid" | "pending";
}