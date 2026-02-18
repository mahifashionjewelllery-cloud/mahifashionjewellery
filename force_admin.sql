-- Run this script to FORCE the admin role update.
-- This uses a case-insensitive search for the email.

-- 1. Update the profile role
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.email ILIKE 'mahifashionjewelllery@gmail.com'; -- Ensure this email matches yours!

-- 2. Verify the result immediately
SELECT au.email, p.role as new_role
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email ILIKE 'mahifashionjewelllery@gmail.com';
