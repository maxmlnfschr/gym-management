export type PlanType = "monthly" | "quarterly" | "annual" | "modify";
export type PaymentStatus = "pending" | "paid";
export type MembershipStatus = "active" | "expired" | "expiring" | "inactive";

export interface Membership {
  id: string;
  member_id: string;
  plan_id: string; // Añadimos el plan_id
  plan_type: PlanType;
  start_date: string;
  end_date: string;
  payment_status: PaymentStatus;
  status: MembershipStatus;
  deleted_at?: string;
  created_at: string;
  plan_name?: string;
  members: {
    first_name: string;
    last_name: string;
    email: string;
    deleted_at?: string | null;
    status: string;
  };
  membership_plans?: {
    // Añadimos la relación con membership_plans
    price: number;
    name: string;
    description?: string; // Agregamos el campo description como opcional
  };
}

export interface MembershipFormData {
  planId: string;
  startDate: Date;
  paymentStatus: PaymentStatus;
  planType: PlanType;
  payment_method?: "cash" | "card" | "transfer" | "other";
  payment_notes?: string;
  amount: number;
  pending_amount: number;
  paid_amount: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  plan_type: PlanType;
  description?: string; // Agregamos el campo description como opcional
}
