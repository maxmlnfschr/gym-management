export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'deleted';
  notes?: string;
  created_at: string;
  deleted_at?: string;
}

export interface MemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  notes?: string;
}