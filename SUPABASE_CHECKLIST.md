# Quick Supabase Setup Checklist

Use this checklist when setting up a new Supabase instance.

## ✅ Pre-Setup

- [ ] Create new Supabase project
- [ ] Note down Database Password
- [ ] Wait for project provisioning to complete

## ✅ Authentication Configuration

- [ ] Go to **Authentication** → **Providers** → **Email**
- [ ] **Disable** "Confirm email" 
- [ ] Save changes
- [ ] (Optional) Enable Phone provider with "Confirm phone" **disabled**

## ✅ Database Schema

- [ ] Go to **SQL Editor**
- [ ] Run `schema.sql` (entire file)
- [ ] Verify: Check **Database** → **Tables** for 7 tables
- [ ] (Optional) Run `insert_metal_rates.sql` for initial data

## ✅ Storage Setup

- [ ] Go to **Storage**
- [ ] Create bucket: `products` (Public: ✅)
- [ ] Add storage policies (see below)

### Storage Policies

Run these in SQL Editor:

```sql
-- Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Authenticated delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
```

## ✅ Environment Variables

- [ ] Go to **Settings** → **API**
- [ ] Copy Project URL
- [ ] Copy `anon` public key
- [ ] Copy `service_role` key (⚠️ Secret!)
- [ ] Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # ⚠️ Do NOT commit!
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## ✅ Create First Admin

### Step 1: Register via App
```bash
npm run dev
# Go to http://localhost:3000/register
# Register with your email
```

### Step 2: Promote to Admin
1. Go to Supabase **Authentication** → **Users**
2. Copy your User ID
3. Run in **SQL Editor**:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'paste-your-user-id-here';
```

## ✅ Verification

- [ ] Test registration (no OTP should be asked)
- [ ] Test login with email + password
- [ ] Test login with phone + password
- [ ] Login as admin
- [ ] Access `/admin` dashboard
- [ ] Upload a test product image

## 🔧 Troubleshooting

**Authentication errors?**
```bash
# Restart dev server after updating .env.local
npm run dev
```

**RLS policy errors?**
- Verify all tables have policies in **Database** → **Policies**

**Storage upload fails?**
- Check bucket is **Public**
- Verify storage policies exist

## 📋 Tables Created

1. ✅ `profiles` - User profiles and roles
2. ✅ `metal_rates` - Gold/Silver current rates
3. ✅ `products` - Product catalog
4. ✅ `product_images` - Product image URLs
5. ✅ `orders` - Customer orders
6. ✅ `order_items` - Order line items
7. ✅ `site_settings` - Site configuration (gallery, etc.)

## 🎯 Ready to Go!

Your Supabase backend is now configured for:
- ✅ Email + Password authentication
- ✅ Phone + Password authentication  
- ✅ No OTP verification required
- ✅ Auto-confirmed user registration
- ✅ Admin role management
- ✅ Product catalog with images
- ✅ Order processing
