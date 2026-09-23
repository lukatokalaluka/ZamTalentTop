create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  slug text not null unique,
  name text not null,
  display_name text not null,
  title text not null default '',
  category text not null default 'Professional',
  bio text not null default '',
  location text not null default '',
  image_url text not null default '',
  cover_url text not null default '',
  skills jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  status text not null default 'ACTIVE' check (status in ('DRAFT', 'ACTIVE')),
  availability text not null default 'Available for work',
  price text not null default '',
  rating numeric(3, 2),
  reviews integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  service_name text not null,
  date date,
  time time,
  duration_hours numeric not null default 1,
  total_minor integer not null default 0,
  status text not null default 'PENDING',
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Active profiles are public" on public.profiles;
create policy "Active profiles are public" on public.profiles
  for select using (status = 'ACTIVE' or auth.uid() = user_id);

drop policy if exists "Users manage their profile" on public.profiles;
create policy "Users manage their profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users view their bookings" on public.bookings;
create policy "Users view their bookings" on public.bookings
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

drop policy if exists "Authenticated users create bookings" on public.bookings;
create policy "Authenticated users create bookings" on public.bookings
  for insert with check (auth.uid() = buyer_id);

grant select on public.profiles to anon, authenticated;
grant insert, update, delete on public.profiles to authenticated;
grant select, insert on public.bookings to authenticated;