-- Índices
CREATE INDEX idx_members_status ON members(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_memberships_dates ON memberships(start_date, end_date);
CREATE INDEX idx_access_logs_member ON access_logs(member_id);