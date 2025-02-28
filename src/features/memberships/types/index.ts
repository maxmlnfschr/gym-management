export type PlanType = 'monthly' | 'quarterly' | 'annual';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';

export interface Membership {
  id: string;
  member_id: string;
  plan_type: PlanType;
  start_date: string;
  end_date: string;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface MembershipFormData {
  planType: PlanType;
  startDate: Date;
  paymentStatus: PaymentStatus;
}