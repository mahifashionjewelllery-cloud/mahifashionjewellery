-- Create Contact Messages Table
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Policies

-- 1. Anyone can insert (submit a message)
create policy "Anyone can submit contact messages" on public.contact_messages
  for insert with check (true);

-- 2. Only Admins can view messages
create policy "Admins can view contact messages" on public.contact_messages
  for select using (public.is_admin());

-- 3. Only Admins can update status
create policy "Admins can update contact messages" on public.contact_messages
  for update using (public.is_admin());

-- Grant access to authenticated and anon users (standard Supabase setup)
grant insert on public.contact_messages to anon, authenticated;
grant select, update on public.contact_messages to authenticated; -- for admins
