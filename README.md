# 🏥 MedGuard — Medical Emergency Predictor

> An AI-powered web application that analyzes user health data and predicts potential medical emergencies before they occur.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## Overview

MedGuard is a health monitoring web app that takes user-provided vitals and health indicators, runs them through an AI analysis pipeline, and surfaces risk predictions for common medical emergencies such as cardiac events, hypoglycemia, and hypertensive crises — before they happen.

## Features

- 🩺 **Health intake form** — collects vitals (BP, heart rate, glucose, SpO₂, etc.)
- 🤖 **AI risk analysis** — predicts likelihood of medical emergencies
- 📊 **Risk dashboard** — visual breakdown of risk levels per condition
- 🔔 **Alert system** — flags high-risk readings with recommended actions
- 🔐 **User accounts** — secure auth and personal health history via Supabase
- 📱 **Responsive UI** — works on desktop and mobile

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase (PostgreSQL + Auth + Edge Functions) |
| Build tool | Vite |
| Package manager | npm / bun |

## Project structure

```
Medical-Emergency-Predictor/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route-level pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Supabase client, utilities
│   └── types/              # TypeScript type definitions
├── supabase/
│   └── migrations/         # Database schema migrations
├── .env.example            # Environment variable template
├── index.html
├── tailwind.config.ts
└── vite.config.ts
```

## Getting started

### Prerequisites

- Node.js 18+ or Bun
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/HariRathnam-hub/Medical-Emergency-Predictor.git
cd Medical-Emergency-Predictor
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Never commit your `.env` file.** It is listed in `.gitignore`.

### 4. Set up Supabase

- Create a new project at [supabase.com](https://supabase.com)
- Go to **Settings → API** to get your URL and anon key
- Run the migrations in `supabase/migrations/` via the Supabase SQL editor or CLI

### 5. Run the development server

```bash
npm run dev
# or
bun dev
```

App runs at `http://localhost:5173`

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anon key |

## ⚠️ Security note

This project uses Supabase's Row Level Security (RLS) to protect user health data. Make sure RLS policies are enabled on all tables before deploying to production.

If you previously committed a `.env` file with real credentials, rotate your Supabase API keys immediately at **Supabase → Settings → API → Regenerate**.

## Roadmap

- [ ] Integration with wearable device APIs (Fitbit, Apple Health)
- [ ] SMS/email alerts for high-risk predictions
- [ ] Doctor dashboard for monitoring multiple patients
- [ ] Offline mode with service workers
- [ ] Export health history as PDF

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)

---

> **Disclaimer:** MedGuard is a student project for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
