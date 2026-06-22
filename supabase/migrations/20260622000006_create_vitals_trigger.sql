-- Trigger: after each insert on core.events → call calculate-vitals Edge Function
-- Uses pg_net (built into Supabase) for async HTTP call — does not block the insert

create or replace function core.trigger_calculate_vitals()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/calculate-vitals',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := jsonb_build_object('account_id', NEW.account_id)
  );
  return NEW;
end;
$$;

create trigger on_core_event_inserted
  after insert on core.events
  for each row
  execute function core.trigger_calculate_vitals();
