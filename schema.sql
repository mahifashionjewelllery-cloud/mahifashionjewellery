-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Function to check if user is admin (security definer to avoid recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.phone, 
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- METAL RATES TABLE
create table public.metal_rates (
  id uuid default uuid_generate_v4() primary key,
  metal_type text not null unique check (metal_type in ('gold', 'silver')),
  rate_per_gram numeric not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for metal_rates
alter table public.metal_rates enable row level security;

-- Metal Rates Policies
create policy "Metal rates are viewable by everyone" on public.metal_rates
  for select using (true);

create policy "Admins can insert/update metal rates" on public.metal_rates
  for all using (is_admin());


-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  metal_type text not null check (metal_type in ('gold', 'silver', 'diamond')),
  purity text not null, -- e.g., '22K', '24K', '18K'
  weight numeric not null, -- in grams
  making_charge_type text not null check (making_charge_type in ('percentage', 'fixed')),
  making_charge_value numeric not null,
  stock integer not null default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table public.products enable row level security;

-- Products Policies
create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Admins can manage products" on public.products
  for all using (is_admin());


-- PRODUCT IMAGES TABLE
create table public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for product_images
alter table public.product_images enable row level security;

-- Product Images Policies
create policy "Product images are viewable by everyone" on public.product_images
  for select using (true);

create policy "Admins can manage product images" on public.product_images
  for all using (is_admin());


-- ORDERS TABLE
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  total_amount numeric not null,
  payment_status text not null default 'cod', -- cod, paid
  payment_method text default 'cod', -- cod, online
  order_status text not null default 'processing', -- processing, shipped, delivered, cancelled
  shipping_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for orders
alter table public.orders enable row level security;

-- Orders Policies
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Admins can view all orders" on public.orders
  for select using (is_admin());

create policy "Admins can update orders" on public.orders
  for update using (is_admin());
  
-- Allow users to insert order (typically via backend or verified process, but for now enabling insert for authenticated users for the flow, 
-- ideally strict control or via RPC/Edge function preferred for security)
create policy "Users can create orders" on public.orders
  for insert with check (auth.uid() = user_id); 


-- ORDER ITEMS TABLE
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null default 1,
  price_at_purchase numeric not null, -- Price per unit at the time of purchase
  metal_rate_at_purchase numeric -- Store the metal rate snapshot if needed
);

-- Enable RLS for order_items
alter table public.order_items enable row level security;

-- Order Items Policies
create policy "Users can view their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items" on public.order_items
  for select using (is_admin());
  
create policy "Users can insert order items" on public.order_items
   for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
   );

-- STORAGE BUCKET setup (SQL representation, manually create in dashboard)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
-- Policy for storage objects would be needed too.

-- SITE SETTINGS TABLE (for gallery images and other site configuration)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for site_settings
alter table public.site_settings enable row level security;

-- Site Settings Policies
create policy "Anyone can view site settings" on public.site_settings
  for select using (true);

create policy "Only admins can update site settings" on public.site_settings
  for all using (is_admin());
