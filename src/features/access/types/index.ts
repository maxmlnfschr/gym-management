export interface Membership {
  id: string;
  status: 'active' | 'inactive' | 'expired';
  end_date: string;
}

export interface AccessLog {
  id: string;
  member_id: string;
  check_in: string;
  created_at: string;
  membership?: Membership;
}
export type MembershipStatus = 'active' | 'inactive' | 'expired' | 'last_day';

export interface CheckInResponse {
  id: string;
  member_id: string;
  check_in: string;
  membership?: {
    id: string;
    status: MembershipStatus;
    end_date: string;
  };
}
export interface AccessLogWithMember extends AccessLog {
  members: {
    first_name: string;
    last_name: string;
  };
}

export interface AccessFilterValues {
  search: string;
  dateRange: "day" | "week" | "month" | "all";
  sortBy: "date" | "member" | "status";
  sortDirection: "asc" | "desc";
}
