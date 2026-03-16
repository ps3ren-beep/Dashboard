-- RLS e funções RPC para mycash+ v2.0
-- Políticas: DROP IF EXISTS + CREATE (PostgreSQL não tem CREATE POLICY IF NOT EXISTS)

-- ============================================
-- RLS
-- ============================================
alter table public.users enable row level security;
alter table public.family_members enable row level security;
alter table public.categories enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.recurring_transactions enable row level security;

-- users
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users for select to authenticated using (id = auth.uid());

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users for insert to authenticated with check (id = auth.uid());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- family_members
drop policy if exists "family_members_by_user" on public.family_members;
create policy "family_members_by_user" on public.family_members for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- categories
drop policy if exists "categories_by_user" on public.categories;
create policy "categories_by_user" on public.categories for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- accounts
drop policy if exists "accounts_by_user" on public.accounts;
create policy "accounts_by_user" on public.accounts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- transactions
drop policy if exists "transactions_by_user" on public.transactions;
create policy "transactions_by_user" on public.transactions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- recurring_transactions
drop policy if exists "recurring_by_user" on public.recurring_transactions;
create policy "recurring_by_user" on public.recurring_transactions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================
-- RPC: create_transaction_with_installments
-- ============================================
create or replace function public.create_transaction_with_installments(
  p_type               transaction_type,
  p_amount             numeric,
  p_description        text,
  p_date               date,
  p_category_id        uuid,
  p_account_id         uuid,
  p_member_id          uuid,
  p_total_installments int default 1
) returns setof public.transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_base_amount numeric;
  v_i int;
  v_tx public.transactions;
begin
  if p_total_installments < 1 or p_total_installments > 12 then
    raise exception 'total_installments deve estar entre 1 e 12';
  end if;
  v_base_amount := round(p_amount / p_total_installments, 2);
  for v_i in 1..p_total_installments loop
    insert into public.transactions (
      user_id, type, amount, description, date,
      category_id, account_id, member_id,
      installment_number, total_installments,
      status
    ) values (
      v_user_id, p_type, v_base_amount, p_description, p_date,
      p_category_id, p_account_id, p_member_id,
      v_i, p_total_installments,
      'COMPLETED'
    )
    returning * into v_tx;
    return next v_tx;
  end loop;
  return;
end;
$$;

grant execute on function public.create_transaction_with_installments(transaction_type, numeric, text, date, uuid, uuid, uuid, int) to authenticated;
