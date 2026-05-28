-- SUPABASE DATABASE SCHEMA FOR GROWTHVERSE CAREER ECOSYSTEM
-- career.sirganguly.com

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: career_nodes
create table if not exists public.career_nodes (
    id uuid primary key default uuid_generate_v4(),
    parent_id uuid references public.career_nodes(id) on delete cascade,
    title varchar(255) not null,
    slug varchar(255) not null unique,
    category varchar(100) not null, -- 'school', 'college', 'creators', 'skills', 'parents', 'teachers', 'graduates', 'ai'
    description text not null,
    future_scope text,
    salary_range varchar(100),
    skills_required text[], -- Array of skills needed
    exam_list text[], -- Entrance exams
    college_list text[], -- Recommended colleges
    audio_url varchar(1000), -- Supabase Storage link or mock URL
    image_url varchar(1000),
    coming_soon boolean default false,
    theme_color varchar(50) default 'cyan', -- 'cyan', 'green', 'purple', 'orange', 'warm', 'blue'
    audio_narration text, -- Full narration transcript
    motivation_guidance text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index parent_id for fast tree expansion queries
create index if not exists idx_career_nodes_parent on public.career_nodes(parent_id);
create index if not exists idx_career_nodes_category on public.career_nodes(category);

-- 2. Table: user_progress (Tracks which nodes the student has clicked/explored)
create table if not exists public.user_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null, -- Links to auth.users if logged in
    node_id uuid references public.career_nodes(id) on delete cascade not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status integer default 1, -- 1: Explored, 2: Bookmarked, 3: Completed
    unique(user_id, node_id)
);

-- 3. Table: job_postings (For the Professional Job Portal)
create table if not exists public.job_postings (
    id uuid primary key default uuid_generate_v4(),
    title varchar(255) not null,
    company varchar(255) not null,
    logo_url varchar(1000),
    location varchar(255) not null,
    salary varchar(100) not null,
    type varchar(50) not null default 'Full-time', -- 'Full-time', 'Part-time', 'Contract', 'Remote'
    description text not null,
    requirements text[] not null,
    apply_url varchar(1000),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.career_nodes enable row level security;
alter table public.user_progress enable row level security;
alter table public.job_postings enable row level security;

-- Policies for public tables (Allow read access to everyone)
create policy "Allow public read access to career_nodes" on public.career_nodes
    for select using (true);

create policy "Allow public read access to job_postings" on public.job_postings
    for select using (true);

-- User Progress policies (Allow users to manage their own progress records)
create policy "Allow users to view their own progress" on public.user_progress
    for select using (true); -- simplified, in prod link to auth.uid()

create policy "Allow users to insert their own progress" on public.user_progress
    for insert with check (true);
