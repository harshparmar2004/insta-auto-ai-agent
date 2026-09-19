<p align="center">
  <img src="public/images/logo.png" alt="InstaAuto AI Agent Logo" width="220" style="border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.15);" />
</p>

<h1 align="center">⚡ InstaAuto AI Agent — Autonomous Instagram Content & Growth Engine</h1>

<p align="center">
  <b>1-Click Autonomous Research, Lead Magnet Generation, Instagram Reel Publishing, and AI-Powered Follow-First DM Funnels.</b><br />
  From raw concept to published Instagram Reel, automated keyword extraction, and instant lead capture in DMs — hands-free.
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v18%2B-green.svg?style=flat-square&logo=node.js" alt="Node.js" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-v4.19-blue.svg?style=flat-square&logo=express" alt="Express" /></a>
  <a href="https://developers.facebook.com/docs/instagram-api/"><img src="https://img.shields.io/badge/Meta_Graph_API-v20.0-0081FB.svg?style=flat-square&logo=meta" alt="Meta Graph API" /></a>
  <a href="https://sqlite.org/"><img src="https://img.shields.io/badge/Database-SQLite3-003B57.svg?style=flat-square&logo=sqlite" alt="SQLite" /></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI_Engine-Gemini_Pro-8E75B2.svg?style=flat-square" alt="Gemini AI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-orange.svg?style=flat-square" alt="License" /></a>
</p>

---

