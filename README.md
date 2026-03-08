# ⚡ NexusAI — AI Marketing Campaign Automation Platform

> A production-ready full-stack AI platform that automatically captures leads, scores them with GPT-4o, generates personalized outreach campaigns, and tracks analytics — all without manual intervention.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-marketing-automation-two.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-purple?style=for-the-badge&logo=render)](https://ai-marketing-automation-xtcx.onrender.com/health)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/pavan1832/ai-marketing-automation)

---

## 🚀 Live URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend (Vercel) | https://ai-marketing-automation-two.vercel.app |
| 🔧 Backend API (Render) | https://ai-marketing-automation-xtcx.onrender.com |
| ❤️ Health Check | https://ai-marketing-automation-xtcx.onrender.com/health |
| 📊 API Leads | https://ai-marketing-automation-xtcx.onrender.com/api/leads |

---

## 📌 What is NexusAI?

NexusAI is an AI-powered B2B marketing automation platform that eliminates manual lead handling. When a lead is submitted:

1. 🗃️ **Stored instantly** in MongoDB Atlas
2. 🤖 **GPT-4o analyzes** the lead — assigns a quality score, priority, and recommends a marketing strategy
3. ✉️ **Personalized campaign** is auto-generated (subject + email body tailored to their company + industry)
4. 📨 **Email simulated** with delivery logging
5. 🔗 **Webhook fired** to third-party tools (Zapier, Make, Slack)
6. 📈 **Analytics tracked** on the real-time dashboard

**All of this happens automatically within seconds of form submission.**

---

## ✨ Features

- **AI Lead Scoring** — GPT-4o scores each lead 1-10 with priority level (High/Medium/Low)
- **AI Campaign Generator** — Personalized email subject + body per lead using their company context
- **Real-time Dashboard** — KPI cards, charts, lead table with filters
- **Analytics Charts** — 30-day trend (line), industry performance (bar), distribution (pie)
- **Webhook Automation** — POST lead data to any URL (Zapier, Make, Slack, custom)
- **Campaign Regeneration** — Re-run AI campaign generation for any existing lead
- **Graceful Fallbacks** — Pipeline continues even if OpenAI API is unavailable
- **Rate Limiting** — 100 requests/15 min per IP on all API endpoints
- **CORS Protected** — Whitelisted origin only

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework, file-based routing |
| React 18 | UI components |
| Tailwind CSS | Utility-first styling |
| Recharts | Analytics charts |
| Axios | API HTTP client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 22 | Runtime |
| Express.js 4 | REST API framework |
| Mongoose 8 | MongoDB ODM |
| OpenAI SDK 4 | GPT-4o integration |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |

### Infrastructure
| Service | Provider |
|---------|----------|
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Database | MongoDB Atlas |
| AI API | OpenAI (GPT-4o) |
| Source Control + CI/CD | GitHub |

---

## 📁 Project Structure

```
ai-marketing-automation/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── leadController.js    # Lead CRUD + async AI pipeline
│   │   ├── campaignController.js
│   │   ├── analyticsController.js
│   │   └── webhookController.js
│   ├── models/
│   │   ├── Lead.js              # Lead schema with AI analysis fields
│   │   ├── Campaign.js          # Campaign schema with analytics
│   │   └── Analytics.js
│   ├── routes/
│   │   ├── leads.js
│   │   ├── campaigns.js
│   │   ├── analytics.js
│   │   └── webhooks.js
│   ├── services/
│   │   ├── aiService.js         # GPT-4o: analyze lead + generate campaign
│   │   ├── emailService.js      # Email simulation with logging
│   │   └── webhookService.js    # Outbound webhook dispatch
│   ├── middleware/
│   │   └── validation.js
│   ├── server.js                # Express app entry point
│   └── package.json
│
└── frontend/
    ├── components/
    │   ├── layout/Layout.js     # Sidebar + topbar
    │   ├── ui/index.js          # Shared UI components
    │   ├── LeadCaptureForm.js
    │   ├── LeadsTable.js
    │   └── CampaignCard.js
    ├── lib/
    │   ├── api.js               # Typed Axios API client
    │   └── utils.js             # Formatters, helpers
    ├── pages/
    │   ├── index.js             # Redirect to dashboard
    │   ├── dashboard.js         # Overview stats + charts
    │   ├── capture.js           # Lead form + AI pipeline log
    │   ├── analytics.js         # Full analytics view
    │   ├── leads/
    │   │   ├── index.js         # Leads table with filters
    │   │   └── [id].js          # Lead detail page
    │   └── campaigns/
    │       └── index.js         # Campaigns list
    └── package.json
```

---

## 🔌 API Reference

**Base URL:** `https://ai-marketing-automation-xtcx.onrender.com`

### Leads
```
POST   /api/leads              Create lead + trigger AI pipeline
GET    /api/leads              Get all leads (filter: industry, priority, status)
GET    /api/leads/:id          Get single lead with campaign data
PATCH  /api/leads/:id          Update lead
DELETE /api/leads/:id          Delete lead
```

### Campaigns
```
GET    /api/campaigns               Get all campaigns (filter: status, industry)
GET    /api/campaigns/:id           Get single campaign
POST   /api/campaigns/regenerate/:leadId   Re-run AI generation for a lead
```

### Analytics
```
GET    /api/analytics/overview     KPI summary stats
GET    /api/analytics/industry     Leads + scores by industry
GET    /api/analytics/campaigns    Campaign performance by industry
GET    /api/analytics/timeline     30-day trend data
```

### Webhooks
```
POST   /api/webhook/campaign       Trigger campaign automation
POST   /api/webhook/lead-status    Update lead status
```

### Health
```
GET    /health                     API health check
```

---

### Sample Request

```bash
curl -X POST https://ai-marketing-automation-xtcx.onrender.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Williams",
    "email": "sarah@fintrack.io",
    "company": "FinTrack",
    "industry": "Finance",
    "message": "We want an AI system to qualify leads before our sales team contacts them."
  }'
```

### Sample Response
```json
{
  "success": true,
  "message": "Lead captured successfully. AI analysis in progress.",
  "lead": {
    "_id": "69ad3800921a838dfd9c4b77",
    "name": "Sarah Williams",
    "email": "sarah@fintrack.io",
    "company": "FinTrack",
    "industry": "Finance",
    "status": "pending"
  }
}
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas account (free)
- OpenAI API key

### 1. Clone the repository
```bash
git clone https://github.com/pavan1832/ai-marketing-automation.git
cd ai-marketing-automation
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-marketing?retryWrites=true&w=majority
OPENAI_API_KEY=sk-proj-your-openai-key
FRONTEND_URL=http://localhost:3000
WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxxx/
WEBHOOK_SECRET=nexusai123
```

> ⚠️ If your MongoDB password contains `@`, encode it as `%40` in the URI.

```bash
node server.js
# ✅ NexusAI Backend running on http://localhost:5000
# ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
# ✅ Frontend running on http://localhost:3000
```

---

## ☁️ Deployment

### Backend → Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all environment variables from `.env` in the **Environment** tab

### Frontend → Vercel
1. Import your GitHub repository on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Framework: **Next.js**
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-render-url.onrender.com
   ```

### MongoDB Atlas Network Access
- Go to **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
- This is required for Render's dynamic IPs to connect

---

## 🤖 AI Pipeline Details

### Lead Analysis Prompt (GPT-4o, temp: 0.3)
The AI receives the lead's name, company, industry, and message, and returns:
```json
{
  "industry_category": "FinTech / Lending",
  "lead_quality_score": 8,
  "priority_level": "High",
  "recommended_marketing_strategy": "Focus on compliance-aware automation messaging..."
}
```

### Campaign Generation Prompt (GPT-4o, temp: 0.7)
The AI receives the lead data + strategy and generates:
```json
{
  "subject": "AI-Powered Lead Qualification for FinTrack",
  "preheader": "See how we help Finance companies automate growth",
  "message": "Hi Sarah, we noticed FinTrack is looking to streamline..."
}
```

### Fallback Behavior
If OpenAI returns a 429 (quota exceeded) or any error:
- Lead is still saved with `status: "analyzed"` 
- Default score of 5, priority "Medium" assigned
- Generic campaign message used
- Pipeline continues without interruption

---

## 🔗 Zapier Integration

1. Go to [zapier.com](https://zapier.com) → Create Zap
2. Trigger: **Webhooks by Zapier** → **Catch Hook** → Copy URL
3. Paste URL as `WEBHOOK_URL` in your backend `.env`
4. Action: **Google Sheets** → Create Row
5. Map fields: `leadName`, `company`, `industry`, `leadScore`, `priority`, `subject`
6. Publish Zap

Every new lead will automatically appear in your Google Sheet.

---

## 🧪 Running Tests

```bash
# Test health endpoint
curl https://ai-marketing-automation-xtcx.onrender.com/health

# Test lead creation
curl -X POST https://ai-marketing-automation-xtcx.onrender.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","company":"TestCo","industry":"Technology","message":"Testing the API"}'

# Test leads retrieval
curl https://ai-marketing-automation-xtcx.onrender.com/api/leads

# Test campaigns
curl https://ai-marketing-automation-xtcx.onrender.com/api/campaigns

# Test analytics
curl https://ai-marketing-automation-xtcx.onrender.com/api/analytics/overview
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `MongoDB ENOTFOUND` | Check MONGODB_URI is correct and Atlas IP whitelist includes `0.0.0.0/0` |
| `@ in password` error | URL-encode `@` as `%40` in the connection string |
| `Network Error` on frontend | Update `FRONTEND_URL` on Render to match your Vercel URL exactly (no trailing slash) |
| `OpenAI 429 quota` | Add billing credits at platform.openai.com/billing |
| `Route not found` on Render | Ensure Root Directory is set to `backend` in Render settings |
| `node_modules in git` | Run `git rm --cached -r node_modules` and update `.gitignore` |

---

## 🗺️ Roadmap

- [ ] Real email delivery (SendGrid / AWS SES)
- [ ] JWT authentication for admin dashboard
- [ ] Follow-up email sequences (Day 3, 7, 14)
- [ ] A/B campaign testing
- [ ] CSV bulk lead import
- [ ] Slack notifications for high-priority leads
- [ ] Mobile app (React Native)
- [ ] Multi-user team accounts

---

## 👤 Author

**Lokpavan**
- GitHub: [@pavan1832](https://github.com/pavan1832)
- Project: [ai-marketing-automation](https://github.com/pavan1832/ai-marketing-automation)

---

## 📄 License

This project is built as a portfolio demonstration. Feel free to fork and adapt for your own projects.

---

<div align="center">
  <strong>Built with ❤️ using Next.js, Node.js, MongoDB, and OpenAI GPT-4o</strong>
</div>
