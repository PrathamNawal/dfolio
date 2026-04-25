alter table profiles        enable row level security;
alter table projects        enable row level security;
alter table career_entries  enable row level security;
alter table contact_links   enable row level security;

create policy "owner_all" on profiles for all using (auth.uid() = id);
create policy "public_read" on profiles for select using (is_public = true);

create policy "owner_all" on projects for all using (auth.uid() = profile_id);
create policy "public_read" on projects for select using (
  exists (select 1 from profiles where id = profile_id and is_public = true)
);

create policy "owner_all" on career_entries for all using (auth.uid() = profile_id);
create policy "public_read" on career_entries for select using (
  exists (select 1 from profiles where id = profile_id and is_public = true)
);

create policy "owner_all" on contact_links for all using (auth.uid() = profile_id);
create policy "public_read" on contact_links for select using (
  exists (select 1 from profiles where id = profile_id and is_public = true)
);
