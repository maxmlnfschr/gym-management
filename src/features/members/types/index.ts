export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  deleted_at?: string;
  notes?: string;
  created_at: string;
  status: 'active' | 'deleted';
  current_membership?: {
    id: string;
    start_date: string;
    end_date: string;
    payment_status: "pending" | "paid";
    plan_type: string; // Añadir esta propiedad
  };
}

export type MembershipStatusFilter = 'all' | 'active_membership' | 'overdue' | 'no_membership';

export interface FilterValues {
  search: string;
  status: MembershipStatusFilter;
  sortBy: 'name' | 'date' | 'status';
  sortDirection: 'asc' | 'desc';
}

export interface MemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  notes?: string;
}