-- ⚠️ DANGER: This script will delete ALL users and their related data.
-- This updated version UNLINKS storage objects instead of deleting them to bypass Supabase protection.
-- Run this in the Supabase SQL Editor.

BEGIN;

-- 1. Delete all orders first (References auth.users)
DELETE FROM public.orders;

-- 2. Delete all profiles (References auth.users)
DELETE FROM public.profiles;

-- 3. Unlink storage objects owned by users (Set owner to NULL)
-- Supabase prevents deleting storage objects directly via SQL to avoid data loss.
-- Unlinking them removes the foreign key constraint, allowing us to delete the user.
-- The files will remain in storage as "orphaned" files.
UPDATE storage.objects SET owner = NULL WHERE owner IS NOT NULL;

-- 4. Delete all users from auth.users
DELETE FROM auth.users;
-- 🛑 IF YOU WANT TO KEEP YOUR ADMIN USER, UNCOMMENT THE LINE BELOW AND ENTER YOUR EMAIL:
-- WHERE email NOT IN ('mahifashionjewelllery@gmail.com'); 

COMMIT;
