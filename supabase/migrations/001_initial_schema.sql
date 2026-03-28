-- KidToCollege Database Schema
-- Run this in Supabase SQL Editor or via supabase db push

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Users (extends Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  role text not null check (role in ('parent', 'student')) default 'parent',
  partner_id uuid references public.users(id),
  created_at timestamptz not null default now()
);

-- Colleges reference table
create table public.colleges (
  slug text primary key,
  name text not null,
  location text not null,
  state text not null,
  acceptance_rate numeric,
  avg_cost_instate numeric,
  avg_cost_outstate numeric,
  graduation_rate numeric,
  total_enrollment integer,
  photo_url text,
  programs text[] default '{}',
  last_updated timestamptz not null default now()
);

-- Searches
create table public.searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  college text not null,
  major text not null,
  minor text,
  application_year text,
  gpa text,
  sat_score text,
  grade_year text,
  state text,
  campus_setting text[] default '{}',
  activities text[] default '{}',
  other_skills text,
  volunteer text,
  priorities text[] default '{}',
  budget text,
  notes text,
  created_at timestamptz not null default now()
);

-- AI Results
create table public.results (
  id uuid primary key default uuid_generate_v4(),
  search_id uuid not null references public.searches(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  match_score integer,
  raw_ai_response jsonb not null,
  scholarships_json jsonb,
  playbook_json jsonb,
  budget_json jsonb,
  cc_gateway_json jsonb,
  created_at timestamptz not null default now(),
  cache_key text
);

-- Saved colleges per user
create table public.saved_colleges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  college_slug text not null,
  college_name text not null,
  user_notes text,
  created_at timestamptz not null default now(),
  unique(user_id, college_slug)
);

-- Follow-up questions on results
create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  search_id uuid not null references public.searches(id) on delete cascade,
  college_slug text,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

-- Coach sessions
create table public.coach_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  search_id uuid references public.searches(id) on delete set null,
  section text not null check (section in (
    'roadmap', 'essay', 'test-prep', 'interviews',
    'recommendations', 'financial-aid'
  )),
  content_json jsonb not null,
  created_at timestamptz not null default now()
);

-- Checklist items
create table public.checklist_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  college_slug text not null,
  college_name text not null,
  item_type text not null check (item_type in (
    'application', 'essay', 'recommendation', 'test-score',
    'fafsa', 'css-profile', 'scholarship', 'other'
  )),
  item_label text not null,
  deadline date,
  status text not null check (status in (
    'not-started', 'in-progress', 'done'
  )) default 'not-started',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Essay drafts
create table public.essay_drafts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  draft_type text not null check (draft_type in (
    'personal-statement', 'supplemental', 'other'
  )),
  college_slug text,
  content text not null default '',
  ai_feedback text,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_searches_user on public.searches(user_id);
create index idx_searches_cache on public.searches(college, major);
create index idx_results_search on public.results(search_id);
create index idx_results_cache on public.results(cache_key);
create index idx_saved_colleges_user on public.saved_colleges(user_id);
create index idx_questions_search on public.questions(search_id);
create index idx_coach_sessions_user on public.coach_sessions(user_id);
create index idx_checklist_user on public.checklist_items(user_id);
create index idx_checklist_deadline on public.checklist_items(user_id, deadline);
create index idx_essay_drafts_user on public.essay_drafts(user_id);
create index idx_colleges_state on public.colleges(state);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.colleges enable row level security;
alter table public.searches enable row level security;
alter table public.results enable row level security;
alter table public.saved_colleges enable row level security;
alter table public.questions enable row level security;
alter table public.coach_sessions enable row level security;
alter table public.checklist_items enable row level security;
alter table public.essay_drafts enable row level security;

-- Users: can read/update own row
create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- Users: can view partner profile
create policy "Users can view partner"
  on public.users for select using (
    id = (select partner_id from public.users where id = auth.uid())
  );

-- Colleges: public read
create policy "Colleges are publicly readable"
  on public.colleges for select using (true);
create policy "Service role can manage colleges"
  on public.colleges for all using (
    auth.role() = 'service_role'
  );

-- Searches: own + partner's
create policy "Users can view own searches"
  on public.searches for select using (
    auth.uid() = user_id
    or user_id = (select partner_id from public.users where id = auth.uid())
  );
create policy "Users can insert own searches"
  on public.searches for insert with check (
    auth.uid() = user_id or user_id is null
  );
-- Allow anonymous searches (user_id is null)
create policy "Anonymous searches allowed"
  on public.searches for insert with check (user_id is null);

-- Results: own + partner's + anonymous
create policy "Users can view own results"
  on public.results for select using (
    auth.uid() = user_id
    or user_id = (select partner_id from public.users where id = auth.uid())
    or user_id is null
  );
create policy "Users can insert results"
  on public.results for insert with check (true);
create policy "Anonymous can view own results"
  on public.results for select using (user_id is null);

-- Saved colleges: own only
create policy "Users manage own saved colleges"
  on public.saved_colleges for all using (auth.uid() = user_id);

-- Questions: readable by anyone for anonymised Q&A, writable by owner
create policy "Questions are publicly readable"
  on public.questions for select using (true);
create policy "Users can insert questions"
  on public.questions for insert with check (
    auth.uid() = user_id or user_id is null
  );

-- Coach sessions: own only
create policy "Users manage own coach sessions"
  on public.coach_sessions for all using (auth.uid() = user_id);

-- Checklist: own + partner's
create policy "Users manage own checklist"
  on public.checklist_items for all using (
    auth.uid() = user_id
    or user_id = (select partner_id from public.users where id = auth.uid())
  );

-- Essay drafts: own only
create policy "Users manage own essay drafts"
  on public.essay_drafts for all using (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger checklist_updated_at
  before update on public.checklist_items
  for each row execute function public.handle_updated_at();

create trigger essay_drafts_updated_at
  before update on public.essay_drafts
  for each row execute function public.handle_updated_at();

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'parent'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
