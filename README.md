# Geneseon Academy (জেনেসিওন একাডেমি) - Complete Education Platform for SSC, HSC & Job Preparation

A modern, responsive edtech demo for Bangladeshi students preparing for **SSC**, **HSC**, **BCS**, and **Government/Bank Job** examinations.

For the Next.js + Supabase PostgreSQL migration and deployment steps, see [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md).

## Current application backend

The application backend is Next.js, with Supabase PostgreSQL and Storage. Python is not needed to run or deploy the site. The SQLite/Python instructions below describe the legacy server and are retained only as a reference for the one-time data import.

```powershell
npm install
npm run dev
```

Configure the required Supabase environment variables before using API features. Follow [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md) for database setup, importing existing accounts/files, and deployment.

---

## 🚀 Live Demo & Quick Access

- **Server URL:** `http://localhost:8000`
- **Default Project Directory:** `C:\Users\user\.gemini\antigravity-ide\scratch\medha-edtech`

### Authentication setup

Accounts are stored in a SQLite database outside the public website directory. Passwords are hashed on the server; browser sessions use an `HttpOnly`, `SameSite=Strict` cookie. Public registration creates student accounts only.

Login throttling is scoped to an IP address and normalized email/mobile identifier, so failed attempts for one account do not block other users sharing the same network. Ten failed attempts in a rolling 15-minute window temporarily throttle that account from that IP; the throttle clears as earlier attempts age out.

### Resend password recovery setup

1. In Resend, add a domain or transactional subdomain that you own. Publish the DNS records Resend provides (including its sender-authentication records) at your DNS host, then wait for Resend to mark the domain verified. Resend requires a verified domain before sending.
2. Create a Resend API key restricted to the verified sending domain. Keep it secret; do not paste it into source files, README, browser code, or chat.
3. In the same PowerShell window used to run the server, set the following values, replacing the examples with your own:

```powershell
$env:RESEND_API_KEY = "re_your_secret_key"
$env:JA_EMAIL_FROM = "Geneseon Academy <no-reply@mail.yourdomain.com>"
$env:JA_PUBLIC_BASE_URL = "https://yourdomain.com"
py -3.13 server.py
```

For local-only testing, use `$env:JA_PUBLIC_BASE_URL = "http://localhost:8000"`; reset links sent to real users must use the public HTTPS site URL. These environment variables apply only to that PowerShell window and its server process. Restart the server after changing them. The forgot-password form sends a 30-minute, single-use link; requests do not reveal whether an email belongs to an account. Until Resend is configured, students can ask an admin to reset their password from User Management.

```powershell
# Install Python PDF processing dependencies
py -3.13 -m pip install -r requirements.txt

# Start the local server
py -3.13 server.py

# In a separate terminal, create an administrator (password input is hidden; minimum 6 characters)
py -3.13 server.py --create-admin
```

Open `http://localhost:8000`. Create student accounts using **Sign up**; administrators use the account created with `--create-admin`. The old seeded browser-only demo profiles are no longer valid login accounts.

### Manual bKash course and PDF payments

Set the receiving bKash number and course coupon codes in [payment_config.json](./payment_config.json). Put your 11-digit bKash receiving number in `bkash_number`; edit the `coupons` entries to change codes, percentage/fixed discounts, optional caps, or expiry dates (`YYYY-MM-DD`). Percentage and fixed discounts cannot be set together for one coupon. Save the JSON and restart the server after editing. Students can buy a course or digital PDF by bKash Send Money, then submit their sender number and TrxID. The app never asks for a bKash PIN or OTP. Requests appear separately in **Admin Portal → Order Requests**; confirm the TrxID and amount in the bKash account before selecting **Confirm**. Course lessons and uploaded course media remain locked until approval. Confirmation adds the course to My Courses or unlocks the PDF in the store; pending or rejected orders grant no access. Free-coupon orders also wait for admin approval. Students already signed in should refresh the page or sign in again after approval to see their new access. Nagad and card payments are not enabled.

