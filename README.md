# Geneseon Academy

Geneseon Academy is an education platform for SSC, HSC, and job-preparation students. The application uses Next.js with Supabase PostgreSQL and Storage.

## Run locally

Use Node.js 20.9 or newer. Configure the server-side Supabase values in `.env.local` before using API features:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET=academy-files
PUBLIC_APP_URL=http://localhost:3000
```

Never commit `.env.local` or expose the service-role key in browser code. `SUPABASE_ANON_KEY` is the public anon/publishable key used for signed browser uploads; never use the service-role key for it. Apply the SQL files in [`supabase/migrations/`](./supabase/migrations/) in numeric order to your Supabase project, then run:

```powershell
npm.cmd install
npm.cmd run dev
npm install
npm run dev
```
Open `http://localhost:3000`. The production commands are `npm run build` and `npm start`.

## Data migration and deployment

See [`MIGRATION_SUPABASE.md`](./MIGRATION_SUPABASE.md) for importing existing SQLite data and uploads, configuring server-side variables, and deploying to Render. Python is not required to run or deploy the Next.js application; the optional `scripts/import-sqlite.py` utility is only for a one-time legacy data import.
