-- Backfill core.memberships from 3 legacy sources
-- Result: owners (is_admin=true from MC), members from team_members, grid_members, company_employees

-- 1. MC owners
insert into core.memberships (account_id, user_id, role, status, invited_at, joined_at)
select p.id, p.id, 'owner', 'active', p.created_at, p.created_at
from public.user_profiles p
where p.is_admin = true
  and exists (select 1 from auth.users u where u.id = p.id)
on conflict do nothing;

-- 2. MC team members
insert into core.memberships (account_id, user_id, role, status, invited_at, joined_at)
select
  tm.admin_id,
  tm.user_id,
  'member',
  case when tm.accepted_at is not null then 'active' else 'invited' end,
  coalesce(tm.invited_at, tm.created_at),
  tm.accepted_at
from public.team_members tm
where exists (select 1 from auth.users u where u.id = tm.admin_id)
  and (tm.user_id is null or exists (select 1 from auth.users u where u.id = tm.user_id))
on conflict do nothing;

-- 3. Ops Grid members
insert into core.memberships (account_id, user_id, role, status, invited_at, joined_at)
select distinct
  g.user_id as account_id,
  gm.user_id,
  'member',
  'active',
  coalesce(gm.invited_at, now()),
  gm.invited_at
from operations.grid_members gm
join operations.grids g on g.id = gm.grid_id
where gm.user_id != g.user_id
  and exists (select 1 from auth.users u where u.id = g.user_id)
  and exists (select 1 from auth.users u where u.id = gm.user_id)
on conflict do nothing;

-- 4. Strategic members
insert into core.memberships (account_id, user_id, role, status, invited_at, joined_at)
select
  c.owner_id as account_id,
  ce.user_id,
  'member',
  case when ce.status = 'active' then 'active' else 'deactivated' end,
  ce.invited_at,
  ce.activated_at
from strategic.company_employees ce
join strategic.companies c on c.id = ce.company_id
where exists (select 1 from auth.users u where u.id = c.owner_id)
  and exists (select 1 from auth.users u where u.id = ce.user_id)
on conflict do nothing;
