# Mahi Fashion Jewellery Setup Instructions

## 1. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

You need keys for:
- **Supabase**: URL and Anon Key (Project Settings > API)

## 2. Supabase Database Setup

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project.
3. Go to the **SQL Editor** in the sidebar.
4. Copy the contents of `schema.sql` (located in the project root) and paste it into the SQL Editor.
5. Click **Run** to create all tables, policies, and triggers.

## 3. Storage Setup

1. Go to **Storage** in the Supabase Dashboard.
2. Create a new public bucket named `products`.
3. Update the storage policy if needed (included in schema notes, but ensure public read access is enabled).

## 4. Run the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 5. Admin Access

To become an admin:
1. Sign up as a new user on the website `Register` page.
2. Go to Supabase Table Editor > `profiles` table.
3. Find your user row and change the `role` column from `user` to `admin`.
4. Refresh the website to access the Admin Panel at `/admin`.

## 6. Adding Products with Images

The admin panel supports uploading multiple product images:

1. Navigate to `/admin/products/new` (Admin Panel > Products > Add New Product).
2. Fill in the product details (name, description, metal type, purity, weight, etc.).
3. **Upload Images**:
   - Click the "Choose Files" button in the Product Images section.
   - Select one or multiple images from your computer.
   - Preview thumbnails will appear showing your selected images.
   - You can remove any image by hovering over it and clicking the X button.
4. Click "Create Product" to save.
5. Images are automatically uploaded to the Supabase `products` storage bucket and linked to the product.

**Note**: Make sure the `products` storage bucket is created in Supabase (see Step 3) before uploading images.

