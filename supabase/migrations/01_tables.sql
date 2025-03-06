-- Configuraciones del gimnasio
create table gym_settings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  gym_name text not null,
  settings jsonb default '{}'::jsonb
);

-- Miembros
create table members (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  status text default 'active',
  notes text,
  deleted_at timestamp with time zone
);

-- Membresías
create table memberships (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  member_id uuid references members(id),
  plan_type text not null,
  start_date date not null,
  end_date date generated always as (calculate_end_date(start_date, plan_type)) stored,
  payment_status text default 'pending'
);

-- Registro de accesos
create table access_logs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  member_id uuid references members(id),
  check_in timestamp with time zone not null,
  status text default 'allowed'
);