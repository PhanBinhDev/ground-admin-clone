-- =============================================================================
-- core schema — OS49 Ground Control
-- Central layer for identity, membership, events, scoring, and access control.
-- =============================================================================

create schema if not exists core;

-- ---------------------------------------------------------------------------
-- core.profiles
-- Central identity table. Replaces per-app profile tables over time.
-- Keyed on auth.users.id — 1:1 with auth.users.
-- ---------------------------------------------------------------------------
create table core.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  email         text not null,
  avatar_url    text,
  language      text,
  company_name  text,
  currency      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- core.memberships
-- Central membership table. Maps employees to their owning account (owner).
-- account_id = auth.users.id of the owner/admin.
-- user_id    = auth.users.id of the member (null until invitation accepted).
-- ---------------------------------------------------------------------------
create table core.memberships (
  id          uuid primary key default gen_random_uuid(),
  account_id  uuid not null references auth.users(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  role        text not null check (role in ('owner', 'member')),
  status      text not null check (status in ('invited', 'active', 'deactivated')),
  invited_at  timestamptz not null default now(),
  joined_at   timestamptz
);

create index on core.memberships (account_id);
create index on core.memberships (user_id) where user_id is not null;

-- ---------------------------------------------------------------------------
-- core.events
-- Append-only central event log. All apps write here.
-- Never UPDATE or DELETE rows — enables score recomputation at any point.
-- ---------------------------------------------------------------------------
create table core.events (
  id           bigint generated always as identity primary key,
  account_id   uuid not null references auth.users(id),
  user_id      uuid references auth.users(id),
  app          text not null check (app in ('mission_control', 'ops_grid', 'strategic_base')),
  event_type   text not null,
  occurred_at  timestamptz not null default now(),
  payload      jsonb not null default '{}'
);

create index on core.events (account_id, occurred_at desc);
create index on core.events (account_id, app, event_type);

-- ---------------------------------------------------------------------------
-- core.os49_roles
-- Access control for Ground Control and other internal tools.
-- One row per (user, role) pair — a user can hold multiple roles.
-- ---------------------------------------------------------------------------
create table core.os49_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null,
  granted_by  uuid references auth.users(id),
  granted_at  timestamptz not null default now(),
  unique (user_id, role)
);

create index on core.os49_roles (user_id);

-- ---------------------------------------------------------------------------
-- core.score_config
-- Versioned scoring weights and gate thresholds.
-- Only one row may be active at a time (enforced by partial unique index).
-- ---------------------------------------------------------------------------
create table core.score_config (
  id          uuid primary key default gen_random_uuid(),
  version     integer not null,
  weights     jsonb not null default '{
    "ritme": 0.30,
    "verankering": 0.30,
    "adoptie": 0.20,
    "resultaat": 0.20
  }',
  gate        jsonb not null default '[
    {"days": 3,   "multiplier": 1.0},
    {"days": 7,   "multiplier": 0.9},
    {"days": 14,  "multiplier": 0.75},
    {"days": 30,  "multiplier": 0.55},
    {"days": null,"multiplier": 0.4}
  ]',
  is_active   boolean not null default false,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

-- Only one active config at a time
create unique index on core.score_config (is_active) where is_active = true;

-- Seed the initial config
insert into core.score_config (version, is_active)
values (1, true);

-- ---------------------------------------------------------------------------
-- core.vitals_snapshots
-- Per-account score history. Written on each new event via trigger → Edge Function.
-- Supabase Realtime pushes new rows to the Ground Control UI.
-- ---------------------------------------------------------------------------
create table core.vitals_snapshots (
  id              uuid primary key default gen_random_uuid(),
  account_id      uuid not null references auth.users(id),
  score_config_id uuid not null references core.score_config(id),
  vitals          integer not null check (vitals between 0 and 100),
  ritme           integer not null check (ritme between 0 and 100),
  verankering     integer not null check (verankering between 0 and 100),
  adoptie         integer not null check (adoptie between 0 and 100),
  resultaat       integer not null check (resultaat between 0 and 100),
  gate_multiplier numeric(3,2) not null,
  band            text not null check (band in ('green', 'amber', 'red')),
  created_at      timestamptz not null default now()
);

create index on core.vitals_snapshots (account_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger for core.profiles
-- ---------------------------------------------------------------------------
create or replace function core.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on core.profiles
  for each row execute function core.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- All core tables are locked down. Only os49_admin may read cross-tenant data.
-- ---------------------------------------------------------------------------
alter table core.profiles          enable row level security;
alter table core.memberships       enable row level security;
alter table core.events            enable row level security;
alter table core.os49_roles        enable row level security;
alter table core.score_config      enable row level security;
alter table core.vitals_snapshots  enable row level security;

-- Helper: check if the calling user has a given os49 role
create or replace function core.has_role(p_role text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from core.os49_roles
    where user_id = auth.uid()
      and role = p_role
  );
$$;

-- os49_admin: full read access to all core tables
create policy "os49_admin can read profiles"
  on core.profiles for select
  using (core.has_role('os49_admin'));

create policy "os49_admin can read memberships"
  on core.memberships for select
  using (core.has_role('os49_admin'));

create policy "os49_admin can read events"
  on core.events for select
  using (core.has_role('os49_admin'));

create policy "os49_admin can read and manage roles"
  on core.os49_roles for all
  using (core.has_role('os49_admin'));

create policy "os49_admin can read score_config"
  on core.score_config for select
  using (core.has_role('os49_admin'));

create policy "os49_admin can read vitals_snapshots"
  on core.vitals_snapshots for select
  using (core.has_role('os49_admin'));
