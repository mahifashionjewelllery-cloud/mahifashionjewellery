-- Fix Storage Policies for Products Bucket
-- Access to public.profiles might be restricted or tricky in storage policies.
-- Using security definer function is safer.

-- Drop potential existing policies to avoid conflicts
drop policy if exists "Admin Upload" on storage.objects;
drop policy if exists "Admin Delete" on storage.objects;
drop policy if exists "Admin Insert" on storage.objects;
drop policy if exists "Admin Update" on storage.objects;

-- Create comprehensive policies for Admin
create policy "Admin Insert" on storage.objects
  for insert with check (
    bucket_id = 'products' AND
    public.is_admin()
  );

create policy "Admin Update" on storage.objects
  for update using (
    bucket_id = 'products' AND
    public.is_admin()
  );

create policy "Admin Delete" on storage.objects
  for delete using (
    bucket_id = 'products' AND
    public.is_admin()
  );

-- Ensure public access is still there (though usually not affected by Admin policies)
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects 
  for select using (bucket_id = 'products');
