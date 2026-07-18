Below is your **MASTER END-TO-END SHYN LEGAL PLAN** — consolidated, checked, and structured so you can verify nothing is missing: **content, AI, booking control, WordPress dashboard, automation, reviews, and full business flow are all included.**

---

# 🧠 SHYN LEGAL — MASTER PLATFORM PLAN (FINAL VERSION)

## 🎯 WHAT YOU ARE BUILDING

A **full AI-powered immigration operating system**, not just a website:

> Public website + AI assistant + automated lead qualification + booking engine + internal WordPress control center + analytics + automation layer

---

# ⚙️ 1. FULL SYSTEM ARCHITECTURE

```text id="master_arch"
PUBLIC USERS
   ↓
Next.js Frontend (Shyn Legal Website)
   ↓
AI Assistant Layer (Ollama Llama 3 / Mistral)
   ↓
Booking + Contact Engine
   ↓
PostgreSQL Database
   ↓
Automation Layer (n8n)
   ↓
Notifications (Telegram + Email)
   ↓
────────────────────────────
INTERNAL CONTROL SYSTEM
WordPress Custom Dashboard (Admin Panel UI)
   ↓
Controls:
- Leads
- AI Conversations
- Appointments
- Reviews
- Analytics
- Automation
- AI Prompt Control
```

---

# 🧩 2. PUBLIC WEBSITE (NEXT.JS)

## Navigation

- Home
- About Us
- Services
- AI Assistant
- Reviews
- Contact Us
- Consultation (Booking)

---

## 🏠 HOME PAGE (YOUR CONTENT INCLUDED)

### HERO SECTION

**Headline:**
AI-Powered UK Immigration Guidance by Shyn Legal

**Subtext:**
We specialise in UK visa and immigration services, providing expert assistance in navigating complex immigration processes with confidence.

**Buttons:**

- Talk to AI Assistant
- Book Consultation

---

### WHO WE ARE (ABOUT CONTENT INCLUDED)

You included:

- UK visa & immigration specialists
- Spouse, fiancé, unmarried partner visas
- Student, skilled worker, health & care visas
- Visit visas, citizenship, ancestry, e-visa support
- Personalized case handling
- Evidence preparation support
- High success-focused advisory service

✔ FULL CONTENT INTEGRATED INTO ABOUT PAGE

---

### SERVICES SECTION (ALL INCLUDED)

- Family Visas (Spouse, Fiancé, Partner, Child, Dependant)
- Student Visa
- Visit Visa
- Skilled Worker Visa
- Naturalisation & Citizenship
- EU Settlement Scheme
- Ancestry Visa
- E-Visa Transition
- Other Immigration Routes

Each service:

- “Get In Touch” → AI Assistant page

---

### HOW IT WORKS

1. Ask AI Assistant
2. AI collects immigration details
3. AI generates structured case summary
4. User:
   - books consultation OR
   - submits enquiry OR
   - bypasses to booking

---

### LIVE REVIEWS SECTION

- Google Reviews integration
- Facebook Reviews integration
- Auto-scrolling carousel
- AI-generated response drafts (admin controlled)

---

### CTA SECTION

- Book Consultation Now
- Speak to AI Assistant

---

# 🤖 3. AI ASSISTANT SYSTEM (CORE ENGINE)

## LOCATION: `/ai`

### FUNCTION

AI acts as:

- Immigration guide
- Lead qualification engine
- Appointment booking operator
- Case summariser

---

## AI BEHAVIOR

- Detect visa type:
  - Spouse
  - Student
  - Skilled Worker
  - Visit
  - Citizenship

- Ask structured questions

- Generate JSON case summary

- Assign risk level

- Recommend next action

---

## OUTPUT EXAMPLE

```json id="ai_output"
{
  "visa_type": "Spouse Visa",
  "summary": "Applicant married to UK resident abroad",
  "risk": "medium",
  "missing_info": ["income requirement", "proof of relationship"],
  "recommendation": "Book consultation"
}
```

