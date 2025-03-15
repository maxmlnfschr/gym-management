create table membership_plans (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  duration_months integer not null,
  price integer not null,
  active boolean default true,
  description text,
  features jsonb default '[]'::jsonb
);

-- Insertar algunos planes por defecto
insert into membership_plans (name, duration_months, price, description) values
  ('Plan Mensual', 1, 5000, 'Acceso completo al gimnasio por un mes'),
  ('Plan Trimestral', 3, 13500, 'Acceso completo al gimnasio por tres meses'),
  ('Plan Anual', 12, 48000, 'Acceso completo al gimnasio por un año');