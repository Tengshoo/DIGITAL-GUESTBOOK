-- =========================================================================
-- EVERAFTER / MEMOIRA DIGITAL GUESTBOOK - SUPABASE SCHEMA
-- =========================================================================
-- Instructions:
-- 1. Create a free project at https://supabase.com
-- 2. Go to the "SQL Editor" in the left sidebar
-- 3. Paste this entire script and click "Run"
-- =========================================================================

-- 1. Create the guestbook entries table
create table if not exists public.entries (
  id bigint primary key generated always as identity,
  name text not null,
  message text not null,
  photo_url text,
  signature_svg text,
  audio_url text,
  is_approved smallint default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Realtime updates for the Live Wall
alter publication supabase_realtime add table public.entries;

-- 3. Enable Row Level Security (RLS)
alter table public.entries enable row level security;

-- 4. Create Policies
-- Allow any guest to submit their wishes, photos, and voice notes
create policy "Allow public submissions"
  on public.entries
  for insert
  with check (true);

-- Allow anyone to view approved memories on the Live Wall & Home
create policy "Allow reading approved entries"
  on public.entries
  for select
  using (is_approved = 1);

-- Allow moderation (approve/hide/delete)
create policy "Allow updates for moderation"
  on public.entries
  for update
  using (true);

create policy "Allow deletions for moderation"
  on public.entries
  for delete
  using (true);

-- 5. Insert welcome sample memories for Atif & Isma
insert into public.entries (name, message, is_approved)
values
  ('Harith & Sarah', 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fi khair! Semoga mahligai yang dibina kekal hingga ke jannah. Selamat pengantin baru Atif & Isma!', 1),
  ('Family Pak Ngah', 'Tahniah Atif & Isma! Sama cantik sama padan. Moga dikurniakan zuriat yang soleh dan solehah serta kebahagiaan berpanjangan.', 1);
