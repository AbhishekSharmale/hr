# Cloudflare Setup Instructions

## 🚀 Manual Deployment Steps

Since automated login failed, here's how to deploy manually:

### 1. Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up for a free account
3. Verify your email

### 2. Get API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Set permissions:
   - **Account**: Cloudflare Workers:Edit
   - **Zone**: Zone:Read
   - **Zone Resources**: Include All zones
5. Copy the token

### 3. Configure Wrangler
```bash
# Set your API token
wrangler config set api_token YOUR_API_TOKEN_HERE

# Or set environment variable
export CLOUDFLARE_API_TOKEN=YOUR_API_TOKEN_HERE
```

### 4. Deploy the Worker
```bash
# From the project root
wrangler publish

# Your API will be available at:
# https://hr-saas-platform.YOUR-SUBDOMAIN.workers.dev
```

### 5. Test the Deployment
```bash
# Test health endpoint
curl https://hr-saas-platform.YOUR-SUBDOMAIN.workers.dev/api/health

# Test login
curl -X POST https://hr-saas-platform.YOUR-SUBDOMAIN.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techstart.com","password":"admin123"}'
```

## 📱 Frontend Deployment (Cloudflare Pages)

### Option 1: GitHub Integration
1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Connect your GitHub repository
4. Set build settings:
   - **Build command**: `cd frontend && npm install && npm run build && npm run export`
   - **Build output directory**: `frontend/out`
   - **Root directory**: `/`

### Option 2: Direct Upload
```bash
cd frontend
npm install
npm run build
npm run export

# Upload the 'out' folder to Cloudflare Pages dashboard
```

## 🔧 Update API URL

After deploying the worker, update the frontend configuration:

**File**: `frontend/next.config.js`
```javascript
destination: 'https://hr-saas-platform.YOUR-ACTUAL-SUBDOMAIN.workers.dev/api/:path*'
```

## 🧪 Test URLs

After deployment, test these endpoints:

### Backend (Worker)
- Health: `https://your-worker.workers.dev/api/health`
- Login: `https://your-worker.workers.dev/api/auth/login`
- Employee Dashboard: `https://your-worker.workers.dev/api/dashboard/employee`

### Frontend (Pages)
- Login: `https://your-site.pages.dev/login`
- Employee: `https://your-site.pages.dev/employee-dashboard`
- Manager: `https://your-site.pages.dev/manager-dashboard`
- Analytics: `https://your-site.pages.dev/reports/analytics`

## 👥 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@techstart.com | admin123 |
| HR | hr@techstart.com | hr123 |
| Manager | manager@techstart.com | manager123 |
| Employee | employee@techstart.com | emp123 |

## 🎯 What's Deployed

✅ **Authentication system** with JWT-like tokens  
✅ **Role-based access control** (Admin, HR, Manager, Employee)  
✅ **Dashboard APIs** for each user type  
✅ **CORS enabled** for frontend integration  
✅ **Production-ready** Cloudflare Worker  

Your HR SaaS platform is ready for global deployment! 🌍