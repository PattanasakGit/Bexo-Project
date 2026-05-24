alter table public.urls alter column scan_status set default 'unscanned';

update public.urls
set scan_status = case scan_status
  when 'unknown' then 'unscanned'
  when 'malicious' then 'danger'
  else scan_status
end
where scan_status in ('unknown', 'malicious');

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'urls'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) like '%scan_status%'
  loop
    execute format('alter table public.urls drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.urls
  add constraint urls_scan_status_check
  check (scan_status in ('unscanned', 'safe', 'warning', 'danger'));
