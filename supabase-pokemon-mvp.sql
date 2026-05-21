-- Pokemon MVP: Auth profiles + avatar storage
-- Run this in Supabase SQL Editor.

create table if not exists public.pokemon_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default 'Pokemon Trainer',
  xp_rank integer not null default 1000 check (xp_rank >= 0),
  avatar_path text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pokemon_profiles enable row level security;

create or replace function public.set_pokemon_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_pokemon_profiles_updated_at on public.pokemon_profiles;

create trigger set_pokemon_profiles_updated_at
before update on public.pokemon_profiles
for each row
execute function public.set_pokemon_profiles_updated_at();

create or replace function public.handle_new_pokemon_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_xp text;
begin
  raw_xp := new.raw_user_meta_data ->> 'xp_rank';

  insert into public.pokemon_profiles (id, email, display_name, xp_rank)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1), 'Pokemon Trainer'),
    case
      when raw_xp ~ '^[0-9]+$' then raw_xp::integer
      else 1000
    end
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.pokemon_profiles.display_name, excluded.display_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_pokemon_profile on auth.users;

create trigger on_auth_user_created_pokemon_profile
after insert on auth.users
for each row
execute function public.handle_new_pokemon_user();

drop policy if exists "Pokemon profiles owner select" on public.pokemon_profiles;
drop policy if exists "Pokemon profiles owner insert" on public.pokemon_profiles;
drop policy if exists "Pokemon profiles owner update" on public.pokemon_profiles;

create policy "Pokemon profiles owner select"
on public.pokemon_profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Pokemon profiles owner insert"
on public.pokemon_profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Pokemon profiles owner update"
on public.pokemon_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

insert into storage.buckets (id, name, public, file_size_limit)
values ('avatars', 'avatars', true, 5242880)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "Public read avatars" on storage.objects;
drop policy if exists "Users upload own profile avatars" on storage.objects;
drop policy if exists "Users update own profile avatars" on storage.objects;
drop policy if exists "Users delete own profile avatars" on storage.objects;

create policy "Public read avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

create policy "Users upload own profile avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Users update own profile avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Users delete own profile avatars"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = auth.uid()::text
);

-- Migration: add crypto profile fields
-- Run this block if the table already exists without these columns.
alter table public.pokemon_profiles
  add column if not exists favorite_crypto text not null default 'BTC',
  add column if not exists country text not null default '',
  add column if not exists base_currency text not null default 'USD';
