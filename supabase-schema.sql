-- ══════════════════════════════════════════
-- LazyBizBabe HQ — Supabase Schema
-- Run this in Supabase > SQL Editor > New Query
-- ══════════════════════════════════════════

-- Sales
create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  amount numeric(10,2) not null,
  product text not null,
  created_at timestamptz default now()
);

-- Seed: first sale
insert into sales (amount, product) values (2.40, 'Quiet Launch Kit');

-- Follower log
create table if not exists followers_log (
  id uuid default gen_random_uuid() primary key,
  count integer not null,
  created_at timestamptz default now()
);

-- Seed: 7 days of history
insert into followers_log (count, created_at) values
  (390, now() - interval '6 days'),
  (395, now() - interval '5 days'),
  (400, now() - interval '4 days'),
  (401, now() - interval '3 days'),
  (410, now() - interval '2 days'),
  (420, now() - interval '1 day'),
  (429, now());

-- Brain dumps
create table if not exists brain_dumps (
  id uuid default gen_random_uuid() primary key,
  type text not null default '💡 Idea',
  text text not null,
  created_at timestamptz default now()
);

-- Later ideas
create table if not exists later_ideas (
  id uuid default gen_random_uuid() primary key,
  idea text not null,
  excitement integer default 3 check (excitement >= 1 and excitement <= 5),
  created_at timestamptz default now()
);

-- Habits
create table if not exists habits (
  id uuid default gen_random_uuid() primary key,
  habit_id text not null,
  completed_date date not null,
  created_at timestamptz default now(),
  unique(habit_id, completed_date)
);

-- Journal entries
create table if not exists journals (
  id uuid default gen_random_uuid() primary key,
  entry text not null,
  created_at timestamptz default now()
);

-- Milestones
create table if not exists milestones (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  icon text default '✦',
  created_at timestamptz default now()
);

-- Seed milestones
insert into milestones (text, icon, created_at) values
  ('First digital product sale ever — $2.40 Quiet Launch Kit', '💰', now() - interval '30 days'),
  ('Built an interactive HTML guide entirely on a Samsung A12', '📱', now() - interval '20 days'),
  ('Post hit 1,000+ views — gained 20+ new followers in a day', '📈', now() - interval '5 days');

-- Products
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price text not null,
  status text default 'draft' check (status in ('live', 'draft', 'retired')),
  sales integer default 0,
  description text,
  created_at timestamptz default now()
);

-- Seed products
insert into products (name, price, status, sales, description) values
  ('Soft Chaos: From Wallowing to Winning', '$37 (waitlist $27)', 'live', 0, 'Interactive HTML · Personalised plan generator · Dark mode · 16 quiz combos'),
  ('Start From $0: 5-Day Challenge', 'Free', 'live', 0, 'Lead magnet · Email capture · Auto-delivers on claim'),
  ('Nobody Bought It (Yet)', '$3', 'live', 0, 'Micro rescue guide · Entry upsell'),
  ('Quiet Launch Kit', '$10 (sold at $2.40)', 'retired', 1, 'Your first proof. Don''t forget this. 🤍');

-- Testimonials
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  from_who text not null,
  created_at timestamptz default now()
);

-- Seed testimonials
insert into testimonials (text, from_who) values
  ('"Bro you are a genius" — after seeing the interactive quiz + personalised plan feature', '@zarrar_builds — fellow builder, DM · May 2026'),
  ('"Wow this is soo cool like you''re story you''re a hustler"', '@zarrar_builds — on receiving the product · May 2026');

-- Post drafts
create table if not exists post_drafts (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  tag text default '',
  created_at timestamptz default now()
);

-- One thing (daily focus)
create table if not exists one_thing (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  date date not null unique,
  created_at timestamptz default now()
);

-- Mood log
create table if not exists mood_log (
  id uuid default gen_random_uuid() primary key,
  mood text not null,
  created_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──
-- Since this is a solo creator dashboard (no auth required), 
-- enable RLS but allow all operations via anon key for simplicity.
-- If you want to add auth later, update these policies.

alter table sales enable row level security;
alter table followers_log enable row level security;
alter table brain_dumps enable row level security;
alter table later_ideas enable row level security;
alter table habits enable row level security;
alter table journals enable row level security;
alter table milestones enable row level security;
alter table products enable row level security;
alter table testimonials enable row level security;
alter table post_drafts enable row level security;
alter table one_thing enable row level security;
alter table mood_log enable row level security;

-- Allow all via anon key (solo dashboard)
create policy "Allow all" on sales for all using (true) with check (true);
create policy "Allow all" on followers_log for all using (true) with check (true);
create policy "Allow all" on brain_dumps for all using (true) with check (true);
create policy "Allow all" on later_ideas for all using (true) with check (true);
create policy "Allow all" on habits for all using (true) with check (true);
create policy "Allow all" on journals for all using (true) with check (true);
create policy "Allow all" on milestones for all using (true) with check (true);
create policy "Allow all" on products for all using (true) with check (true);
create policy "Allow all" on testimonials for all using (true) with check (true);
create policy "Allow all" on post_drafts for all using (true) with check (true);
create policy "Allow all" on one_thing for all using (true) with check (true);
create policy "Allow all" on mood_log for all using (true) with check (true);

-- ── THREADS AUTH TOKEN STORAGE ──
-- Stores the long-lived access token so it can be refreshed automatically
create table if not exists threads_auth (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  access_token text not null,
  token_type text default 'bearer',
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table threads_auth enable row level security;
create policy "Allow all" on threads_auth for all using (true) with check (true);
