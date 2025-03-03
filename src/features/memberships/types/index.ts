export type PlanType = "monthly" | "quarterly" | "annual";
export type PaymentStatus = "pending" | "paid"; // Removido 'overdue'

export interface Membership {
  id: string;
  member_id: string;
  plan_type: PlanType;
  start_date: string;
  end_date: string;
  payment_status: PaymentStatus;
  created_at: string;
  members: {
    first_name: string;
    last_name: string;
    email: string;
    deleted_at?: string | null;
    status: string;
  };
}

export interface MembershipFormData {
  planType: PlanType;
  startDate: Date;
  paymentStatus: PaymentStatus;
}
