# Local Development Setup Guide

Quick guide to run the Miosotys Spa backend on your local machine.

---

## Prerequisites

### Required Software

```bash
# Check if you have Node.js (need version 18+ or 20+)
node --version

# Check if you have npm
npm --version

# Check if you have Git
git --version
```

If you don't have Node.js, download from: https://nodejs.org/

---

## Step 1: Get the Code

```bash
# Navigate to the project folder
cd /Users/pedro/Documents/Websites/miosotys-spa-booking

# Or if you received this as a zip, extract it first
# Then navigate to the extracted folder
```

---

## Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - Next.js (web framework)
# - Prisma (database)
# - Google APIs
# - Twilio SDK
# - And more...
```

Wait for installation to complete (may take 1-3 minutes).

---

## Step 3: Set Up Environment Variables

### Option A: Use Existing .env.local (If Pedro provided it)

If Pedro gave you a `.env.local` file with credentials, you're all set! Skip to Step 4.

### Option B: Create Your Own

Create a file named `.env.local` in the project root:

```bash
# Copy the example file
cp .env.local.example .env.local

# Then edit it with your text editor
```

Add these values to `.env.local`:

```bash
# Next.js Configuration
NEXT_DISABLE_DEV_OVERLAY=true
NEXTAUTH_SECRET="any-random-string-at-least-32-characters-long"
NEXTAUTH_URL="http://localhost:3002"

# Google OAuth (ask Pedro for these credentials)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3002/api/auth/callback"

# Admin Emails
ALLOWED_ADMIN_EMAILS="myosotisbymo@gmail.com,hello@ubushi.com"

# Twilio SMS (ask Pedro for these credentials)
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"

# Payment Information
PAYMENT_BANK="Bancolombia"
PAYMENT_TYPE="Llave Brilla"
PAYMENT_KEY="3213582608"
PAYMENT_HOLDER="Pedro"

# Database (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# Cron Security
CRON_API_KEY="miosotys-cron-secret-key-2025-whatsapp-automation"
```

**Important**: Ask Pedro for Google and Twilio credentials if you don't have them.

---

## Step 4: Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev

# Optional: Seed database with sample data
npm run db:seed
```

---

## Step 5: Start the Backend Server

```bash
# Start development server
npm run dev
```

You should see:

```
✓ Ready in 2.5s
○ Local:    http://localhost:3002
```

**The backend is now running!** 🎉

---

## Step 6: Verify It's Working

### Test 1: Health Check

Open a new terminal window and run:

```bash
curl http://localhost:3002/api/health
```

Expected response: `{"status":"ok"}`

### Test 2: Check Availability

```bash
curl "http://localhost:3002/api/calendar/availability?date=2025-11-15"
```

Should return available time slots.

### Test 3: Open in Browser

Visit: http://localhost:3002

You should see the homepage (might be basic - your job is to make it beautiful!).

---

## Common Issues & Solutions

### Issue: Port 3002 Already in Use

**Error**: `EADDRINUSE: address already in use :::3002`

**Solution**:
```bash
# Kill any process using port 3002
lsof -ti:3002 | xargs kill -9

# Then try again
npm run dev
```

### Issue: Missing Dependencies

**Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma Errors

**Error**: `PrismaClient is unable to run in this browser environment`

**Solution**:
```bash
# Regenerate Prisma client
npx prisma generate

# Restart server
npm run dev
```

### Issue: Google Credentials Not Working

**Error**: `Google API authentication failed`

**Solution**: Ask Pedro for the correct credentials. The Google Cloud project must have Calendar API enabled and OAuth configured.

### Issue: Database Not Found

**Error**: `Can't reach database server at ...`

**Solution**:
```bash
# Delete old database
rm -f prisma/dev.db

# Recreate
npx prisma migrate dev
```

---

## Project Structure

```
miosotys-spa-booking/
├── src/
│   ├── app/
│   │   ├── api/              ← Backend API routes (don't modify)
│   │   ├── page.jsx          ← Homepage (you can modify)
│   │   └── globals.css       ← Global styles (you can modify)
│   ├── components/           ← UI components (create your own!)
│   └── lib/                  ← Backend logic (don't modify)
├── prisma/
│   ├── schema.prisma         ← Database schema
│   └── dev.db                ← SQLite database (created after migrate)
├── .env.local                ← Environment variables (your secrets)
├── package.json              ← Dependencies
└── README.md                 ← Project documentation
```

