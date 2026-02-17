# Supabase Setup Guide

This guide walks you through setting up a fresh Supabase project for the Jewelry E-commerce application with **password-based authentication** (no OTP).

## Prerequisites

- A Supabase account (https://supabase.com)
- Node.js and npm installed locally

## Step 1: Create a New Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: Choose a name (e.g., "jewelry-ecommerce")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to finish setting up (~2 minutes)

## Step 2: Configure Authentication Settings

### Disable Email Confirmation (for Password-based Auth)

1. Go to **Authentication** → **Providers** → **Email**
2. **Disable** "Confirm email"
3. Click **Save**

### Enable Phone Authentication (Optional)

If you want to allow users to login with Phone + Password:

1. Go to **Authentication** → **Providers** → **Phone**
2. **Enable** Phone provider
3. Choose an SMS provider (Twilio, MessageBird, etc.) or use Supabase's test provider for development
4. **Disable** "Confirm phone" (since we're using the API to auto-confirm)
5. Click **Save**

## Step 3: Run the Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy the entire contents of `schema.sql` from your project
4. Paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl+Enter`

This will create:
- `profiles` table
- `metal_rates` table
- `products` table
- `product_images` table
- `orders` table
- `order_items` table
- `site_settings` table
- All necessary RLS policies
- Trigger to auto-create profiles on user signup

## Step 4: (Optional) Insert Initial Metal Rates

1. In the SQL Editor, create a **new query**
2. Copy the contents of `insert_metal_rates.sql`
3. Paste and run it

This will populate the `metal_rates` table with initial gold and silver rates.

## Step 5: Create Storage Bucket for Product Images

1. Go to **Storage** in your Supabase dashboard
2. Click **"Create a new bucket"**
3. Configure the bucket:
   - **Name**: `products`
   - **Public bucket**: ✅ Enabled
4. Click **"Create bucket"**

### Set Storage Policies

After creating the bucket, set up policies:

1. Click on the `products` bucket
2. Go to **Policies**
3. Click **"New policy"**
4. Create the following policies:

**Policy 1: Public Read Access**
```sql
-- Allow anyone to view product images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');
```

**Policy 2: Admin Upload Access**
```sql
-- Allow authenticated users to upload (ideally restrict to admins via custom logic)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');
```

**Policy 3: Admin Delete Access**
```sql
-- Allow authenticated users to delete (ideally restrict to admins)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
```

## Step 6: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (⚠️ Keep this secret!)

## Step 7: Update Your `.env.local` File

Create or update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Important**: Never commit `.env.local` to version control! It's already in `.gitignore`.

## Step 8: Create Your First Admin User

Since we're using auto-confirmed registration, you need to manually set the first admin:

### Option A: Register via the App, then Promote

1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/register
3. Register a new account with your email
4. Go to your Supabase dashboard → **Authentication** → **Users**
5. Find your user and copy the **User ID**
6. Go to **SQL Editor** and run:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'your-user-id-here';
```

### Option B: Create Admin User Directly via SQL

Run this in the SQL Editor (replace with your details):

```sql
-- This will be done via your registration API, but for the first admin:
-- 1. Register via the app
-- 2. Then update the role as shown in Option A
```

## Step 9: Verify Everything Works

1. **Test Registration**:
   - Go to `/register`
   - Create a new account
   - Verify you're auto-logged in (no OTP required)

2. **Test Login**:
   - Logout
   - Go to `/login`
   - Login with Email/Phone + Password
   - Verify successful login

3. **Test Admin Access**:
   - Login with your admin account
   - Go to `/admin`
   - Verify you can access admin features

## Troubleshooting

### "Invalid JWT" or Authentication Errors

- Make sure your `.env.local` keys match your Supabase project
- Restart your development server after updating `.env.local`

### "User already registered" Error

- Check **Authentication** → **Providers** to ensure email confirmation is disabled
- Verify the service role key is correct in `.env.local`

### RLS Policy Errors

- Ensure all SQL from `schema.sql` ran successfully
- Check **Database** → **Policies** to verify policies were created

### Storage Upload Fails

- Verify the `products` bucket is set to **Public**
- Check that storage policies were created correctly

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the environment variables to your hosting platform
2. Update `NEXT_PUBLIC_SITE_URL` to your production URL
3. Consider:
   - Enabling email confirmation for production
   - Restricting phone auth to specific countries
   - Adding rate limiting
   - Implementing proper admin access controls

## Next Steps

- Populate products via the admin panel
- Upload product images
- Configure metal rates
- Test the complete checkout flow
- Set up domain and SSL (if deploying)
