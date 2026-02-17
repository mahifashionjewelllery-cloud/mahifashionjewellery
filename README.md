# 💎 Jewelry E-commerce Platform

A modern jewelry e-commerce platform built with Next.js 15, Supabase, and TypeScript. Features real-time metal rate updates, admin dashboard, and streamlined password-based authentication.

## ✨ Features

- 🔐 **Password-Based Authentication** - Email/Phone + Password (no OTP required)
- 📊 **Admin Dashboard** - Manage products, orders, and metal rates
- 💰 **Dynamic Pricing** - Real-time gold/silver rate updates
- 🛒 **Shopping Cart** - Persistent cart with Zustand
- 📦 **Order Management** - Track orders from creation to delivery
- 🖼️ **Image Management** - Product gallery with Supabase Storage
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd gem
npm install
```

### 2. Set Up Supabase

Follow the detailed guide in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** or use the quick **[SUPABASE_CHECKLIST.md](./SUPABASE_CHECKLIST.md)**.

**Quick version:**
1. Create a new Supabase project
2. Run `schema.sql` in SQL Editor
3. Run `insert_metal_rates.sql` (optional)
4. Create `products` storage bucket
5. Copy your API keys

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Admin User

1. Register via `/register`
2. Get your User ID from Supabase Dashboard → Authentication → Users
3. Run in Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-id';
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin dashboard
│   ├── api/          # API routes
│   ├── login/        # Login page
│   ├── register/     # Registration page
│   └── ...
├── components/       # React components
│   ├── home/         # Homepage components
│   ├── ui/           # Reusable UI components
│   └── ...
├── lib/              # Utilities and helpers
└── store/            # Zustand state management
```

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Language**: TypeScript
- **UI Components**: Radix UI

## 📚 Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase setup guide
- **[SUPABASE_CHECKLIST.md](./SUPABASE_CHECKLIST.md)** - Quick setup checklist
- **[schema.sql](./schema.sql)** - Database schema
- **[insert_metal_rates.sql](./insert_metal_rates.sql)** - Initial data

## 🔑 Key Features Explained

### Authentication
- Uses Supabase Auth with **auto-confirmed** registration
- Server-side API route (`/api/auth/register`) creates users without OTP
- Supports both Email and Phone as login identifiers

### Admin Panel
Access at `/admin` (requires admin role):
- Product management (CRUD)
- Order tracking and updates
- Metal rate configuration
- Gallery image management

### Real-time Pricing
Products use dynamic pricing based on:
- Current metal rates (gold/silver)
- Product weight
- Making charges (percentage or fixed)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🛠️ Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 📝 License

[Your License Here]

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

# mahifashionjewellery