---

# 📅 4. BOOKING SYSTEM (CAL.COM)

Integrated with:

Cal.com

## FEATURES

- Direct booking page
- AI-assisted booking
- Voice booking support
- Admin booking control

---

## AI CAN:

- Create booking
- Reschedule booking
- Cancel booking
- Suggest available slots

---

# 📩 5. CONTACT SYSTEM (AI-GATED)

## OPTIONS:

### Option A — AI Path

- User completes AI assessment
- AI generates structured enquiry
- Auto-email to admin

### Option B — Direct Form

- Name
- Email
- Message
- Visa type

---

## REQUIRED:

- Terms & Conditions checkbox
- Privacy Policy checkbox

---

# ⭐ 6. REVIEWS SYSTEM

## INTEGRATION

- Google Business Reviews
- Facebook Page Reviews

## UI

- Dynamic carousel
- Mobile swipe
- Live updates

---

## AI FEATURE

- AI generates reply drafts
- Admin approves before publishing

---

# 🧠 7. WORDPRESS ADMIN DASHBOARD (CONTROL CENTER)

This is your **internal SaaS-style control panel**

---

## 📊 OVERVIEW DASHBOARD

- Total leads
- Bookings today
- AI conversations
- Conversion rate
- High-risk cases

---

## 🧑‍💼 LEADS MODULE

- View all AI leads
- Filter by visa type
- Lead scoring system
- Status tracking:
  - New
  - Qualified
  - Contacted
  - Booked

---

## 🤖 AI CONVERSATIONS

- Full chat logs
- AI-generated summaries
- Missing information
- Risk scoring

---

## 📅 APPOINTMENTS CONTROL (IMPORTANT)

### FULL CONTROL MODES:

✔ WordPress dashboard
✔ AI assistant (chat)
✔ Voice commands
✔ Telegram commands

---

## AI BOOKING COMMANDS:

- “Book consultation tomorrow 3pm”
- “Reschedule John to Friday”
- “Cancel last appointment”
- “Show today’s schedule”

---

## ⭐ REVIEWS HUB

- Review sync (Google + Facebook)
- AI reply suggestions
- Approval system

---

## ⚙️ AI CONTROL PANEL

- Model selection:
  - Llama 3
  - Mistral 7B

- Prompt editor
- Question flow builder

---

## 🔔 AUTOMATION LOGS (n8n)

- Lead automation
- Booking automation
- Review alerts

---

## 📊 ANALYTICS

- Conversion tracking
- Lead quality score
- Visa category breakdown

---

## ⚙️ SETTINGS

- API keys
- Email config
- Telegram bot
- System toggles

---

# 🎙️ 8. VOICE + AI CONTROL SYSTEM

## FULL CONTROL FROM ANYWHERE

You can manage everything via:

✔ AI chat
✔ Voice commands
✔ WordPress dashboard
✔ Telegram bot

---

## VOICE EXAMPLE:

- “Show my appointments today”
- “Book spouse visa consultation tomorrow”
- “Cancel last booking”

---

## TECH PIPELINE:

```text id="voice_flow"
Voice Input
→ Speech-to-text
→ AI intent detection
→ Booking engine
→ Cal.com update
```

---

# 🔔 9. AUTOMATION LAYER (N8N)

