# 🚀 Miosotys Spa - Backend Deployment Guide

## Overview
This guide covers deploying **ONLY the backend** to Vercel while your wife continues working on the frontend locally. The backend includes:
- API routes (`src/app/api/`)
- Authentication (`src/auth.ts`)
- Database logic (`src/lib/`)
- Google Calendar integration
- SMS reminder system

## ⚠️ Important: Frontend Safety
Your wife's frontend work (CSS, components, UI) will **NOT** be affected. We're only deploying backend functionality.

---

## 📋 Prerequisites

### 1. Vercel Account
- Sign up at https://vercel.com (free tier works great)
- Install Vercel CLI: `npm install -g vercel`

### 2. Google Cloud Setup
Already done! Your credentials:
- Project: `miosotys-spa-booking`
- Calendar API: ✅ Enabled
- OAuth credentials: ✅ Created

### 3. Twilio Account
Already configured with SMS working!

---

## 🔐 Step 1: Environment Variables

### Create Production .env

In Vercel Dashboard > Your Project > Settings > Environment Variables, add:

```bash
# NextJS
NEXTAUTH_SECRET=<generate using: openssl rand -base64 32>
NEXTAUTH_URL=https://your-project.vercel.app

# Google OAuth (same as local)
GOOGLE_CLIENT_ID=1015858088191-sqigfia8tdb947rn75nan41bthh4lpqj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://your-project.vercel.app/api/auth/callback

# Admin Emails
ALLOWED_ADMIN_EMAILS=myosotisbymo@gmail.com,hello@ubushi.com

# Twilio (same as local - already working!)
TWILIO_ACCOUNT_SID=AC29615b0d93470986c60eb08665dc4a74
TWILIO_AUTH_TOKEN=5865d77a21347f4a0bc295379b3ff6cd
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Payment Info
PAYMENT_BANK=Bancolombia
PAYMENT_TYPE=Llave Brilla
PAYMENT_KEY=3213582608
PAYMENT_HOLDER=Pedro

# Database (see Step 2)
DATABASE_URL=<your-vercel-postgres-url>

# Cron Security
CRON_API_KEY=miosotys-cron-secret-key-2025-whatsapp-automation
```

---

## 💾 Step 2: Database Setup (Vercel Postgres)

### Option A: Vercel Postgres (Recommended - Free tier available)

1. Go to Vercel Dashboard > Storage > Create Database
2. Select "Postgres"
3. Name it "miosotys-spa-db"
4. Vercel automatically adds `DATABASE_URL` to your environment variables

### Option B: Keep Using SQLite (Not recommended for production)

If you want to test first:
```bash
DATABASE_URL="file:./dev.db"
```
But this won't persist across deployments!

---

## 📦 Step 3: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

```bash
# Navigate to project
cd /Users/pedro/Documents/Websites/miosotys-spa-booking

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Method 2: Using GitHub

1. Push your code to GitHub (private repo recommended)
2. Import project in Vercel Dashboard
3. Connect repository
4. Add environment variables
5. Deploy!

---

## 🤖 Step 4: Deploy SMS Bot

The WhatsApp bot (`miosotys-whatsapp-bot/`) needs to run 24/7:

### Option A: Railway.app (Free tier - Recommended)

1. Go to https://railway.app
2. New Project > Deploy from GitHub
3. Select `miosotys-whatsapp-bot` folder
4. Add environment variables:
   ```
   VERCEL_API_URL=https://your-project.vercel.app
   CRON_API_KEY=miosotys-cron-secret-key-2025-whatsapp-automation
   PORT=3000
   ENABLE_AUTO_REMINDERS=true
   TWILIO_ACCOUNT_SID=AC29615b0d93470986c60eb08665dc4a74
   TWILIO_AUTH_TOKEN=5865d77a21347f4a0bc295379b3ff6cd
   USE_SMS=true
   TWILIO_PHONE_NUMBER=+19896013761
   MIOSOTYS_CONTACT_NUMBER="333 722 4223"
   ```
5. Deploy!

### Option B: DigitalOcean App Platform

1. Create new app
2. Upload code or connect GitHub
3. Set environment variables
4. Deploy!

---

## ✅ Step 5: Verify Deployment

### Test Backend APIs

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Test booking (use real phone for SMS test)
curl -X POST https://your-project.vercel.app/api/calendar/book \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-07",
    "time": "10:00 AM",
    "service": {"name": "Test", "price": 100000, "duration": 60},
    "customerInfo": {
      "name": "Test User",
      "phone": "3213582608",
      "email": "test@example.com"
    }
  }'
```

### Test SMS Bot

```bash
# Check bot health
curl https://your-bot-url.railway.app/health

# Manual trigger (testing)
curl -X POST https://your-bot-url.railway.app/trigger-reminders \
  -H "Content-Type: application/json" \
  -d '{"type":"24h"}'
```

---

## 🔄 Step 6: Update Google OAuth

Update OAuth redirect URIs in Google Cloud Console:

1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://your-project.vercel.app/api/auth/callback
   ```
4. Save

---

## 🎨 Working with Frontend Developer (Your Wife)

### Her Local Setup Stays The Same

She continues working locally with:
```bash
cd /Users/pedro/Documents/Websites/miosotys-spa-booking
npm run dev
```

### Her Changes Are Safe

These files are **frontend only** (she can edit freely):
- `src/app/page.jsx` - Homepage
- `src/app/globals.css` - Global styles
- `src/app/page.css` - Page-specific styles
- `src/components/**/*.jsx` - UI components
- `src/components/**/*.css` - Component styles

### When She's Ready to Deploy

1. She commits her frontend changes
2. You merge with backend
3. Run `vercel --prod` to deploy everything

---

## 📊 Monitoring

### Vercel Dashboard
- View logs: Dashboard > Your Project > Deployments > [latest] > Logs
- See analytics: Dashboard > Analytics
- Check functions: Dashboard > Functions

### Bot Monitoring

Railway/DigitalOcean:
- View logs in dashboard
- Set up alerts for downtime
- Monitor SMS usage in Twilio console

---

## 🚨 Troubleshooting

### "API route not found"
- Check `vercel.json` is present
- Verify all API files are in `src/app/api/`

### "Database connection failed"
- Verify `DATABASE_URL` in environment variables
- Run prisma migration: `npx prisma migrate deploy`

### "Google Auth not working"
- Update redirect URIs in Google Console
- Check `NEXTAUTH_URL` matches your domain

### "SMS not sending"
- Verify Twilio credentials
- Check bot is running: `curl https://bot-url/health`
- Verify `VERCEL_API_URL` points to production

---

## 🎯 Quick Checklist

- [ ] Vercel account created
- [ ] Environment variables added to Vercel
- [ ] Database connected (Vercel Postgres)
- [ ] Google OAuth redirect updated
- [ ] Backend deployed to Vercel
- [ ] SMS bot deployed to Railway/DO
- [ ] Test booking creates appointment
- [ ] Test SMS sends successfully
- [ ] Google Calendar shows appointment
- [ ] Google Sheets logs appointment

---

## 📞 Support

Issues? Check:
1. Vercel logs
2. Bot logs (Railway/DO dashboard)
3. Twilio console for SMS errors
4. Google Sheets for appointment tracking

---

## 🔒 Security Notes

- ✅ All secrets in environment variables (not in code)
- ✅ `.env.local` in `.gitignore`
- ✅ CRON_API_KEY protects reminder endpoints
- ✅ OAuth protects admin dashboard
- ✅ CORS configured for your domain only

---

You're ready to go live! 🚀
