-- mycash+ v2.0 – schema base para Supabase (projeto Creative)
-- Ordem: função → enums → users → family_members → categories → accounts → recurring_transactions → transactions

-- ============================================
-- Helper para updated_at (deve existir antes dos triggers)
-- ============================================
create or replace function public.set_current_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================
-- Extensões
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- Enums
-- ============================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'transaction_type') then
    create type transaction_type as enum ('INCOME', 'EXPENSE');
  end if;
  if not exists (select 1 from pg_type where typname = 'account_type') then
    create type account_type as enum ('CHECKING', 'SAVINGS', 'CREDIT_CARD');
  end if;
  if not exists (select 1 from pg_type where typname = 'recurrence_frequency') then
    create type recurrence_frequency as enum ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
  end if;
  if not exists (select 1 from pg_type where typname = 'transaction_status') then
    create type transaction_status as enum ('PENDING', 'COMPLETED');
  end if;
end
$$;

-- ============================================
-- users (perfil do auth.users)
-- ============================================
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text not null,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_timestamp_users on public.users;
create trigger set_timestamp_users
before update on public.users
for each row execute procedure public.set_current_timestamp();

-- ============================================
-- family_members
-- ============================================
create table if not exists public.family_members (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  name           text not null,
  role           text not null,
  avatar_url     text,
  monthly_income numeric(12,2) not null default 0,
  color          text not null default '#3247FF',
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_family_members_user_id on public.family_members(user_id);

drop trigger if exists set_timestamp_family_members on public.family_members;
create trigger set_timestamp_family_members
before update on public.family_members for each row execute procedure public.set_current_timestamp();

-- ============================================
-- categories
-- ============================================
create table if not exists public.categories (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  name       text not null,
  icon       text not null default '📌',
  type       transaction_type not null,
  color      text not null default '#3247FF',
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_categories_user_type on public.categories(user_id, type);

drop trigger if exists set_timestamp_categories on public.categories;
create trigger set_timestamp_categories
before update on public.categories for each row execute procedure public.set_current_timestamp();

-- ============================================
-- accounts (contas + cartões)
-- ============================================
create table if not exists public.accounts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  type          account_type not null,
  name          text not null,
  bank          text not null,
  last_digits   text,
  holder_id     uuid not null references public.family_members(id),
  balance       numeric(12,2) not null default 0,
  credit_limit  numeric(12,2),
  current_bill  numeric(12,2) not null default 0,
  due_day       int,
  closing_day   int,
  theme         text default 'black',
  logo_url      text,
  color         text not null default '#3247FF',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_accounts_user_type on public.accounts(user_id, type);
create index if not exists idx_accounts_holder_id on public.accounts(holder_id);

drop trigger if exists set_timestamp_accounts on public.accounts;
create trigger set_timestamp_accounts
before update on public.accounts for each row execute procedure public.set_current_timestamp();

-- ============================================
-- recurring_transactions (antes de transactions por causa da FK)
-- ============================================
create table if not exists public.recurring_transactions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users(id) on delete cascade,
  type           transaction_type not null default 'EXPENSE',
  amount         numeric(12,2) not null,
  description    text not null,
  category_id    uuid references public.categories(id) on delete set null,
  account_id     uuid references public.accounts(id) on delete set null,
  member_id      uuid references public.family_members(id) on delete set null,
  frequency      recurrence_frequency not null,
  day_of_month   int,
  day_of_week    int,
  start_date     date not null,
  end_date       date,
  is_active      boolean not null default true,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_recurring_user_active on public.recurring_transactions(user_id, is_active);

drop trigger if exists set_timestamp_recurring_transactions on public.recurring_transactions;
create trigger set_timestamp_recurring_transactions
before update on public.recurring_transactions for each row execute procedure public.set_current_timestamp();

-- ============================================
-- transactions
-- ============================================
create table if not exists public.transactions (
  id                        uuid primary key default uuid_generate_v4(),
  user_id                   uuid not null references public.users(id) on delete cascade,
  type                      transaction_type not null,
  amount                    numeric(12,2) not null,
  description               text not null,
  date                      date not null,
  category_id               uuid references public.categories(id) on delete set null,
  account_id                uuid references public.accounts(id) on delete set null,
  member_id                 uuid references public.family_members(id) on delete set null,
  installment_number        int,
  total_installments        int not null default 1,
  parent_transaction_id     uuid references public.transactions(id) on delete cascade,
  is_recurring              boolean not null default false,
  recurring_transaction_id  uuid references public.recurring_transactions(id) on delete set null,
  status                    transaction_status not null default 'COMPLETED',
  notes                     text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);
create index if not exists idx_transactions_user_date on public.transactions(user_id, date);
create index if not exists idx_transactions_account on public.transactions(account_id);
create index if not exists idx_transactions_member on public.transactions(member_id);
create index if not exists idx_transactions_recurring on public.transactions(recurring_transaction_id);
create index if not exists idx_transactions_parent on public.transactions(parent_transaction_id);

drop trigger if exists set_timestamp_transactions on public.transactions;
create trigger set_timestamp_transactions
before update on public.transactions for each row execute procedure public.set_current_timestamp();
