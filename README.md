# HR SaaS Platform for Indian SMBs

A lightweight, unified HR management platform targeting Indian startups (10-50 employees).

## Features
- **Enhanced Employee Dashboard** with real-time updates
- Employee Directory & Profiles
- Smart Onboarding/Offboarding Workflows
- Leave & Attendance Management
- Task Management & Notifications
- Applicant Tracking System (ATS)
- Buddy System Integration
- Multi-tenant SaaS Architecture

## Tech Stack
- **Frontend:** React/Next.js + Framer Motion
- **Backend:** Node.js/Express + Socket.io
- **Database:** PostgreSQL
- **Real-time:** WebSocket connections
- **Auth:** NextAuth.js
- **Payments:** Razorpay
- **Storage:** AWS S3/Cloudflare R2

## Project Structure
```
├── frontend/          # React/Next.js application
├── backend/           # Node.js/Express API
├── database/          # Schema, migrations, seeds
└── docs/              # Documentation and specs
```

## Quick Start
1. Clone repository
2. Run `start-dev.bat` (installs dependencies & starts servers)
3. Visit http://localhost:3000/employee-dashboard
4. Experience the enhanced dashboard with:
   - Real-time notifications
   - Task management
   - Dark mode support
   - Smooth animations

## New Dashboard Features
- 🔔 **Real-time Notifications** with WebSocket updates
- 📋 **Task Center** with smart task management
- 👥 **Buddy System** integration
- 🌙 **Dark Mode** with smooth transitions
- 📊 **Animated Progress Bars** and micro-interactions
- ⚡ **Single API Call** for <1.5s load times

See [DASHBOARD_FEATURES.md](./DASHBOARD_FEATURES.md) for detailed documentation.

## Target Market
- Indian tech startups (10-50 employees)
- Budget: <$200/mo infrastructure
- Goal: $0-10K MRR
- Timeline: MVP in 3-4 months

## Pricing
- **Free:** Up to 5 employees
- **Core HR:** ₹60/employee/month
- **Growth:** ₹100/employee/month