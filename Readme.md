# 📊 D2C Performance Dashboard - Restructured

## 🎯 Overview

A clean, modern SaaS dashboard for D2C merchants to track their e-commerce performance across 4 key sections:

1. **Main Dashboard** - Core business metrics (Cash Flow, Net Profit, ROI, etc.)
2. **Ads Data** - Marketing performance (CAC, ROAS, MER, CTR, etc.)
3. **Website Data** - Site performance (AOV, CVR, Engagement, ATC Rate, etc.)
4. **Cost Centre** - Manual cost tracking (Shipping, Packaging, Salaries, etc.)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Start backend
npm run server

# 4. Start frontend (new terminal)
npm run dev

# 5. Open browser
http://localhost:3000
```

---

## 📋 What's New

### ✅ **Restructured into 4 Sections**

Previously: 12-metric single dashboard
Now: 4 organized sections with 25+ metrics

### ✅ **Clean Backend**

Removed: Old metrics calculation logic, unused services
Kept: Auth, OAuth, Integrations
Added: New dashboard routes with mock data

### ✅ **Cost Tracking**

Users can now manually add/edit/delete costs:
- Shipping
- Packaging  
- Commissions
- Salaries
- Ad Spend
- Tools
- Other

### ✅ **Mock Data from Backend**

All mock data now comes from backend API endpoints (not hardcoded in frontend)

---

## 📊 The 4 Sections

### 1. Main Dashboard

**Metrics:**
- Cash Flow - $45,230 ↑ 12.5%
- Net Profit - $18,920 ↑ 8.3%
- ROI - 245% ↑ 15.2%
- Gross Margin - 58.5% ↑ 2.1%
- Total Orders - 1,847 ↑ 18.7%
- Ad Spend - $12,450 ↓ 5.2%
- Total Revenue - $87,630 ↑ 14.3%

Each metric includes:
- Current value
- Week-over-week (WoW) change
- 30-day trendline

### 2. Ads Data

**Metrics:**
- Max CAC - $45.50 (max allowable customer acquisition cost)
- CAC - $32.80 ↓ 8.5%
- MPAS - $24,850 ↑ 22.3% (marketing profit after spend)
- MER - 7.04x ↑ 18.9% (marketing efficiency ratio)
- SPE - $6.74 ↓ 12.1% (spend per event/purchase)
- ROAS - 6.04x ↑ 19.3%
- Break-even ROAS - 2.5x
- CTR - 2.87% ↑ 14.8%
- CPC - $0.84 ↓ 18.4%
- CPM - $12.45 ↓ 6.2%

### 3. Website Data

**Metrics:**
- AOV - $47.45 ↑ 5.3%
- Conversion Rate - 3.42% ↑ 12.8%
- Engagement Rate - 58.7% ↑ 8.4%
- ATC Rate - 12.8% ↑ 15.2%
- Repeat Purchase Rate - 24.3% ↑ 18.9%
- Refund Rate - 2.8% ↓ 15.2%
- Customer Mix - New: 68.5% | Returning: 31.5%
- Ads Traffic - Returning: 22.4% | Unique: 77.6%

### 4. Cost Centre

**Features:**
- Add costs manually
- Track by category
- Set frequency (monthly/yearly/one-time)
- Add notes
- View total monthly costs
- Edit/delete costs

**Default Categories:**
- Shipping
- Packaging
- Commissions
- Salaries
- Ad Spend
- Tools
- Other

---

## 🏗️ Project Structure

```
d2c-dashboard/
├── server/
│   ├── index.js                 # Main server (cleaned up)
│   ├── models/
│   │   └── User.js             # Updated with costs field
│   ├── routes/
│   │   ├── auth.js             # Authentication (kept)
│   │   ├── oauth.js            # OAuth integrations (kept)
│   │   └── dashboard.js        # NEW: 4 section endpoints
│   └── middleware/
│       └── auth.js             # JWT middleware (kept)
│
├── pages/
│   ├── index.js                # Landing page
│   ├── login.js                # Login page
│   ├── signup.js               # Signup page
│   ├── dashboard.js            # NEW: 4-section dashboard
│   └── integrations.js         # OAuth connections
│
└── styles/
    ├── Dashboard.module.css    # NEW: Modern dashboard styles
    ├── Auth.module.css
    └── Integrations.module.css
```

---

## 🔌 API Endpoints

### Auth (Public)
```
POST   /api/auth/signup       # Create account
POST   /api/auth/login        # Login
```

### OAuth (Protected)
```
GET    /api/oauth/facebook/url      # Get Facebook OAuth URL
POST   /api/oauth/facebook/callback # Handle Facebook callback
GET    /api/oauth/google/url        # Get Google OAuth URL  
POST   /api/oauth/google/callback   # Handle Google callback
GET    /api/oauth/status            # Get connection status
DELETE /api/oauth/:platform/disconnect # Disconnect platform
```

### Dashboard (Protected)
```
GET    /api/dashboard/main     # Main dashboard metrics
GET    /api/dashboard/ads      # Ads performance metrics
GET    /api/dashboard/website  # Website performance metrics
GET    /api/dashboard/costs    # Get all costs
POST   /api/dashboard/costs    # Add new cost
PUT    /api/dashboard/costs/:id # Update cost
DELETE /api/dashboard/costs/:id # Delete cost
```

---

## 💾 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  company: String,
  
  // OAuth credentials
  apiCredentials: {
    shopify: { ... },
    meta: { ... },
    ga4: { ... },
    googleAds: { ... }
  },
  
  // NEW: Cost tracking
  costs: {
    items: [{
      category: String,
      amount: Number,
      frequency: String, // monthly/yearly/one-time
      notes: String,
      createdAt: Date
    }],
    totalMonthly: Number
  },
  
  createdAt: Date,
  lastLogin: Date
}
```