Scheduled model tests show a live countdown before their start time, show **LIVE** only while available, and show **সময় শেষ** after the end time. During a test, all questions appear in order on one page, so students can scroll through and answer them without opening questions one at a time. An MCQ choice cannot be changed after it is selected. The app warns after a student switches away from the exam more than twice, blocks in-app navigation until submission, and asks for confirmation before leaving or reloading. Browser context menus and common print/screenshot keyboard shortcuts are restricted where the browser permits; a website cannot prevent operating-system screenshots or guarantee that a student will not leave the browser.

Student accounts stay assigned to the SSC, HSC, or JOB category selected at sign-up. The course catalog, course details, model tests, question bank, practice-test generator, and store listings are filtered to that category; students cannot change it from their profile. The profile-picture menu contains only **Logout**.

### Admin content management

Sign in using the admin email/mobile and password created with `--create-admin`, then open **Admin Portal**. Under **User Management**, an existing admin can switch only their own account into student mode, choosing its category and batch/target. They can later return to admin mode from their student **Profile** after confirming the same account password. Ordinary student accounts cannot be promoted to admin. Switching modes revokes the account's other active sessions. Admins can reset student passwords from **User Management**; resetting revokes the student's active sessions, and the student can log in with the new password. Under **Course Management**, create a course or select **সম্পাদনা** on an existing course. Add one or more Chapters, then add Lectures inside each Chapter; each Lecture can have an MP4/WebM/MOV video up to 5 GB, a lecture PDF up to 100 MB, written notes, and an optional Notes PDF up to 100 MB. Video uploads are streamed to disk to avoid loading the entire file into server memory. Existing files stay attached unless replaced, and saved chapter resources appear in that lecture's student learning view. Under **Store Products**, edit an existing product or add a new digital PDF or physical product, including its price, file URL, and student categories. Under **Order Requests**, verify submitted bKash TrxIDs and confirm or reject payment before providing access. Under **Question Bank Management**, a question can optionally include a PNG/JPG/WebP image up to 5 MB: an MCQ image appears below its question, while a CQ image appears with its stimulus. These images are private uploads visible to admins and students in the matching category. Admins can also schedule model tests with a duration and start/end time, select MCQ and CQ questions, review student accounts and their last successful login, and upload PDFs to extract MCQs. A model test containing CQ questions requires students to upload one PDF answer sheet (up to 20 MB); admins can review it in **CQ উত্তরপত্র** and assign the CQ score and feedback. Set the CQ mark allocation when creating the test; the remaining marks are distributed evenly across its MCQs. PDF-extracted questions remain unpublished until an admin checks the question, all four options, and the correct answer, then publishes them.

Uploaded files are stored under the private `~/.jaacademy/uploads` folder, outside the website directory. Course video playback requires an active session, matching student category, and admin-approved course enrollment. Course videos are limited to 5 GB; PDFs and notes are limited to 100 MB (CQ answer sheets remain limited to 20 MB). Ensure the server disk has enough free space for the upload and stored copy. Configure Gemini OCR, Question Bank AI solutions, and the AI Study Assistant using `GEMINI_API_KEY` in the server environment, the Git-ignored local `gemini_local.py` file, or the personal key file `~/.jaacademy/gemini_api_key.txt`. The AI Study Assistant supports Bangla, English, and Banglish prompts; it can match English/Banglish questions by meaning against the student's category question bank and responds in the prompt's language (Banglish prompts receive Bangla-script answers unless English is requested). Assistant prompts are limited to 30 per student per minute and include up to 50,000 characters of category question-bank context. Question Bank AI solutions are generated server-side from the saved question and are available only to signed-in students in the matching category. When configured, every page image of a question PDF is sent to Google's Gemini API, including searchable PDFs. Never commit or share the key; `gemini_local.py` is ignored by Git. Gemini can still misread Bengali; manually review every extracted question before publishing. Without a key, searchable PDFs use pdfplumber and scanned PDFs use local Tesseract OCR. To put your key in the local code configuration, open `gemini_local.py`, replace the empty value with your key, then restart the server:

