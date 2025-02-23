-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Función para soft delete
CREATE OR REPLACE FUNCTION soft_delete_member(member_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE members
    SET deleted_at = now(),
        status = 'deleted'
    WHERE id = member_id;
END;
$$ LANGUAGE plpgsql;