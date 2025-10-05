# Cloudflare Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 2. Deploy Backend (Cloudflare Workers)
```bash
# Deploy the worker
wrangler publish

# Your API will be available at:
# https://hr-saas-platform.your-subdomain.workers.dev
```

### 3. Deploy Frontend (Cloudflare Pages)
```bash
cd frontend
npm run build
npm run export

# Upload the 'out' folder to Cloudflare Pages
# Or connect your GitHub repo to auto-deploy
```

### 4. Update API URL
Update `frontend/next.config.js` with your actual worker URL:
```javascript
destination: 'https://hr-saas-platform.YOUR-SUBDOMAIN.workers.dev/api/:path*'
```

## 👥 Demo Users

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin** | admin@techstart.com | admin123 | Full access to all features |
| **HR Manager** | hr@techstart.com | hr123 | Analytics, employee management |
| **Manager** | manager@techstart.com | manager123 | Team dashboard, reviews |
| **Employee** | employee@techstart.com | emp123 | Personal dashboard, tasks |

## 🔧 Environment Setup

### Backend Environment Variables
```bash
# In Cloudflare Workers dashboard, set:
ENVIRONMENT=production
```

### Frontend Environment Variables
```bash
# Create .env.local in frontend folder:
NEXT_PUBLIC_API_URL=https://your-worker-url.workers.dev
```

## 📱 Features by Role

### 🔹 Employee Dashboard
- Onboarding progress tracking
- Task and goal management
- Leave balance overview
- Buddy system integration
- Real-time notifications

### 🔹 Manager Dashboard  
- Direct reports overview
- Team progress analytics
- Onboarding reviews
- Goal assignment
- Pending actions tracking

### 🔹 HR/Admin Dashboard
- Company-wide analytics
- Hiring conversion funnel
- Department performance
- Export capabilities
- Trend analysis

## 🛡️ Security Features

- **JWT-like authentication** with role-based access
- **Route protection** based on user roles
- **Automatic redirects** to appropriate dashboards
- **Session management** with localStorage
- **CORS protection** for API endpoints

## 🌐 Production URLs

After deployment, your platform will be accessible at:
- **Frontend**: `https://your-site.pages.dev`
- **Backend API**: `https://hr-saas-platform.your-subdomain.workers.dev`

## 📊 Performance Benefits

- **Global CDN** via Cloudflare's edge network
- **Zero cold starts** with Cloudflare Workers
- **Instant loading** with static site generation
- **99.9% uptime** SLA from Cloudflare
- **Automatic scaling** based on traffic

## 🔄 CI/CD Setup

Connect your GitHub repository to Cloudflare Pages for automatic deployments:

1. Push code to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Set build command: `cd frontend && npm run build && npm run export`
4. Set output directory: `frontend/out`
5. Auto-deploy on every push to main branch

Your HR SaaS platform is now production-ready with enterprise-grade infrastructure! 🎉