```powershell
py -3.13 server.py
```

Keep the key in the local-only file and never copy it into `pdf_questions.py`, `README.md`, `js/`, or `js/bundle.js`.

The default Gemini model is `gemini-3.8-flash`. To switch models, edit `GEMINI_MODEL` in the Git-ignored `gemini_local.py` file using the API model ID (for example, `gemini-2.0-flash`), then restart the server. Display names with spaces are normalized to lowercase model IDs. The `GEMINI_MODEL` environment variable takes precedence over that local setting. This model setting is used for the AI Study Assistant, Question Bank AI solutions, and PDF OCR. Gemini OCR uses the Interactions API and asks the model to transcribe the full shaded or colored answer box below each MCQ, including its explanation. The parser recognizes labels such as `Explanation`, `Reasoning`, `ব্যাখ্যা`, and `সমাধান`. The admin review indicates how many explanations were detected and warns if OCR returns none. To reduce total wait time without lowering image resolution or changing models, the server renders pages locally and sends up to two page OCR requests concurrently; output stays in PDF order. Set `GEMINI_OCR_WORKERS` from 1 to 4 to control concurrency (default `2`); higher values may hit your Gemini API quota/rate limits. One-page PDFs cannot benefit from page concurrency. Keep the upload page open while it runs. Each request waits up to 300 seconds by default. If a page times out, set `GEMINI_REQUEST_TIMEOUT` to a value from 30 to 600 seconds in the server PowerShell window, then restart the server. For local Tesseract OCR, on Windows install Tesseract and the Bengali/English language data:

```powershell
winget install --id UB-Mannheim.TesseractOCR --exact
$tessdata = Join-Path $HOME ".jaacademy\tessdata"
New-Item -ItemType Directory -Path $tessdata -Force
Copy-Item "C:\Program Files\Tesseract-OCR\tessdata\eng.traineddata" $tessdata
Invoke-WebRequest "https://github.com/tesseract-ocr/tessdata_fast/raw/main/ben.traineddata" -OutFile (Join-Path $tessdata "ben.traineddata")
```

If Tesseract is installed elsewhere, set `JA_TESSERACT_CMD` to its executable path; `JA_TESSDATA_DIR` can point to the language-data directory. `JA_TESSERACT_LANG` defaults to `ben+eng`. For an HTTPS deployment, set `JA_SECURE_COOKIES=1`, set an appropriate `JA_DATABASE_PATH`, and run behind a production-grade WSGI/ASGI server and HTTPS reverse proxy. The included Python HTTP server is for local development only. Built-in sample resources remain frontend demo data and are not confidential; use the server-managed uploads/content for private material. Email verification, cloud storage, and production deployment are not implemented. Self-service password recovery sends email only when Resend is configured as described above; admins can also reset student passwords from User Management.

---

## 🌟 Core Features & System Architecture

### 1. Student-Facing Experience
* **Visual Onboarding & Category Picker:** Three distinct cards for **SSC**, **HSC**, and **Job Seeker** dynamically customize syllabus, courses, exams, question bank, and AI responses.
* **Category-specific student views:** A student's registered SSC, HSC, or JOB category pins course, exam, question-bank, practice-test, and store views to that track.
* **Modern Landing Page:** Hero with live stats, preparation categories, popular courses with BDT (৳) pricing, live exam schedule cards, question bank spotlight, AI assistant banner, student reviews, success stories, and interactive FAQ accordion.
* **Online Course Player (`#/learn/course/:id`):**
  - Left collapsible syllabus drawer with **✓ Completed**, **▶ Current**, and **🔒 Locked** lesson indicators.
  - Video Player with auto-advance and playback controls.
  - Tabbed sections below player: Lecture Notes & Overview, HD Downloadable PDF lecture sheets, Discussion Q&A forum, and **⚡ Contextual Course AI Help**.
