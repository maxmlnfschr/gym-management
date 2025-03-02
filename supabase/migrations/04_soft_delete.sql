-- Habilitar RLS en las tablas
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Modificar las políticas existentes para incluir el filtro de soft delete
DROP POLICY IF EXISTS "Members visible to authenticated users" ON members;
DROP POLICY IF EXISTS "Members editable by authenticated users" ON members;
DROP POLICY IF EXISTS "Members soft delete by authenticated users" ON members;
DROP POLICY IF EXISTS "Memberships visible to authenticated users" ON memberships;
DROP POLICY IF EXISTS "Memberships editable by authenticated users" ON memberships;
DROP POLICY IF EXISTS "Access logs visible to authenticated users" ON access_logs;
DROP POLICY IF EXISTS "Access logs editable by authenticated users" ON access_logs;

-- Recrear las políticas con el filtro de soft delete
CREATE POLICY "Members visible to authenticated users" ON members
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        deleted_at IS NULL
    );

CREATE POLICY "Members editable by authenticated users" ON members
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Members soft delete by authenticated users" ON members
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Memberships visible to authenticated users" ON memberships
    FOR SELECT USING (
        auth.role() = 'authenticated' AND
        member_id IN (SELECT id FROM members WHERE deleted_at IS NULL)
    );

CREATE POLICY "Memberships editable by authenticated users" ON memberships
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        member_id IN (SELECT id FROM members WHERE deleted_at IS NULL)
    );

CREATE POLICY "Access logs visible to authenticated users" ON access_logs
    FOR SELECT USING (
        auth.role() = 'authenticated' AND
        member_id IN (SELECT id FROM members WHERE deleted_at IS NULL)
    );

CREATE POLICY "Access logs editable by authenticated users" ON access_logs
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        member_id IN (SELECT id FROM members WHERE deleted_at IS NULL)
    );

-- Actualizar la función existente para manejar updated_at y soft delete
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        NEW.status = 'deleted';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;