## 🌟 The 1-Click Autonomous Flywheel

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ⚡ 1-CLICK AUTONOMOUS GROWTH FLYWHEEL                           │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
           ┌────────────────────────────────┴────────────────────────────────┐
           ▼                                                                 ▼
 🧠 1. AI RESEARCH AGENT                                           📄 2. LEAD MAGNET ENGINE
 Researches trending creator topics,                               Generates comprehensive guide /
 writes high-retention video script,                               code template / PDF doc & produces
 and crafts caption with trigger keyword                           live deliverable link.
 (e.g. "Comment 'RAG' below!")                                     (e.g. docs.google.com/rag-blueprint)
           │                                                                 │
           └────────────────────────────────┬────────────────────────────────┘
                                            ▼
                       🚀 3. PROGRAMMATIC PUBLISHER
                       Calls Meta Content Publishing API to upload and
                       publish the Reel directly to your Instagram profile!
                                            │
                                            ▼
                       ⚡ 4. AUTO-RULE PROVISIONER
                       InstaAuto catches the new post, extracts keyword ('RAG'),
                       binds the exact generated doc link, and arms the DM funnel.
                                            │
                                            ▼
                       💬 5. 3-STEP FOLLOW-FIRST DM FUNNEL
                       Follower comments "RAG" on Instagram:
                       Step 1: [ Send me the access ] (Native Button)
                       Step 2: [ Visit Profile ] + [ I'm following ✅ ] (Profile Gate)
                       Step 3: Direct deliverable pass with tracked link (/r/:trackingId)
                                            │
                                            ▼
                       📊 6. CLOSED-LOOP TELEMETRY & HISTORY
                       Tracks real Instagram views, comments, DMs sent, and link CTR %
                       to feed analytics back to the Research Agent!
```

---

## 📸 Dashboard & Interface Overview

<p align="center">
  <img src="public/images/dashboard_preview.png" alt="InstaAuto Dashboard Interface Preview" width="100%" style="border-radius: 16px; border: 1px solid #E6E1D8; box-shadow: 0 10px 40px rgba(0,0,0,0.1);" />
</p>

---

## ✨ Core System Capabilities

### 🧠 1. Autonomous Research & Content Generation Agent
- Researches high-performing technical, creator, and growth topics.
- Generates high-retention video scripts formatted for Instagram Reels and Carousels.
- Formulates conversion-optimized captions with embedded call-to-action hooks (e.g., *"Comment 'GROWTH' to get my complete playbook"*).

### 📄 2. Dynamic Lead Magnet & Resource Link Provisioner
- Automatically creates companion assets (Google Docs, Notion templates, or PDF guides).
- Generates a permanent unique deliverable URL tied specifically to that Reel topic.
- Ensures every Reel has its own dedicated resource pass without cross-linking confusion.

### 🚀 3. Meta Content Publishing Pipeline
- Programmatic Reel publishing via official Meta Graph API v20.0 container workflow (`POST /{ig_user_id}/media` -> `POST /{ig_user_id}/media_publish`).
- Hands-free deployment without manually rendering or opening mobile apps.

### 🔐 4. 3-Step Follow-First Interactive Funnel
Require viewers to follow your profile before unlocking deliverable resource links:
- **Step 1 (Activation)**: When viewer comments the keyword, dispatches a Native Button Template: `[ Send me the access ]`.
- **Step 2 (Follow Gate)**: Two-button template: `[ 👤 Visit Profile ]` and `[ I'm following ✅ ]`.
- **Step 3 (Deliverable Pass)**: Unlocks the exact doc link generated for that post via tracked shortlink (`/r/:trackingId`).

<p align="center">
  <img src="public/images/workflow_preview.png" alt="Follow-First Workflow Diagram" width="90%" style="border-radius: 14px; margin: 1.5rem 0;" />
</p>

### 📅 5. Multi-Year Monthly History Archive & Collapsible Calendar
- Structured multi-year performance ledger (2024, 2025, 2026+).
- Real Meta Graph API metrics: Real Reel Views, Comments, DMs Dispatched, Link Clicks, and Conversion CTR %.
- Collapsible 12-month calendar drawer with smooth animated upward/downward layout shifts.
- Post status tracking: clearly differentiates active live reels (`🟢 Live on Page`) from removed posts (`🗑️ Deleted from Page`).

### 🎯 6. Deliverable Link Click Telemetry (`/r/:trackingId`)
- Generates unique UUID tracking redirect links.
- Logs timestamps, IP addresses, and user-agents in the SQLite database.
- Calculates true month-over-month conversion rates (`(Link Clicks / DMs Sent) * 100`).

### 🛡️ 7. Anti-Spam Queue Worker & Token Refresh Cron
- Natural delay queue pacing (1–3s randomized delays) to safeguard account health.
- Automated 60-day token refresh cron running silently every 6 hours (`cron.schedule('0 */6 * * *')`).
- Silent, flicker-free background polling with smart DOM diffing.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+ (tested on Node 20 & 24)
- **Server**: Express 4.19
- **Database**: SQLite3 via `better-sqlite3` (WAL mode enabled)
- **Instagram Engine**: Meta Graph API v20.0 (Webhooks, Messaging, Insights, Publishing)
- **AI Core**: Google Gemini (`@google/genai`)
- **Frontend**: Vanilla JS (SPA with reactive view components, Plus Jakarta Sans typography)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/harshparmar2004/insta-auto-ai-agent.git
cd insta-auto-ai-agent
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Meta Developer credentials:
```env
PORT=3000
BASE_URL=http://localhost:3000

# Meta Developer Credentials
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
WEBHOOK_VERIFY_TOKEN=your_custom_verify_token

# Instagram Account (Retrieved during login or via setup)
IG_USER_ID=your_instagram_business_id
ACCESS_TOKEN=your_long_lived_token

# AI Engine (Optional, for Autonomous Research)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Start the Server
```bash
npm start
```
Open your browser at:
👉 **`http://localhost:3000`**

---

## 📁 Repository Structure

```
insta-auto-ai-agent/
├── data/                  # SQLite database storage (WAL mode)
├── public/                # Frontend SPA dashboard assets
│   ├── css/               # Modern stylesheet & layout system
│   ├── images/            # UI previews, icons, and logos
│   └── js/                # Modular view scripts (history, rules, media, app)
├── src/
│   ├── components/        # UI components & handbook guides
│   ├── middleware/        # Authentication & webhook HMAC verification
│   ├── routes/            # Express endpoints (webhook, media, rules, history, agent)
│   ├── services/          # Core engines (automation, mediaSync, historyStorage, publisher)
│   └── database.js        # SQLite schema & query layer
├── server.js              # Application entrypoint & cron jobs
├── package.json           # Project manifest & dependencies
└── README.md              # Project documentation
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
