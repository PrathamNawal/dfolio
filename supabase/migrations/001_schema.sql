create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  slug        text unique,
  name        text,
  tagline     text,
  avatar_emoji text default '🏋️',
  role        text,
  goal        text,
  experience  text,
  skills      text[] default '{}',
  is_public   boolean default false,
  dark_mode   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table projects (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles(id) on delete cascade,
  title       text not null,
  description text,
  cover_url   text,
  tags        text[] default '{}',
  position    int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table career_entries (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles(id) on delete cascade,
  role        text not null,
  company     text not null,
  date_range  text,
  description text,
  emoji       text default '🪜',
  position    int default 0,
  created_at  timestamptz default now()
);

create table contact_links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references profiles(id) on delete cascade,
  type        text,
  label       text,
  url         text,
  position    int default 0
);
