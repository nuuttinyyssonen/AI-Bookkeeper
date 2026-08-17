# AI-Bookkeeper

> AI-powered bookkeeping application for Finnish sole traders and small businesses. Built as a master's thesis project.

<img width="1146" height="720" alt="Nytttallennus2026-08-14kello13 00 40-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/8a66fa0d-d48a-45d4-8427-4eb0fbe60a57" />

<img width="320" alt="Mobile Demo" src="https://github.com/user-attachments/assets/f05cd7c5-8cee-4fd4-8a37-c145a671dbd1" />
<img width="330" alt="Mobile demo" src="https://github.com/user-attachments/assets/1eba7662-704d-454d-9937-30c618003530" />
<img width="330" alt="Mobile demo" src="https://github.com/user-attachments/assets/bda5a40a-b4e2-4944-be56-b9a356f40448" />


**🔗 [Live Demo](https://ai-bookkeeper-theta.vercel.app)**

---

## Tech Stack

**Client** — Next.js, TypeScript, Tailwind CSS, next-intl (i18n)  
**Server** — Node.js, Express, Prisma  
**Mobile** — React Native, Expo SDK 57, NativeWind  
**Services** — OpenAI GPT-4o, Google vision API (OCR), Stripe, Supabase  
**Infrastructure** — Vercel (client), Render (server)  

---

## Features
- 📄 Upload receipts via camera, gallery, or file picker
- 🗂️ Browse, manage, edit and delete receipts with Excel export
- 🤖 AI-powered receipt analysis (vendor, amount, VAT, category)
- 💬 AI assistant chat for bookkeeping questions
- 📊 VAT reports (Q1–Q4, monthly, yearly) with PDF export
- 📱 React Native cross-platform mobile app (iOS & Android)
- 🔐 JWT authentication with Supabase auth
- 💳 Stripe subscription management
- 🌍 Multilingual support (Finnish, English)
- 🌙 Dark mode

---

## Architecture

Monorepo with three packages:

AI-Bookkeeper/  
├── client/ # Next.js web app  
├── server/ # Node.js/Express backend  
└── mobile/ # React Native / Expo app  

---

## Getting Started

### Prerequisites
- Node.js v24+
- Docker (for Redis)
- Prisma ORM account and database URLs
- OpenAI API key
- Supabase URL and ANON key
- Google Vision API credentials
- Stripe secret key, publishable key, webhook secret and price IDs
- Resend API key

### Installation

```bash
# Clone the repository
git clone https://github.com/nuuttinyyssonen/AI-Bookkeeper.git

# Install dependencies
cd client && npm install
cd ../server && npm install
cd ../mobile && npm install
```

### Environment Variables

Create `.env` files in `client/` and `server/` based on the examples below.

**server/.env**  
DIRECT_URL=  
DATABASE_URL=  
DATABASE_URL_TEST=  

SUPABASE_URL=  
SUPABASE_ANON_KEY  
SUPABASE_SERVICE_ROLE_KEY=  

REDIS_URL=redis://localhost:6379  
CLIENT_URL=http://localhost:3000  

OPENAI_API_KEY=  
GOOGLE_APPLICATION_CREDENTIALS=

STRIPE_SECRET_KEY=  
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_BASIC_PRICE_ID=  
STRIPE_PREMIUM_PRICE_ID=  
STRIPE_BASIC_YEARLY_PRICE_ID=  
STRIPE_PREMIUM_YEARLY_PRICE_ID=  

RESEND_API_KEY=  

**client/.env.local**  
NEXT_PUBLIC_API_URL=http://localhost:5001

### Run

```bash
# Server
cd server && npm run dev

# Client
cd client && npm run dev

# Mobile
cd mobile && npx expo start
```

---

## Demo

Demo is available at **[ai-bookkeeper-theta.vercel.app](https://ai-bookkeeper-theta.vercel.app)** with pre-seeded data. 
File upload, AI assistant, Stripe subscription and authentication features are disabled in demo mode.

---
