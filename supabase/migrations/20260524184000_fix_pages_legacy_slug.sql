do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pages'
      and column_name = 'slug'
  ) then
    update public.pages
    set page_code = slug
    where page_code is null
      and slug is not null;

    alter table public.pages
      alter column slug drop not null;
  end if;
end $$;
