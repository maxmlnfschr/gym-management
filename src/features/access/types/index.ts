export interface AccessLog {
  id: string;
  member_id: string;
  check_in: string;
  created_at: string;
}

export interface AccessLogWithMember extends AccessLog {
  members: {
    first_name: string;
    last_name: string;
  };
}