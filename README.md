# ZAM TALENT TOP

Zam Talent Top is a Zambian talent discovery and professional showcase platform.

### Run locally

1. Install dependencies:
   npm install
2. Start the frontend:
   npm run dev
3. Open the local Vite URL shown in the terminal.

## Project structure

- `client/` — React + Vite Supabase frontend

## Current scope

The frontend is a Supabase web application. Supabase Auth handles identity and the
Supabase database handles profiles, bookings, and marketplace products. Configure
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `client/.env`.

Run `supabase/schema.sql` in the Supabase SQL editor before using authentication,
profiles, or bookings. The script creates `public.profiles` and `public.bookings`
with the policies required by the client dashboard and public directory. It also
creates the public `avatars` Storage bucket; keep the bucket policies from the
script so users can only upload inside their own user folder.

The public tables used by the client are `profiles`, `bookings`, and
`marketplace_products`. Enable Row Level Security and define policies before
deploying. The browser must only receive the publishable key; never expose a
Supabase secret/service-role key in `client/.env`.
