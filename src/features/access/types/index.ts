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

export interface CheckInResponse extends AccessLog {
  membership: Membership;
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
