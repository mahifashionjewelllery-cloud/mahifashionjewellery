-- ⚠️ UPDATED SCRIPT: Ensure "Ratheesh R" is Admin (ID: c12f0626...)
-- I removed the "email" column from the check because it exists in auth.users, not public.profiles.

-- 1. Insert Profile if it doesn't exist
INSERT INTO public.profiles (id, full_name, role)
VALUES (
    'c12f0626-25c5-4ad9-a473-8599840d13c0', 
    'Ratheesh R', 
    'admin'
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', full_name = EXCLUDED.full_name;

-- 2. Verify the result (Only selecting columns that exist in profiles)
SELECT id, full_name, role
FROM public.profiles 
WHERE id = 'c12f0626-25c5-4ad9-a473-8599840d13c0';
