-- Políticas de Seguridad (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members visible to authenticated users" ON members
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Members editable by authenticated users" ON members
  FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Memberships visible to authenticated users" ON memberships
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Memberships editable by authenticated users" ON memberships
  FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access logs visible to authenticated users" ON access_logs
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Access logs editable by authenticated users" ON access_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');