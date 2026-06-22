-- Backfill ops_grid membership_roles
-- All mapped to 'cadet' — granular roles (specialist/officer) to be backfilled
-- when Ops Grid ships that feature

insert into core.membership_roles (membership_id, app, app_role)
select
  m.id,
  'ops_grid',
  'cadet'
from operations.grid_members gm
join operations.grids g on g.id = gm.grid_id
join core.memberships m on m.account_id = g.user_id and m.user_id = gm.user_id
where gm.user_id != g.user_id
on conflict (membership_id, app) do nothing;
