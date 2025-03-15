-- Crear función para actualizar updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Crear tabla de pagos de membresías
create table public.membership_payments (
    id uuid default gen_random_uuid() primary key,
    membership_id uuid references public.memberships(id) not null,
    amount decimal(10,2) not null,
    payment_date timestamp with time zone default now(),
    payment_method text check (payment_method in ('cash', 'card', 'transfer', 'other')),
    status text default 'completed' check (status in ('completed', 'pending', 'failed', 'refunded')),
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Añadir índices
create index idx_membership_payments_membership_id on public.membership_payments(membership_id);
create index idx_membership_payments_payment_date on public.membership_payments(payment_date);
create index idx_membership_payments_status on public.membership_payments(status);

-- Habilitar RLS (Seguridad a nivel de fila)
alter table public.membership_payments enable row level security;

-- Políticas de seguridad
create policy "Enable read access for authenticated users"
on public.membership_payments for select
using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users"
on public.membership_payments for insert
with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users"
on public.membership_payments for update
using (auth.role() = 'authenticated');

-- Disparadores para updated_at
create trigger set_updated_at
    before update on public.membership_payments
    for each row
    execute procedure public.set_updated_at();

-- Comentarios de documentación
comment on table public.membership_payments is 'Almacena todas las transacciones de pago de membresías';
comment on column public.membership_payments.payment_method is 'Método utilizado para el pago: efectivo, tarjeta, transferencia u otro';
comment on column public.membership_payments.status is 'Estado del pago: completado, pendiente, fallido o reembolsado';