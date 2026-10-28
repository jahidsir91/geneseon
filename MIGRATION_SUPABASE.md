# Next.js and Supabase migration

The Next.js server replaces the Python API while keeping the existing browser UI, `/api/...` routes, custom email/mobile login, and PBKDF2 password hashes. Supabase Auth is not used. The deployed application has no Python server or Python runtime dependency; the optional Python importer is only a one-time utility for copying existing SQLite data and uploads.

## 1. Create the Supabase database

1. Create a Supabase project and keep its database credentials private.
2. Open **SQL Editor** and run the SQL files in [`supabase/migrations/`](./supabase/migrations/) in numeric order. Existing projects that already ran `0001_initial_schema.sql` should also run `0002_notifications.sql`.
3. Copy the project URL and the **service role** key into the deployment environment. Never use the service role key in browser code or a `NEXT_PUBLIC_` variable. The tables have row-level security enabled; the Next.js server uses the service role key for authorized API operations.
4. The migration creates the private `academy-files` bucket. It supports large course videos; uploads go from the browser to signed Supabase Storage URLs instead of passing through a Next.js request body.

## 2. Copy the SQLite data and uploaded files

Back up the SQLite database and the complete uploads directory first. Stop the Python server before starting the import so that accounts, orders, exams, and files do not change mid-copy. The import is idempotent for rows and storage objects, and does not modify or delete the original files.

In PowerShell, provide the project URL, service-role key, and actual local database path. `JA_UPLOAD_DIRECTORY` is optional and defaults to an `uploads` folder next to the database:

```powershell
$env:SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"
$env:SUPABASE_STORAGE_BUCKET = "academy-files"
$env:JA_DATABASE_PATH = "C:\Users\YOUR_NAME\.jaacademy\ja_academy.sqlite3"
$env:JA_UPLOAD_DIRECTORY = "C:\Users\YOUR_NAME\.jaacademy\uploads"
py -3 scripts\import-sqlite.py
```

Use the **Project URL** shown in the Supabase project API settings (for example, `https://your-project-ref.supabase.co`). Do not use the Supabase dashboard URL or append `/rest/v1`; the importer adds the REST path itself. If you get `PGRST125` / “Invalid path specified,” correct `SUPABASE_URL` and rerun the command in the same PowerShell window.

The importer preserves user IDs, account roles, enrollment/profile data, password hashes, active sessions and reset tokens, content, payment orders, exam attempts, AI question solutions, settings, and private uploaded files. Run it again if it stops; resolve any reported missing files or conflicting unique values before retrying. Keep the source database and uploads as a rollback backup.

## 3. Configure the Next.js server

Use Node.js 20.9 or newer. Copy `.env.example` values to your hosting provider's **server-side** environment configuration. At minimum set:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (the public anon/publishable key used in signed Storage upload requests)
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET=academy-files`
- `PUBLIC_APP_URL` to the final HTTPS origin
- `GEMINI_API_KEY` and optionally `GEMINI_MODEL` (defaults to `gemini-3.8-flash`) for AI answers and PDF question extraction
- `RESEND_API_KEY` and `PASSWORD_RESET_FROM` for password-reset emails
- `BKASH_NUMBER` and optionally `PAYMENT_COUPONS_JSON` for manual bKash payment

`PAYMENT_COUPONS_JSON` must be a JSON object keyed by coupon code. For example:

```json
{"WELCOME10":{"discountPercent":10,"maxDiscount":500,"expiry":"2030-12-31"}}
```

You can instead keep payment configuration in the protected `site_settings` table using the `payment_config` key. Never commit `.env` files, API keys, or the service role key.

Install and check locally:

```powershell
npm install
npm run typecheck
npm run build
npm start
```

The build synchronizes the existing HTML/CSS/JS application into the ignored `public` output directory. Open the site at the Next.js origin; the static application continues to call the same-origin API routes.

## 4. Create an administrator if needed

An imported administrator account keeps the same login and password. If you need to bootstrap a new administrator, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, and an 11-digit Bangladesh `ADMIN_MOBILE` in the local PowerShell process, then run:

```powershell
npm run create-admin
```

This one-off command writes a compatible PBKDF2 password hash directly to Supabase. Do not configure these bootstrap values as permanent production environment variables after the account is created.

## 5. Deploy to Render

The repository includes [`render.yaml`](./render.yaml) for a Node Web Service. In Render, create a **Blueprint Instance** connected to the repository to use it, or create a **Web Service** manually with these settings:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Runtime: Node

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Render environment settings; the Blueprint prompts for these values without storing them in the repository. Set `PUBLIC_APP_URL` to the service's production HTTPS URL after Render creates it, then redeploy. Add the other server-side variables above if you use those features. No Python runtime or persistent local disk is needed for the Next.js application; PostgreSQL and files live in Supabase.

## Operational notes

- The browser-facing static app is preserved; the backend is in `app/api/[...path]/route.ts`.
- Authentication stays custom: 12-hour `HttpOnly`, `SameSite=Strict` sessions and the existing 310,000-round PBKDF2 format are retained.
- Student-specific resource access, admin-only mutation, private media URLs, course enrollment checks, and CQ answer-sheet ownership checks remain on the server.
- Large media uploads are signed and sent directly to Supabase Storage. Configure the Supabase project's allowed origins if browser CORS blocks uploads. Private video playback uses short-lived signed URLs after the server checks access.
- Question-bank PDF extraction uses the Gemini Files API for larger PDFs and inline PDF input for smaller ones. AI services require their server-side API key after deployment.
- Keep a copy of the SQLite database, uploads, and existing deployment until you have verified login, content, orders, exams/CQ grading, AI, email reset, and video/PDF access on the new host.
