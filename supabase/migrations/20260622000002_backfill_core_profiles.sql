-- Backfill core.profiles from public.user_profiles
-- Skips rows where auth.users no longer exists (deleted accounts)
insert into core.profiles (id, full_name, email, avatar_url, language, company_name, currency, created_at, updated_at)
select
  p.id,
  p.full_name,
  p.email,
  p.profile_photo_url,
  p.language,
  p.company_name,
  p.currency,
  p.created_at,
  p.updated_at
from public.user_profiles p
where exists (
  select 1 from auth.users u where u.id = p.id
)
on conflict (id) do nothing;
