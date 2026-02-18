# Troubleshooting Missing Password Reset Emails

If you are not receiving the password reset email, please check the following common issues:

## 1. Check Spam/Junk Folder
Supabase's default email service often gets flagged as spam. Please check your **Spam** or **Junk** folder.

## 2. Rate Limiting (Supabase Free Tier)
Supabase's free tier allows only **3 emails per hour**. If you tested multiple times, you might have hit this limit. Wait an hour or set up your own SMTP server (Settings > Authentication > SMTP).

## 3. Verify User Existence
For security reasons, Supabase will report "success" even if the email is not registered (to prevent user enumeration).
-   Go to **Authentication > Users** in your Supabase Dashboard.
-   Ensure the email you are testing with **actually exists** in the list.

## 4. Check Redirect URL Configuration
Go to your Supabase Dashboard:
1.  Navigate to **Authentication > URL Configuration**.
2.  Ensure your **Site URL** is correct (e.g., `http://localhost:3000`).
3.  Ensure your **Redirect URLs** include:
    -   `http://localhost:3000/**` (double asterisks mean "all paths")
    -   Or specifically `http://localhost:3000/auth/callback`

## 5. Check Email Logs (If available)
In Supabase Dashboard, check **Reports > Auth** or **mush** (if enabled) to see if emails are being sent or failing.
