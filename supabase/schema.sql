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

alter table public.profiles add column if not exists legal_name text not null default '';
alter table public.profiles add column if not exists phone text not null default '';
alter table public.profiles add column if not exists artist_name text not null default '';
alter table public.profiles add column if not exists organisation_name text not null default '';
alter table public.profiles add column if not exists display_preference text not null default 'legal_name';
alter table public.profiles add column if not exists province text not null default '';
alter table public.profiles add column if not exists town text not null default '';
alter table public.profiles add column if not exists latitude double precision;
alter table public.profiles add column if not exists longitude double precision;
alter table public.profiles add column if not exists avatar_url text not null default '';
alter table public.profiles add column if not exists portfolio_media jsonb not null default '[]'::jsonb;

update public.profiles
set legal_name = coalesce(nullif(legal_name, ''), name),
    display_name = coalesce(nullif(display_name, ''), name)
where legal_name = '' or display_name = '';

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

create table if not exists public.marketplace_products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default 'Sample pack / beat',
  price_minor integer not null default 0,
  image_url text not null default '',
  preview_url text not null default '',
  media_type text not null default 'audio',
  status text not null default 'PUBLISHED',
  created_at timestamptz not null default now()
);

alter table public.marketplace_products add column if not exists preview_url text not null default '';
alter table public.marketplace_products add column if not exists media_type text not null default 'audio';
alter table public.marketplace_products add column if not exists seller_id uuid references auth.users(id) on delete cascade;

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.marketplace_products enable row level security;

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
grant select on public.marketplace_products to anon, authenticated;
grant insert, update, delete on public.marketplace_products to authenticated;

drop policy if exists "Published products are public" on public.marketplace_products;
create policy "Published products are public" on public.marketplace_products
  for select using (status = 'PUBLISHED' or auth.uid() = seller_id);

drop policy if exists "Sellers manage products" on public.marketplace_products;
create policy "Sellers manage products" on public.marketplace_products
  for all to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Public avatar files are readable" on storage.objects;
create policy "Public avatar files are readable" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Users upload their avatar" on storage.objects;
create policy "Users upload their avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users update their avatar" on storage.objects;
create policy "Users update their avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

insert into storage.buckets (id, name, public)
values ('creator-media', 'creator-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public creator media is readable" on storage.objects;
create policy "Public creator media is readable" on storage.objects
  for select using (bucket_id = 'creator-media');

drop policy if exists "Creators upload media" on storage.objects;
create policy "Creators upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'creator-media' and (storage.foldername(name))[1] = auth.uid()::text);