---

## Development Workflow

### 1. Keep Backend Running

Always keep `npm run dev` running in one terminal window.

### 2. Work on Your Frontend

In another terminal or your code editor:
- Edit `src/app/page.jsx`
- Edit `src/app/globals.css`
- Create new components in `src/components/`

### 3. Test Your Changes

The dev server has hot reload - changes appear automatically in your browser.

### 4. Call Backend APIs

From your frontend code:

```javascript
// Example: Get availability
const response = await fetch('http://localhost:3002/api/calendar/availability?date=2025-11-15');
const data = await response.json();
console.log(data.availableSlots);
```

---

## Useful Commands

```bash
# Start backend
npm run dev

# View database in GUI
npx prisma studio

# Run database migrations
npx prisma migrate dev

# Seed database with test data
npm run db:seed

# Format code
npm run format

# Check for errors
npm run lint
```

---

## Database Management

### View Data in Browser

```bash
# Start Prisma Studio (database GUI)
npx prisma studio
```

Opens at: http://localhost:5555

Here you can:
- View all appointments
- Add/edit/delete data
- Inspect tables

### Reset Database

```bash
# Delete all data and recreate tables
npx prisma migrate reset

# Reseed with test data
npm run db:seed
```

---

## Testing the Booking System

### Test Booking via Terminal

```bash
curl -X POST http://localhost:3002/api/calendar/book \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-20",
    "time": "10:00 AM",
    "service": {
      "name": "Masaje Relajante",
      "price": 150000,
      "duration": 60
    },
    "customerInfo": {
      "name": "Test User",
      "phone": "3213582608",
      "email": "test@example.com"
    }
  }'
```

### Test from Browser Console

1. Open http://localhost:3002
2. Press F12 (open DevTools)
3. Go to Console tab
4. Paste:

```javascript
fetch('http://localhost:3002/api/calendar/book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2025-11-20',
    time: '10:00 AM',
    service: { name: 'Test Service', price: 100000, duration: 60 },
    customerInfo: { name: 'Test', phone: '3213582608', email: 'test@test.com' }
  })
})
  .then(res => res.json())
  .then(data => console.log('Success!', data));
```

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXTAUTH_SECRET` | Secures authentication sessions | Any random string (32+ chars) |
| `NEXTAUTH_URL` | Your backend URL | `http://localhost:3002` |
| `GOOGLE_CLIENT_ID` | Google OAuth app ID | `xyz.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Ask Pedro |
| `TWILIO_ACCOUNT_SID` | Twilio account identifier | Ask Pedro |
| `TWILIO_AUTH_TOKEN` | Twilio API token | Ask Pedro |
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `CRON_API_KEY` | Protects cron endpoints | Any secret string |

---

## Next Steps

1. ✅ Backend is running on http://localhost:3002
2. 📖 Read `FRONTEND_INTEGRATION.md` for API examples
3. 📖 Read `CLAUDE_CODE_INSTRUCTIONS.md` for Claude Code specific guidance
4. 🎨 Start building your beautiful UI!
5. 🔗 Make API calls from your frontend components

---

## Getting Help

### Check Logs

The terminal where you ran `npm run dev` shows all backend activity:
- API requests
- Database queries
- Errors and warnings

### Common Questions

**Q: Can I change the port?**
A: Yes! Add `PORT=3003` to your `.env.local` and run `npm run dev -- -p 3003`

**Q: Do SMS actually send?**
A: Yes, if Twilio credentials are correct. Check terminal for "SMS sent" messages.

**Q: Where is data stored?**
A: In `prisma/dev.db` (SQLite database). Use `npx prisma studio` to view it.

**Q: Can I modify API routes?**
A: It's best to leave them alone since Pedro manages the backend. Focus on the frontend!

---

## Quick Reference

```bash
# Start everything
npm install          # First time only
npm run dev         # Every time you work

# View database
npx prisma studio

# Reset if issues
rm -rf node_modules .next prisma/dev.db
npm install
npx prisma migrate dev
npm run dev
```

---

You're all set! Backend is running - now make the frontend amazing! 🚀

For detailed API integration examples, see `FRONTEND_INTEGRATION.md`.
