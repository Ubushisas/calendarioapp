# Instructions for Claude Code AI Assistant

**Context**: You are helping a frontend developer integrate her work with an existing backend API for a spa booking application.

---

## Project Overview

This is the **BACKEND** for Miosotys Spa booking system. The frontend developer (your user) has been working on the UI/UX separately and now needs to integrate with this backend API.

### What This Backend Does

1. **Booking Management**: Creates appointments, syncs with Google Calendar, logs to Google Sheets
2. **SMS Reminders**: Sends automatic text message reminders 24h and 2h before appointments
3. **WhatsApp Confirmations**: Sends booking confirmations via WhatsApp
4. **Authentication**: OAuth-based admin access for managing appointments
5. **API Endpoints**: RESTful API for all booking operations

---

## Architecture

```
[Frontend (User's Work)]  ←→ HTTP API calls ←→  [This Backend]
                                                      ↓
                                               Google Calendar
                                               Google Sheets
                                               Twilio SMS
```

---

## Getting Started Locally

### Prerequisites

```bash
# Ensure you have Node.js installed
node --version  # Should be 18+ or 20+

# Ensure you have npm
npm --version
```

### Installation Steps

```bash
# 1. Navigate to the project
cd /Users/pedro/Documents/Websites/miosotys-spa-booking

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.local.example .env.local
# Then fill in the values (ask Pedro for credentials if needed)

# 4. Run database migrations
npx prisma generate
npx prisma migrate dev

# 5. Start the development server
npm run dev

# Backend will run on: http://localhost:3002
```

---

## API Endpoints Available

### 1. Create Booking

**Endpoint**: `POST /api/calendar/book`

**Purpose**: Creates a new spa appointment

**Example Request**:
```javascript
const response = await fetch('http://localhost:3002/api/calendar/book', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    date: '2025-11-10',           // Format: YYYY-MM-DD
    time: '10:00 AM',              // Format: HH:MM AM/PM
    service: {
      name: 'Masaje Relajante',
      price: 150000,               // Colombian Pesos
      duration: 60                 // Minutes
    },
    customerInfo: {
      name: 'María García',
      phone: '3213582608',         // 10-digit Colombian number
      email: 'maria@example.com'
    }
  })
});

const result = await response.json();
```

**Success Response**:
```json
{
  "success": true,
  "booking": {
    "id": "abc123",
    "confirmationMessage": "Gracias María! Tu cita está confirmada para 2025-11-10 a las 10:00 AM...",
    "calendarEventId": "google-calendar-event-id"
  }
}
```

### 2. Get Available Time Slots

**Endpoint**: `GET /api/calendar/availability?date=YYYY-MM-DD`

**Purpose**: Check which time slots are available for a specific date

**Example Request**:
```javascript
const response = await fetch(
  'http://localhost:3002/api/calendar/availability?date=2025-11-10'
);
const { availableSlots } = await response.json();
```

**Success Response**:
```json
{
  "availableSlots": [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM"
  ]
}
```

### 3. Get All Appointments

**Endpoint**: `GET /api/calendar/appointments`

**Purpose**: Retrieve all scheduled appointments (requires authentication)

**Example Request**:
```javascript
const response = await fetch('http://localhost:3002/api/calendar/appointments', {
  credentials: 'include'  // Important: includes auth cookies
});
const { appointments } = await response.json();
```

### 4. Admin Authentication

**Endpoint**: `GET /api/auth/signin`

**Purpose**: Initiates Google OAuth login flow for admin access

---

## Environment Variables You Need

Create a `.env.local` file with:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET="any-random-string-min-32-characters"
NEXTAUTH_URL="http://localhost:3002"

# Google OAuth (ask Pedro for these)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3002/api/auth/callback"

# Admin Emails
ALLOWED_ADMIN_EMAILS="myosotisbymo@gmail.com,hello@ubushi.com"

# Twilio SMS (ask Pedro for these)
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"

# Payment Info
PAYMENT_BANK="Bancolombia"
PAYMENT_TYPE="Llave Brilla"
PAYMENT_KEY="3213582608"
PAYMENT_HOLDER="Pedro"

# Database (for local development, SQLite works)
DATABASE_URL="file:./dev.db"

# Cron Security
CRON_API_KEY="miosotys-cron-secret-key-2025-whatsapp-automation"
```

---

## Frontend Integration Examples

### React/Next.js Component Example

```jsx
'use client';

import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    service: { name: '', price: 0, duration: 60 },
    customerInfo: { name: '', phone: '', email: '' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3002/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Booking confirmed!');
        console.log(result.booking.confirmationMessage);
      } else {
        alert('Booking failed: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your beautiful UI components here */}
    </form>
  );
}
```

### Checking Availability Before Booking

```jsx
const [availableSlots, setAvailableSlots] = useState([]);

const checkAvailability = async (date) => {
  const response = await fetch(
    `http://localhost:3002/api/calendar/availability?date=${date}`
  );
  const data = await response.json();
  setAvailableSlots(data.availableSlots);
};

