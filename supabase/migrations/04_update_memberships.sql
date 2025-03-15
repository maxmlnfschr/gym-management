-- Agregar columna plan_id
alter table memberships
add column plan_id uuid references membership_plans(id);

-- Mantener plan_type temporalmente para migración de datos