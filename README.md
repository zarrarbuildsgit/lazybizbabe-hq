# LazyBizBabe HQ ✦

> Your personal creator command centre. Built with love.

## Stack

- **Next.js 14** (App Router + TypeScript)
- **Supabase** (database + storage)
- **OpenRouter** (free AI models — Llama 3.3 70B)
- **Threads Graph API** (live follower + post data)
- **Vercel** (one-click deploy)
- **Recharts** (growth charts)

---

## Setup — Step by Step

### 1. Clone + install

```bash
git clone https://github.com/YOUR_USERNAME/lazybizbabe-hq
cd lazybizbabe-hq
npm install
```

### 2. Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Once created, go to **SQL Editor** → **New Query**
3. Copy the entire contents of `supabase-schema.sql` and run it
4. Go to **Project Settings** → **API**
5. Copy your **Project URL** and **anon/public key**

### 3. OpenRouter (free AI)

1. Go to [openrouter.ai](https://openrouter.ai) → Sign up
2. Go to **Keys** → Create new key
3. Copy the key — it gives you access to free models

### 4. Threads API (do this when ready)

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app → Add **Threads** product
3. Follow the Threads API setup to get your access token
4. Set up a long-lived token (lasts 60 days, renewable)
5. Get your Threads User ID from the API

**Until you have these credentials, the app shows mock data automatically — no errors.**

### 5. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENROUTER_API_KEY=sk-or-v1-...
THREADS_ACCESS_TOKEN=your_token_here
THREADS_USER_ID=your_user_id_here
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all environment variables from step 5
4. Deploy ✦

---

## Pages

| Page | Route | What it does |
|------|-------|-------------|
| Dashboard | `/` | Daily focus, stats, mood, AI insight, streak |
| Growth | `/growth` | Live Threads data, follower chart, top posts |
| Bag Vault | `/money` | Log sales, dream goals, revenue tracking |
| Product Vault | `/products` | All products, testimonial bank |
| Content Kitchen | `/content` | AI post writer + improver, templates, idea bank |
| Chaos Organiser | `/brain` | Brain dump → Supabase, later list, AI sabotage check |
| Becoming Hub | `/life` | Daily habits, journal, milestones, countdowns |

---

## AI Features (OpenRouter — Free)

- **Daily insight** — reads your stats and gives one sharp observation
- **Post ideas** — generates 5 Threads post ideas for your niche
- **Post improver** — rewrites your draft to make the hook stronger
- **Sabotage response** — you pick your pattern, AI gives real talk + one action

Model: `meta-llama/llama-3.3-70b-instruct:free`

---

## Adding Features Later

- **Auth**: Add Supabase Auth if you want to share with a team or VA
- **Email**: Add Resend for sale confirmation emails to yourself
- **More products**: Add directly in Supabase → products table
- **Threads scheduling**: Threads API supports publishing posts

---

Built for Ope. 🤍 You made your first sale in 5 days on a Samsung A12. This is version 1 of your HQ. It only goes up.
