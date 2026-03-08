# ⚡ NexusAI — AI Marketing Campaign Automation Platform

> A production-ready, full-stack AI-powered marketing automation platform. Captures leads, analyzes them with AI, generates personalized outreach campaigns, and tracks performance — all automatically.

---

## 📐 Architecture

```
Lead Form (Next.js)
      │
      ▼
POST /api/leads  ──►  Express Backend
                            │
                     ┌──────┴──────────┐
                     │                 │
               MongoDB Atlas     OpenAI GPT-4o
               (Leads/Campaigns)  (Analysis + Copy)
                     │                 │
                     └──────┬──────────┘
                            │
                    Campaign Created
                            │
                    Email Simulated
                            │
                    Webhook Triggered
                    POST /api/webhook/campaign
                            │
                    Admin Dashboard (Next.js)
                    Analytics · Leads · Campaigns
```

---

## 🧠 Core Features

| Feature | Description |
|---|---|
| **Lead Capture** | Web form → `POST /api/leads` → MongoDB |
| **AI Lead Analysis** | GPT-4o scores leads 1-10, assigns priority, recommends strategy |
| **Campaign Generator** | GPT-4o writes personalized subject + email body |
| **Automation Workflow** | Background processing: analyze → generate → send → webhook |
| **Email Simulation** | Logs delivery details to console (plug in SendGrid/SES) |
| **Webhooks** | `POST /api/webhook/campaign` triggers on each campaign |
| **Admin Dashboard** | Stats, leads table, campaigns, charts, webhook log |
| **Analytics** | Industry breakdown, open/reply rates, timeline charts |

---

## 🗂️ Project Structure

```
ai-marketing-automation/
│
├── backend/
│   ├── server.js                    # Express app entry point
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── models/
│   │   ├── Lead.js                  # Lead schema
│   │   ├── Campaign.js              # Campaign schema
│   │   └── Analytics.js             # Analytics schema
│   ├── controllers/
│   │   ├── leadController.js        # Lead CRUD + async AI processing
│   │   ├── campaignController.js    # Campaign CRUD
│   │   ├── analyticsController.js   # Aggregated stats
│   │   └── webhookController.js     # Webhook endpoints
│   ├── routes/
│   │   ├── leads.js
│   │   ├── campaigns.js
│   │   ├── webhooks.js
│   │   └── analytics.js
│   ├── services/
│   │   ├── aiService.js             # OpenAI API calls
│   │   ├── emailService.js          # Email simulation
│   │   └── webhookService.js        # Webhook dispatch
│   ├── middleware/
│   │   └── validation.js
│   └── .env.example
│
└── frontend/
    ├── pages/
    │   ├── index.js                 # Redirects to /dashboard
    │   ├── dashboard.js             # Overview stats + recent data
    │   ├── capture.js               # Lead capture form
    │   ├── analytics.js             # Charts & metrics
    │   ├── leads/
    │   │   ├── index.js             # Leads table with filters
    │   │   └── [id].js              # Lead detail view
    │   └── campaigns/
    │       └── index.js             # All campaigns with filters
    ├── components/
    │   ├── layout/
    │   │   └── Layout.js            # Sidebar + topbar wrapper
    │   ├── ui/
    │   │   └── index.js             # StatCard, Badge, Avatar, etc.
    │   ├── LeadCaptureForm.js
    │   ├── LeadsTable.js
    │   └── CampaignCard.js
    ├── lib/
    │   ├── api.js                   # Axios client for all endpoints
    │   └── utils.js                 # Formatters, color helpers
    └── styles/
        └── globals.css
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenAI API key

---

### 1. Clone & Install

```bash
git clone https://github.com/yourname/ai-marketing-automation.git
cd ai-marketing-automation

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. Configure Environment Variables

**Backend** — copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ai-marketing
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:3000
```

**Frontend** — create `.env.local`:
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

---

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:3000
```

---

## 🔌 API Documentation

### Leads

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/leads` | Create lead, trigger AI analysis |
| `GET` | `/api/leads` | Get all leads (filter: industry, priority, status) |
| `GET` | `/api/leads/:id` | Get single lead with campaign |
| `PATCH` | `/api/leads/:id` | Update lead |
| `DELETE` | `/api/leads/:id` | Delete lead |

**POST /api/leads body:**
```json
{
  "name": "John Smith",
  "email": "john@realestatepro.com",
  "company": "RealEstatePro",
  "industry": "Real Estate",
  "message": "We want automated lead follow-ups for property inquiries."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead captured. AI analysis in progress.",
  "lead": { "id": "...", "name": "John Smith", "status": "pending" }
}
```

---

### Campaigns

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/campaigns` | Get all campaigns (filter: status, industry) |
| `GET` | `/api/campaigns/:id` | Get single campaign |
| `POST` | `/api/campaigns/regenerate/:leadId` | Regenerate campaign for a lead |
| `PATCH` | `/api/campaigns/:id` | Update campaign |

---

### Webhooks

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/webhook/campaign` | Trigger campaign for a lead |
| `POST` | `/api/webhook/lead-status` | Update lead status externally |

**POST /api/webhook/campaign body:**
```json
{ "leadId": "65abc123...", "event": "campaign.trigger" }
```

---

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/overview` | Total leads, conversion rate, open/reply rates |
| `GET` | `/api/analytics/industry` | Leads grouped by industry |
| `GET` | `/api/analytics/campaigns` | Campaign performance by industry |
| `GET` | `/api/analytics/timeline` | 30-day leads & campaigns trend |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Backend → Render
1. Connect your GitHub repo to [render.com](https://render.com)
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables from `.env.example`

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user
3. Copy the connection string into `MONGODB_URI`
4. Whitelist all IPs (0.0.0.0/0) for hosted backends

---

## 🔒 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `OPENAI_API_KEY` | ✅ | OpenAI API key (GPT-4o) |
| `PORT` | ❌ | Backend port (default: 5000) |
| `FRONTEND_URL` | ❌ | Allowed CORS origin |
| `WEBHOOK_URL` | ❌ | External webhook endpoint |
| `WEBHOOK_SECRET` | ❌ | Webhook signing secret |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4o |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel (FE) + Render (BE) + MongoDB Atlas |

---

## 🎯 Optional Enhancements

- [ ] Integrate real SendGrid / AWS SES for actual email delivery
- [ ] Add Zapier/Make webhook for multi-step automation
- [ ] Lead scoring dashboard with drag-to-filter
- [ ] Automated follow-up sequences (Day 3, Day 7, Day 14)
- [ ] Campaign A/B testing with variant generation
- [ ] JWT authentication for the admin panel
- [ ] CSV bulk lead import

---

## 👤 Author

Built as a portfolio project demonstrating AI automation engineering.
