-- Run this to see what users exist and their roles
SELECT 
    au.id, 
    au.email, 
    au.created_at,
    p.role as profile_role,
    p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id;

-- If you see the user in 'auth.users' but 'profile_role' is NULL, 
-- it means the profile was not created. 
-- You can fix it by running this (replace with your email):

/*
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, email, 'admin', 'Admin User'
FROM auth.users
WHERE email = 'mahifashionjewelllery@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
*/
