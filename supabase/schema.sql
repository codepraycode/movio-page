-- Movio Survey — Supabase schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → Run.
-- Safe to re-run: uses IF NOT EXISTS / drops policies before recreating them.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists waitlist (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null unique,
    created_at timestamp with time zone default now()
);

create table if not exists survey_responses (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default now(),

    -- Section A: About you
    study_level text,
    shuttle_frequency text,

    -- Section B: Current experience
    wait_time text,
    arrival_awareness text,
    late_for_lecture text,
    full_bus_experience text,
    change_problem text,
    satisfaction_score integer,
    biggest_problem text,

    -- Section C: Technology
    has_nfc text,
    live_tracking_usefulness text,
    tap_to_board_interest text,
    desired_features text[],
    app_comfort text,
    additional_comments text
);

-- ---------------------------------------------------------------------------
-- Row Level Security — anonymous inserts only, no client-side reads.
-- You read the collected data from the Supabase dashboard / Table Editor.
-- ---------------------------------------------------------------------------

alter table waitlist enable row level security;
alter table survey_responses enable row level security;

drop policy if exists "Allow anonymous inserts" on waitlist;
create policy "Allow anonymous inserts" on waitlist
    for insert with check (true);

drop policy if exists "Allow anonymous inserts" on survey_responses;
create policy "Allow anonymous inserts" on survey_responses
    for insert with check (true);
