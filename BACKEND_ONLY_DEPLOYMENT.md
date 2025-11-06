# 🔧 Backend-Only Deployment Guide

## Scenario: Separate Frontend & Backend Deployments

Your wife is deploying the frontend separately. You're deploying just the backend as an API.

---

## 📋 Architecture

```
[Her Frontend (Vercel/Netlify)]  ──API calls──>  [Your Backend (Vercel)]
   - UI/UX                                          - API routes
   - React components                               - Google Calendar
   - Styling                                        - Google Sheets
                                                    - SMS reminders
```

---

## 🚀 Quick Deploy Steps

### 1. Deploy Backend API to Vercel

```bash
cd /Users/pedro/Documents/Websites/miosotys-spa-booking
vercel --prod
```

You'll get a URL like: `https://miosotys-api.vercel.app`

### 2. Add Environment Variables

In Vercel Dashboard > Settings > Environment Variables:

```bash
# Required
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_URL=https://your-backend-url.vercel.app
GOOGLE_CLIENT_ID=1015858088191-sqigfia8tdb947rn75nan41bthh4lpqj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://your-backend-url.vercel.app/api/auth/callback
ALLOWED_ADMIN_EMAILS=myosotisbymo@gmail.com,hello@ubushi.com
TWILIO_ACCOUNT_SID=AC29615b0d93470986c60eb08665dc4a74
TWILIO_AUTH_TOKEN=5865d77a21347f4a0bc295379b3ff6cd
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
PAYMENT_BANK=Bancolombia
PAYMENT_TYPE=Llave Brilla
PAYMENT_KEY=3213582608
PAYMENT_HOLDER=Pedro
DATABASE_URL=<your-database-url>
CRON_API_KEY=miosotys-cron-secret-key-2025-whatsapp-automation
```

### 3. Update CORS for Her Frontend

Once she gives you her frontend URL, update `next.config.js`:

```javascript
{
  key: "Access-Control-Allow-Origin",
  value: "https://her-frontend-url.vercel.app"
}
```

Then redeploy: `vercel --prod`

---

## 📡 API Endpoints Available

Once deployed, your backend provides these endpoints:

### Booking
```bash
POST https://your-backend.vercel.app/api/calendar/book
```

### Authentication
```bash
GET https://your-backend.vercel.app/api/auth/signin
POST https://your-backend.vercel.app/api/auth/callback
```

### Calendar
```bash
GET https://your-backend.vercel.app/api/calendar/availability
GET https://your-backend.vercel.app/api/calendar/appointments
```

### Admin (Protected)
```bash
GET https://your-backend.vercel.app/api/admin/*
```

### Cron (Protected with API Key)
```bash
GET https://your-backend.vercel.app/api/cron/get-reminders
POST https://your-backend.vercel.app/api/cron/mark-reminder-sent
```

---

## 👩‍💻 For Your Wife's Frontend

She needs to call your API like this:

```javascript
// In her frontend code
const API_URL = 'https://your-backend.vercel.app';

// Example: Create booking
async function createBooking(bookingData) {
  const response = await fetch(`${API_URL}/api/calendar/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
  });

  return await response.json();
}

// Example: Get availability
async function getAvailability(date) {
  const response = await fetch(
    `${API_URL}/api/calendar/availability?date=${date}`
  );

  return await response.json();
}
```

---

## 🔐 Security Configuration

### CORS is Configured
- `next.config.js` now allows external origins
- Set to `*` for development
- Update to her specific domain for production

### Protected Endpoints
- Admin routes require OAuth login
- Cron routes require `x-api-key` header
- All authentication handled server-side

---

## 🤝 Connecting Frontend & Backend

### Step 1: Share Your Backend URL
Give her: `https://your-backend.vercel.app`

### Step 2: She Updates Her API_URL
In her `.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

### Step 3: She Makes API Calls
Her components call your endpoints:
```javascript
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calendar/book`, {...})
```

### Step 4: Update CORS
Once you know her URL, update CORS to only allow her domain.

---

## 🔄 SMS Bot Deployment

The SMS bot needs your **backend URL** too:

### Railway.app Environment Variables:
```bash
VERCEL_API_URL=https://your-backend.vercel.app
CRON_API_KEY=miosotys-cron-secret-key-2025-whatsapp-automation
PORT=3000
ENABLE_AUTO_REMINDERS=true
TWILIO_ACCOUNT_SID=AC29615b0d93470986c60eb08665dc4a74
TWILIO_AUTH_TOKEN=5865d77a21347f4a0bc295379b3ff6cd
USE_SMS=true
TWILIO_PHONE_NUMBER=+19896013761
MIOSOTYS_CONTACT_NUMBER="333 722 4223"
```

Deploy to Railway:
1. Create new project
2. Connect GitHub or upload folder
3. Add env vars
4. Deploy!

---

## ✅ Testing the Setup

### Test Your Backend
```bash
# Health check
curl https://your-backend.vercel.app/api/health

# Test booking (use real data)
curl -X POST https://your-backend.vercel.app/api/calendar/book \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-10",
    "time": "10:00 AM",
    "service": {
      "name": "Test Service",
      "price": 100000,
      "duration": 60
    },
    "customerInfo": {
      "name": "Test User",
      "phone": "3213582608",
      "email": "test@example.com"
    }
  }'
```

### Test From Her Frontend
She can test with:
```javascript
fetch('https://your-backend.vercel.app/api/calendar/availability?date=2025-11-10')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🐛 Common Issues

### CORS Error
**Error**: "Access to fetch has been blocked by CORS policy"

**Fix**: Update `next.config.js` with her frontend URL:
```javascript
{ key: "Access-Control-Allow-Origin", value: "https://her-url.vercel.app" }
```

### 404 on API Routes
**Error**: "404 Not Found"

**Fix**: Ensure you're calling `/api/...` not just `/...`

### Authentication Not Working
**Error**: "Unauthorized"

**Fix**:
1. Check `NEXTAUTH_URL` is set correctly
2. Update Google OAuth redirect URIs
3. Ensure cookies are enabled

---

## 📊 Monitoring

### Vercel Dashboard
- Logs: Dashboard > Deployments > [latest] > Logs
- Functions: Dashboard > Functions
- Analytics: Dashboard > Analytics

### Test Endpoints
```bash
# Backend health
curl https://your-backend.vercel.app/api/health

# SMS bot health
curl https://your-bot.railway.app/health
```

---

## 🎯 Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] All environment variables set
- [ ] CORS configured
- [ ] Backend URL shared with wife
- [ ] Google OAuth redirect updated
- [ ] SMS bot deployed with correct API URL
- [ ] Test booking works
- [ ] Test SMS sends
- [ ] Google Calendar syncs
- [ ] Google Sheets logs data

---

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode URLs
2. **Version Your API**: Consider `/api/v1/...` for future updates
3. **Monitor Logs**: Check Vercel logs regularly
4. **Rate Limiting**: Consider adding rate limits for production
5. **Error Handling**: Make sure errors return helpful messages

---

You're ready to deploy! 🚀

Your backend is completely independent and ready to serve her frontend.
