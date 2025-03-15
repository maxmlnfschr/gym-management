export type PlanType = "monthly" | "quarterly" | "annual" | "modify";
export type PaymentStatus = "pending" | "paid";

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
  planId: string;
  startDate: Date;
  paymentStatus: PaymentStatus;
  planType: PlanType;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  plan_type: PlanType; // Using the PlanType type alias instead of inline types
}