// Use this in your date picker component
useEffect(() => {
  if (selectedDate) {
    checkAvailability(selectedDate);
  }
}, [selectedDate]);
```

---

## File Structure (Backend)

```
miosotys-spa-booking/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── calendar/
│   │   │   │   ├── book/route.js          ← Main booking endpoint
│   │   │   │   ├── availability/route.js   ← Check available slots
│   │   │   │   └── appointments/route.js   ← Get all appointments
│   │   │   ├── auth/                       ← Authentication routes
│   │   │   ├── cron/                       ← SMS reminder triggers
│   │   │   └── settings/                   ← Admin settings
│   │   ├── page.jsx                        ← You can replace this!
│   │   └── globals.css                     ← You can replace this!
│   ├── lib/
│   │   ├── googleCalendar.js               ← Google Calendar integration
│   │   ├── googleSheets.js                 ← Google Sheets logging
│   │   └── reminders.js                    ← SMS reminder logic
│   └── auth.ts                             ← Authentication config
├── prisma/
│   └── schema.prisma                       ← Database schema
├── .env.local                              ← Your environment variables
└── package.json
```

---

## What You Can Safely Change

### ✅ Safe to Replace (Frontend):
- `src/app/page.jsx` - Homepage component
- `src/app/globals.css` - Global styles
- `src/app/page.css` - Page-specific styles
- `src/components/**/*` - All UI components
- Add new pages in `src/app/` (e.g., `src/app/services/page.jsx`)

### ⚠️ DO NOT MODIFY (Backend):
- `src/app/api/**/*` - API routes (backend logic)
- `src/lib/**/*` - Backend utilities
- `src/auth.ts` - Authentication
- `.env.local` - Environment variables (but you can add frontend vars)
- `prisma/` - Database schema

---

## Testing the Integration

### Test Backend is Running

```bash
# In terminal
curl http://localhost:3002/api/health

# Should return: {"status": "ok"}
```

### Test Booking Endpoint

```bash
curl -X POST http://localhost:3002/api/calendar/book \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-15",
    "time": "10:00 AM",
    "service": {"name": "Test Service", "price": 100000, "duration": 60},
    "customerInfo": {"name": "Test", "phone": "3213582608", "email": "test@test.com"}
  }'
```

### Test from Browser Console

Open your frontend in browser, press F12, and in console:

```javascript
fetch('http://localhost:3002/api/calendar/availability?date=2025-11-15')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Common Issues & Solutions

### Issue: CORS Error

**Error**: "Access to fetch has been blocked by CORS policy"

**Solution**: The backend is already configured to allow CORS. Make sure you're using the full URL with protocol: `http://localhost:3002`

### Issue: 404 Not Found

**Error**: "404 on /calendar/book"

**Solution**: Include `/api/` in the path: `/api/calendar/book`

### Issue: Backend Not Starting

**Error**: "Port 3002 already in use"

**Solution**:
```bash
lsof -ti:3002 | xargs kill -9
npm run dev
```

---

## Production Deployment

When ready to deploy:

1. **Frontend**: Deploy your frontend to Vercel/Netlify/etc.
2. **Backend**: Pedro will deploy this backend to Vercel
3. **Update API URL**: Change `http://localhost:3002` to `https://backend-domain.vercel.app`

Use environment variables for the API URL:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

fetch(`${API_URL}/api/calendar/book`, { ... });
```

---

## SMS Bot (Separate Service)

There's also an SMS reminder bot in `/Users/pedro/Documents/Websites/miosotys-whatsapp-bot/`

**You don't need to worry about this** - it runs independently and communicates with the backend automatically. Pedro manages this service.

It sends:
- 24-hour reminders (day before appointment)
- 2-hour reminders (same day as appointment)

---

## Need Help?

1. **Check the logs**: Backend logs appear in the terminal where you ran `npm run dev`
2. **Test API directly**: Use the curl commands above to verify backend is working
3. **Review existing code**: Check `src/app/api/calendar/book/route.js` to see exactly what the endpoint expects
4. **Ask Pedro**: For credentials, production URLs, or backend logic questions

---

## Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up `.env.local` (ask Pedro for credentials)
- [ ] Run migrations: `npx prisma generate && npx prisma migrate dev`
- [ ] Start backend: `npm run dev`
- [ ] Test health: `curl http://localhost:3002/api/health`
- [ ] Test booking: Use curl command above
- [ ] Integrate your frontend
- [ ] Test booking from your UI

---

## Available Services (for your UI)

These are the services customers can book:

1. **Masaje Relajante** - 60 min - $150,000 COP
2. **Masaje Deportivo** - 60 min - $160,000 COP
3. **Masaje con Piedras Calientes** - 90 min - $200,000 COP
4. **Facial Hidratante** - 60 min - $120,000 COP
5. **Facial Antienvejecimiento** - 75 min - $150,000 COP
6. **Limpieza Facial Profunda** - 90 min - $130,000 COP
7. **Tratamiento Corporal** - 120 min - $250,000 COP
8. **Paquete Relajación Total** - 150 min - $350,000 COP

---

You're all set! The backend is fully functional and ready for your frontend to connect to it. Focus on making the UI beautiful - all the booking logic, SMS reminders, and calendar integration are already handled.

Good luck! 🚀
