-- Per-app granular roles for memberships
-- e.g. Ops Grid: cadet | specialist | officer
-- Backfill happens when each app ships their role feature

create table core.membership_roles (
  id             uuid primary key default gen_random_uuid(),
  membership_id  uuid not null references core.memberships(id) on delete cascade,
  app            text not null check (app in ('mission_control', 'ops_grid', 'strategic_base')),
  app_role       text not null,
  created_at     timestamptz not null default now(),
  unique (membership_id, app)
);

create index on core.membership_roles (membership_id);

alter table core.membership_roles enable row level security;

create policy "os49_admin can read membership_roles"
  on core.membership_roles for select
  using (core.has_role('os49_admin'));
