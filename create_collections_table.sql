-- Create Collections Table
create table public.collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text not null,
  link text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.collections enable row level security;

-- Policies

-- 1. Public can view active collections
create policy "Public can view active collections" on public.collections
  for select using (is_active = true);

-- 2. Admins can do everything
create policy "Admins can manage collections" on public.collections
  for all using (public.is_admin());

-- Grant access
grant select on public.collections to anon, authenticated;
grant all on public.collections to authenticated; -- for admins
