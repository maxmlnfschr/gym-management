export type PlanType = 'monthly' | 'quarterly' | 'annual';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';

export interface Membership {
  id: string;
  memberId: string;
  planType: PlanType;
  startDate: Date;
  endDate: Date;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}

export interface MembershipFormData {
  planType: PlanType;
  startDate: Date;
  paymentStatus: 'pending' | 'paid' | 'overdue';
}

export interface Membership extends MembershipFormData {
  id: string;
  member_id: string;
  created_at: string;
  end_date: Date;
}