* **Distraction-Free Live Exam Simulator (`#/exam/:id`):**
  - Real-time countdown timer with urgent pulse warning.
  - Autosave on selection and automatic submission when timer expires.
  - Question Navigator palette (Green = Answered, Amber = Flagged for Review, Gray = Unanswered).
* **Diagnostic Exam Results & Weak Topics Engine (`#/exam/result/:id`):**
  - Visual score circle, merit rank (e.g. 14 / 1,420), accuracy percentage, negative mark deductions, and time spent.
  - Automated weak topic diagnostic analysis with one-click custom practice generation.
  - Detailed answer review with complete step-by-step explanations in Bengali.
* **Filterable Question Bank (`#/question-bank`):**
  - Board & Year filters (Dhaka, Rajshahi, Chittagong, BCS 45th/46th).
  - Instant answer reveal, explanations, Gemini-generated question solutions, and "Report Question" modal.
* **AI Powered Practice Generator (`#/question-bank/practice`):**
  - Instant customized live exam creation based on selected subject, chapter, question count, and difficulty.
* **AI Study Assistant (`#/ai`):**
  - ChatGPT-like responsive chat interface.
  - Context-aware adaptation (SSC mode, HSC mode, Job seeker mode).
  - Searches the signed-in student's latest category-specific Question Bank and answers matching questions using the saved correct option, explanation, or written/CQ answer.
  - Quick actions: *Explain Topic*, *Solve Question*, *Generate MCQ*, *Make Study Plan*, *Analyze Result*, *Give Me a Quiz*.
* **Book Store & BD Payment Gateways (`#/store`, `#/cart`, `#/checkout`):**
  - Printed Books (with Courier delivery) & Instant Digital PDFs.
  - Manual bKash course-payment requests with server-side order records and admin verification before enrollment.
  - Course coupon codes and discounts are configured in `payment_config.json`, calculated server-side, and applied at checkout.

---

### 2. Admin Control Center (`#/admin`)
* **Overview Dashboard:** Total Students, Active Courses, Orders, Revenue in BDT (৳), Live Exams, and Chart.js analytics graphs.
* **Course Builder (`#/admin/courses`):** Add/edit courses, set prices and discounts, organize chapters and video lessons.
* **Question Bank Management (`#/admin/questions`):** Create/edit questions, options, explanations, and **Bulk CSV Import Simulator**.
* **Exam Management (`#/admin/exams`):** Create live exams, configure duration, total marks, negative marking, and access rules.
* **Store & Orders (`#/admin/store`):** Manage store products and manually verify pending bKash course-payment orders before granting access.
* **Student Management (`#/admin/students`):** Filter students by category (SSC/HSC/Job), review enrollment status, reset passwords, and view performance history.

---

### 3. Dual-Language & Aesthetics
* **Bangla & English Toggle (`i18n`):** One-click toggle between বাংলা and English with tailored typography (*Hind Siliguri* & *Inter*).
* **Responsive Mobile Navigation:** Fixed bottom navigation bar for mobile devices (`Home`, `Courses`, `Exam`, `Q-Bank`, `AI`).
* **Design Standards:** Modern CSS variables, glassmorphism, glowing action buttons, smooth micro-interactions, and canvas-confetti reward animations.

---

## 🛠️ Legacy Python server (optional reference)

```bash
# Navigate to the project directory
cd C:\Users\user\.gemini\antigravity-ide\scratch\medha-edtech

# Start the legacy SQLite/Python server
py -3.13 server.py
```

Then open `http://localhost:8000` in your web browser. The migrated application runs with `npm run dev` and uses Supabase; it does not require the legacy Python server.
#   m e d h a - e d t e c h  
 #   g e n e s e o n  
 #   g e n e s e o n  
 