[n8n](https://n8n.io?utm_source=chatgpt.com)

## WORKFLOWS:

- New lead → Telegram + Email
- Booking → Calendar + Notification
- Negative review → Alert + AI draft reply

---

# 🗄️ 10. DATABASE (POSTGRESQL)

PostgreSQL

## TABLES:

- leads
- conversations
- appointments
- reviews_cache

---

# 🚀 11. GITHUB DEPLOYMENT FLOW

```text id="deploy"
Code → GitHub → Auto Deploy → Live Site (I20 Hosting)
```

---

# 🧠 FINAL CHECK — EVERYTHING INCLUDED?

## ✅ YOUR ORIGINAL REQUIREMENTS:

✔ Immigration website (Shyn Legal content fully included)
✔ Contact form with Terms checkbox
✔ Google + Facebook reviews integration
✔ AI handling enquiries
✔ Bypass option for direct booking
✔ Consultation system
✔ Mobile optimized
✔ AI knowledge assistant
✔ Voice + chat AI booking control
✔ WordPress dashboard control panel
✔ Analytics + CRM system
✔ Telegram + email automation
✔ Open-source AI (Llama / Mistral via Ollama)
✔ GitHub deployment pipeline
✔ Next.js frontend

---

# 🧩 FINAL RESULT

You now have:

> A **complete AI immigration operating system** with:

- Public conversion website
- AI assistant (chat + voice)
- Automated lead qualification
- Full booking control system
- Internal WordPress command center
- Real-time automation + notifications

---

# 🛠️ IMPLEMENTATION STARTED (THIS REPO)

The build now includes a working scaffold plus core operational backend workflows.

## What is already implemented

### Public website (Next.js)

Implemented routes:

- /
- /about
- /services
- /ai
- /reviews
- /contact
- /consultation

Includes:

- Hero + conversion CTA flow
- Service cards and AI entry path
- AI assessment form and structured summary output
- Contact form with required Terms + Privacy checkboxes
- Consultation operations UI for create, reschedule, cancel, and suggest slots

### Next.js API routes (proxy + fallback)

- POST /api/ai/assess
- POST /api/contact
- GET /api/services
- GET /api/reviews
- POST /api/appointments/create
- POST /api/appointments/reschedule
- POST /api/appointments/cancel
- POST /api/appointments/suggest

### Backend API service (Express + TypeScript)

`apps/api` includes:

- Health endpoint (`/health`)
- AI assessment endpoint (`/api/ai/assess`) with lead + conversation persistence
- Contact endpoint (`/api/contact`) with lead persistence
- Booking endpoints (`/api/appointments/*`) integrated with Cal.com APIs
- Review cache endpoint (`/api/reviews/cache`) with alert trigger for low ratings
- Admin endpoints (`/api/admin/*`) for leads, conversations, appointments, reviews, and analytics
- Telegram command endpoint (`/api/telegram/command`) starter parser

### Infrastructure scaffold

`infra/docker-compose.yml` includes:

- PostgreSQL
- n8n
- WordPress + MariaDB
- Ollama

`infra/db/schema.sql` includes starter tables:

- leads
- conversations
- appointments
- reviews_cache

`infra/wordpress/plugins/shyn-control-center` includes a multi-page admin plugin:

- Dashboard metrics
- Leads
- AI conversations
- Appointments
- Reviews
- Settings (API URL + admin key)

CI pipeline added at `.github/workflows/ci.yml` for typecheck, lint, and build.

Additional operator artifacts:

- n8n workflow templates in `infra/n8n/workflows`
- Review sync payload example in `infra/reviews/provider-sync.example.json`
- Production activation checklist in `infra/PRODUCTION_CHECKLIST.md`
- Infrastructure scripts in `infra/scripts`
- Admin audit trail support in `admin_audit_logs`

---

## Local development

1. Install workspace dependencies:

```bash
npm install
```

2. Run frontend:

```bash
npm run dev:web
```

3. Run backend API:

```bash
npm run dev:api
```

4. Start infra stack (optional):

```bash
cd infra
docker compose up -d
```

5. Copy environment template:

```bash
cp .env.example .env
```

---

## Next implementation steps

- Deploy infrastructure and set production environment values
- Enable real SMTP + Telegram credentials in `.env`
- Import and activate n8n workflows (`lead-created`, `booking-event`, `review-alert`)
- Configure WordPress plugin settings and admin API key
- Add Google/Facebook live review ingestion jobs to `/api/reviews/sync`
- Expand server-side voice/command intent handling beyond the current starter parser
