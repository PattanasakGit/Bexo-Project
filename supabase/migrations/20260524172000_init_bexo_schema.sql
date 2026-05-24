create extension if not exists pgcrypto;

create table if not exists public.urls (
  id uuid primary key default gen_random_uuid(),
  original_url text not null,
  short_code varchar(20) not null,
  created_at timestamptz not null default now(),
  click_count integer not null default 0,
  password_hash text,
  safe_mode boolean not null default false,
  scan_status text not null default 'unknown',
  scanned_at timestamptz,
  user_id uuid references auth.users(id) on delete set null
);

alter table public.urls add column if not exists password_hash text;
alter table public.urls add column if not exists safe_mode boolean not null default false;
alter table public.urls add column if not exists scan_status text not null default 'unknown';
alter table public.urls add column if not exists scanned_at timestamptz;
alter table public.urls add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.urls add column if not exists short_code varchar(20);
alter table public.urls add column if not exists original_url text;
alter table public.urls add column if not exists created_at timestamptz;
alter table public.urls add column if not exists click_count integer;
alter table public.urls alter column created_at set default now();
alter table public.urls alter column click_count set default 0;

create unique index if not exists urls_short_code_key on public.urls(short_code);
create index if not exists idx_urls_user_id_created_at on public.urls(user_id, created_at desc);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  page_code varchar(20) not null,
  title text not null,
  bio text,
  avatar_emoji text not null default '🔗',
  theme text not null default 'warm',
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.pages add column if not exists page_code varchar(20);
alter table public.pages add column if not exists title text;
alter table public.pages add column if not exists bio text;
alter table public.pages add column if not exists avatar_emoji text not null default '🔗';
alter table public.pages add column if not exists theme text not null default 'warm';
alter table public.pages add column if not exists view_count integer not null default 0;
alter table public.pages add column if not exists created_at timestamptz not null default now();
alter table public.pages alter column avatar_emoji set default '🔗';
alter table public.pages alter column theme set default 'warm';
alter table public.pages alter column view_count set default 0;
alter table public.pages alter column created_at set default now();

create unique index if not exists pages_page_code_key on public.pages(page_code);

create table if not exists public.page_links (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  click_count integer not null default 0
);

alter table public.page_links add column if not exists page_id uuid references public.pages(id) on delete cascade;
alter table public.page_links add column if not exists title text;
alter table public.page_links add column if not exists url text;
alter table public.page_links add column if not exists position integer not null default 0;
alter table public.page_links add column if not exists click_count integer not null default 0;
alter table public.page_links alter column position set default 0;
alter table public.page_links alter column click_count set default 0;

create index if not exists idx_page_links_page_id_position on public.page_links(page_id, position);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.urls enable row level security;
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.page_links enable row level security;

drop policy if exists "urls_public_select" on public.urls;
drop policy if exists "urls_public_insert" on public.urls;
drop policy if exists "urls_public_update_counts" on public.urls;
drop policy if exists "urls_owner_delete" on public.urls;

create policy "urls_public_select" on public.urls
  for select using (true);

create policy "urls_public_insert" on public.urls
  for insert with check (true);

create policy "urls_public_update_counts" on public.urls
  for update using (true) with check (true);

create policy "urls_owner_delete" on public.urls
  for delete using (auth.uid() = user_id);

drop policy if exists "profiles_owner_select" on public.profiles;
drop policy if exists "profiles_owner_insert" on public.profiles;
drop policy if exists "profiles_owner_update" on public.profiles;

create policy "profiles_owner_select" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_owner_insert" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "pages_public_select" on public.pages;
drop policy if exists "pages_public_insert" on public.pages;
drop policy if exists "pages_public_update_counts" on public.pages;

create policy "pages_public_select" on public.pages
  for select using (true);

create policy "pages_public_insert" on public.pages
  for insert with check (true);

create policy "pages_public_update_counts" on public.pages
  for update using (true) with check (true);

drop policy if exists "page_links_public_select" on public.page_links;
drop policy if exists "page_links_public_insert" on public.page_links;
drop policy if exists "page_links_public_update_counts" on public.page_links;

create policy "page_links_public_select" on public.page_links
  for select using (true);

create policy "page_links_public_insert" on public.page_links
  for insert with check (true);

create policy "page_links_public_update_counts" on public.page_links
  for update using (true) with check (true);
