-- Enable RLS on metal_rates
alter table public.metal_rates enable row level security;

-- Drop existing policies if any to avoid conflicts
drop policy if exists "Anyone can view metal rates" on public.metal_rates;
drop policy if exists "Only admins can insert metal rates" on public.metal_rates;
drop policy if exists "Only admins can update metal rates" on public.metal_rates;
drop policy if exists "Only admins can delete metal rates" on public.metal_rates;

-- Allow public read access (essential for shop/product pages)
create policy "Anyone can view metal rates"
  on public.metal_rates for select
  using (true);

-- Allow admins to insert/update/delete
create policy "Only admins can insert metal rates"
  on public.metal_rates for insert
  with check (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

create policy "Only admins can update metal rates"
  on public.metal_rates for update
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));

create policy "Only admins can delete metal rates"
  on public.metal_rates for delete
  using (auth.uid() in (
    select id from public.profiles where role = 'admin'
  ));