---

## 🎨 Features

### ✅ **Tab Navigation**
Clean tab interface to switch between 4 sections

### ✅ **Real-time Updates**
Fetch fresh data on every section switch

### ✅ **WoW Indicators**
Green ↑ for positive, Red ↓ for negative changes

### ✅ **Trendlines**
SVG sparklines showing 30-day trends

### ✅ **Cost Management**
Full CRUD for cost tracking:
- Create: Add new costs
- Read: View all costs + total
- Update: Edit existing costs (TODO)
- Delete: Remove costs

### ✅ **Responsive Design**
Mobile-friendly layouts

### ✅ **Mock Data**
All data comes from backend API (ready to replace with real integrations)

---

## 🔄 Data Flow

```
User logs in
    ↓
Selects section (Main/Ads/Website/Costs)
    ↓
Frontend calls API endpoint
    ↓
Backend returns mock data (or real data from integrations)
    ↓
Frontend renders metrics with trendlines
```

---

## 🚀 Next Steps

### For Real Data Integration:

**Option 1: Use existing OAuth connections**
- Users connect Facebook/Google accounts in /integrations
- Replace mock data in dashboard.js routes with real API calls
- Use user's connected accounts (stored in user.apiCredentials)

**Option 2: Keep mock data**
- Perfect for demos
- No API setup needed
- Fast development

### To Add Real Data:

1. **Main Dashboard**
   - Calculate from Shopify orders + Meta/Google ad spend
   - Cash Flow = Revenue - Total Costs
   - Net Profit = Revenue - (Ad Spend + Costs)
   - ROI = (Revenue - Total Costs) / Total Costs × 100

2. **Ads Data**
   - Fetch from Meta/Google Ads APIs
   - Use connected accounts in user.apiCredentials.meta / .googleAds

3. **Website Data**
   - Fetch from GA4 / Shopify
   - Use connected accounts in user.apiCredentials.ga4 / .shopify

4. **Costs**
   - Already real! Stored in MongoDB per user

---

## 📝 Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_secret_here

# OAuth (optional, for real integrations)
META_APP_ID=...
META_APP_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check MongoDB connection
# Make sure MONGODB_URI is set in .env
```

### Can't see dashboard
```bash
# Make sure you're logged in
# Check localStorage has 'token' and 'user'
```

### Costs not saving
```bash
# Check MongoDB connection
# Look at server logs for errors
```

---

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - Getting started guide
- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Authentication system
- **[FACEBOOK_SETUP.md](./FACEBOOK_SETUP.md)** - Facebook OAuth
- **[GOOGLE_SETUP.md](./GOOGLE_SETUP.md)** - Google OAuth
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues

---

## ✅ What Was Removed

### Backend:
- ❌ `/server/services/shopify.js`
- ❌ `/server/services/ga4.js`
- ❌ `/server/services/meta.js`
- ❌ `/server/services/googleAds.js`
- ❌ `/server/utils/calculations.js`
- ❌ Old `/api/metrics` endpoint
- ❌ Old `/api/export` endpoint

### Why?
These will be replaced when you're ready to connect real APIs. For now, mock data in dashboard.js routes is cleaner and easier to customize.

---

## ✅ What Was Kept

### Backend:
- ✅ `/server/routes/auth.js` - Signup/Login
- ✅ `/server/routes/oauth.js` - Facebook/Google OAuth
- ✅ `/server/middleware/auth.js` - JWT protection
- ✅ `/server/models/User.js` - User database model

### Frontend:
- ✅ `/pages/login.js` - Login page
- ✅ `/pages/signup.js` - Signup page
- ✅ `/pages/integrations.js` - OAuth connections

---

## 🎯 Summary

**Before:** Complex single dashboard with mixed metrics
**After:** Clean 4-section dashboard with organized metrics

**Before:** Real API integrations (complex setup)
**After:** Mock data from backend (easy customization)

**Before:** No cost tracking
**After:** Full cost management system

**Before:** Hard to extend
**After:** Easy to add new metrics or sections

---

## 🚀 Ready to Deploy?

```bash
# Test locally first
npm run server
npm run dev

# Then deploy:
# - Backend: Railway, Render, Heroku
# - Frontend: Vercel, Netlify
# - Database: MongoDB Atlas (already set up!)
```

---

**Built with ❤️ for D2C merchants**

**Need help?** Check TROUBLESHOOTING.md or START_HERE.md