-- PokeXchange: portfolio, holdings and transactions.
-- Run this in the Supabase SQL Editor (after supabase-pokemon-mvp.sql).

-- ---------------------------------------------------------------------------
-- Wallet / cash balance, one row per trainer.
-- ---------------------------------------------------------------------------
create table if not exists public.pokemon_portfolios (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cash_balance numeric(20, 2) not null default 10000000 check (cash_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Owned cards. quantity + average cost basis for P&L.
-- ---------------------------------------------------------------------------
create table if not exists public.pokemon_holdings (
  user_id uuid not null references auth.users(id) on delete cascade,
  pokemon_id integer not null,
  quantity integer not null default 0 check (quantity >= 0),
  avg_cost numeric(20, 2) not null default 0 check (avg_cost >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, pokemon_id)
);

-- ---------------------------------------------------------------------------
-- Append-only trade log (buy / sell / swap legs).
-- ---------------------------------------------------------------------------
create table if not exists public.pokemon_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pokemon_id integer not null,
  asset_name text,
  asset_ticker text,
  side text not null check (side in ('buy', 'sell', 'swap_out', 'swap_in')),
  quantity integer not null check (quantity > 0),
  unit_price numeric(20, 2) not null,
  total numeric(20, 2) not null,
  executed_at timestamptz not null default now()
);

create index if not exists pokemon_transactions_user_time_idx
  on public.pokemon_transactions (user_id, executed_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger (shared helper).
-- ---------------------------------------------------------------------------
create or replace function public.set_pokemon_exchange_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_pokemon_portfolios_updated_at on public.pokemon_portfolios;
create trigger set_pokemon_portfolios_updated_at
before update on public.pokemon_portfolios
for each row
execute function public.set_pokemon_exchange_updated_at();

drop trigger if exists set_pokemon_holdings_updated_at on public.pokemon_holdings;
create trigger set_pokemon_holdings_updated_at
before update on public.pokemon_holdings
for each row
execute function public.set_pokemon_exchange_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: every trainer only sees / writes their own rows.
-- ---------------------------------------------------------------------------
alter table public.pokemon_portfolios enable row level security;
alter table public.pokemon_holdings enable row level security;
alter table public.pokemon_transactions enable row level security;

drop policy if exists "Portfolios owner all" on public.pokemon_portfolios;
create policy "Portfolios owner all"
on public.pokemon_portfolios
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Holdings owner all" on public.pokemon_holdings;
create policy "Holdings owner all"
on public.pokemon_holdings
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Transactions owner select" on public.pokemon_transactions;
create policy "Transactions owner select"
on public.pokemon_transactions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Transactions owner insert" on public.pokemon_transactions;
create policy "Transactions owner insert"
on public.pokemon_transactions
for insert
to authenticated
with check (auth.uid() = user_id);
