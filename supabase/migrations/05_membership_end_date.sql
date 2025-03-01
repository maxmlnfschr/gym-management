-- Crear la función para calcular la fecha de fin
CREATE OR REPLACE FUNCTION calculate_end_date(start_date date, plan_type text)
RETURNS date AS $$
BEGIN
  RETURN CASE plan_type
    WHEN 'monthly' THEN start_date + interval '1 month'
    WHEN 'quarterly' THEN start_date + interval '3 months'
    WHEN 'annual' THEN start_date + interval '1 year'
  END;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger que actualiza end_date
CREATE OR REPLACE FUNCTION update_membership_end_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.end_date := calculate_end_date(NEW.start_date, NEW.plan_type);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger
CREATE TRIGGER set_membership_end_date
  BEFORE INSERT OR UPDATE
  ON memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_membership_end_date();