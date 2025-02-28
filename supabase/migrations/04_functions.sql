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

-- Función para calcular la fecha de fin de membresía
create or replace function calculate_end_date(start_date date, plan_type text)
returns date as $$
begin
  return case plan_type
    when 'monthly' then start_date + interval '1 month'
    when 'quarterly' then start_date + interval '3 months'
    when 'annual' then start_date + interval '1 year'
  end;
end;
$$ language plpgsql;

-- Función para calcular la fecha de fin de membresía
create or replace function calculate_end_date(start_date date, plan_type text)
returns date as $$
begin
  return case plan_type
    when 'monthly' then start_date + interval '1 month'
    when 'quarterly' then start_date + interval '3 months'
    when 'annual' then start_date + interval '1 year'
  end;
end;
$$ language plpgsql IMMUTABLE;