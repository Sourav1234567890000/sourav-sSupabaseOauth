# My Bookmarks App

A simple bookmark manager built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.

Users can:

- Sign up / login using **Google OAuth** (no email/password required)
- Add bookmarks (title + URL)
- See their bookmarks in **real-time**
- Delete their own bookmarks (RLS safe)
- Bookmarks are private to each user

---

## Tech Stack

- [Next.js 13+ App Router](https://nextjs.org/docs/app)
- [Supabase](https://supabase.com) (Auth, Database, Realtime)
- [Tailwind CSS](https://tailwindcss.com)

---

## Setup (Local)

1. Clone the repo:

```bash
git clone <YOUR_REPO_URL>
cd <PROJECT_FOLDER>

2. Install dependencies:

npm install

3. Setup environment variables:

NEXT_PUBLIC_SUPABASE_URL=https://<YOUR_SUPABASE_PROJECT>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>

4. Start development server:
npm run dev

5.Supabase Setup

Create table bookmarksTable:

Column	Type
id	UUID (Primary Key, default: gen_random_uuid())
user_id	UUID
title	Text
url	Text
created_at	Timestamp (default: now())

5.1 Enable Row Level Security (RLS):

create policy "Users can manage their own bookmarks" 
on public.bookmarksTable 
for all
using (auth.uid() = user_id);

