-- ⚠️ UPDATED SCRIPT: Use the User ID directly
-- This avoids any email spelling issues.
-- ID taken from your screenshot: b51a9337-7e37-4fe7-b8bf-79d88dea7487

-- 1. Update the role for this specific user ID
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'b51a9337-7e37-4fe7-b8bf-79d88dea7487';

-- 2. Verify the change immediately
SELECT * FROM public.profiles WHERE id = 'b51a9337-7e37-4fe7-b8bf-79d88dea7487';
