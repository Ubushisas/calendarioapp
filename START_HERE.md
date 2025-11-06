# 🌸 Miosotys Spa - Backend Project

**For: Frontend Developer (Pedro's Wife)**
**AI Assistant: Please read this file first, then read CLAUDE_CODE_INSTRUCTIONS.md**

---

## Welcome!

This is the **complete backend system** for Miosotys Spa booking. Pedro has built all the backend functionality, and now it's ready for you to integrate with your beautiful frontend.

---

## 📖 Quick Start - Read These Files in Order

1. **START_HERE.md** ← You are here! Quick overview
2. **CLAUDE_CODE_INSTRUCTIONS.md** ← Complete guide for Claude Code AI
3. **LOCAL_SETUP.md** ← How to run the backend locally
4. **FRONTEND_INTEGRATION.md** ← How to connect your frontend to the API
5. **BACKEND_ONLY_DEPLOYMENT.md** ← For when you're ready to deploy

---

## 🎯 What This Backend Does

### Core Features (Already Working!)

✅ **Booking System**
- Creates appointments in Google Calendar
- Logs all bookings to Google Sheets
- Validates availability before booking
- Prevents double-bookings

✅ **SMS Reminders**
- Sends automatic reminders 24 hours before appointment
- Sends automatic reminders 2 hours before appointment
- Uses Twilio SMS (not WhatsApp for reminders)

✅ **WhatsApp Confirmations**
- Sends booking confirmation via WhatsApp
- Includes payment details
- Only for initial booking confirmation

✅ **Admin Dashboard**
- View all appointments
- Manage services
- Track reminder history
- Google OAuth authentication

---

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
# Navigate to this folder
cd /path/to/miosotys-spa-booking

# Install everything
npm install
```

### Step 2: Set Up Environment Variables

Ask Pedro for the `.env.local` file with credentials, or create one using `.env.local.example` as a template.

**Important credentials needed:**
- Google OAuth (Calendar + Sheets)
- Twilio (SMS + WhatsApp)
- NextAuth secret

### Step 3: Start the Backend

```bash
# Generate database client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```

Backend will run on: **http://localhost:3002**

---

## 📡 Main API Endpoints You'll Use

### 1. Create Booking
```
POST http://localhost:3002/api/calendar/book
```
Creates appointment, sends WhatsApp confirmation, schedules SMS reminders.

### 2. Get Available Slots
```
GET http://localhost:3002/api/calendar/availability?date=YYYY-MM-DD
```
Returns available time slots for a date.

### 3. Get All Appointments (Admin)
```
GET http://localhost:3002/api/calendar/appointments
```
Returns all scheduled appointments (requires auth).

---

## 💻 Your Frontend Integration

### Quick Example - Book Appointment

```javascript
// In your frontend component
const API_URL = 'http://localhost:3002';

async function bookAppointment(bookingData) {
  const response = await fetch(`${API_URL}/api/calendar/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: '2025-11-20',
      time: '10:00 AM',
      service: {
        name: 'Masaje Relajante',
        price: 150000,
        duration: 60
      },
      customerInfo: {
        name: 'María García',
        phone: '3213582608',
        email: 'maria@example.com'
      }
    })
  });

  return await response.json();
}
```

**Full integration guide**: See `FRONTEND_INTEGRATION.md`

---

## 📁 Project Structure

```
miosotys-spa-booking/
├── src/
│   ├── app/
│   │   ├── api/              ← Backend API routes (DON'T MODIFY)
│   │   ├── page.jsx          ← Replace with your UI
│   │   └── globals.css       ← Replace with your styles
│   ├── components/           ← Add your components here
│   └── lib/                  ← Backend logic (DON'T MODIFY)
├── prisma/
│   └── schema.prisma         ← Database schema
├── .env.local                ← Your secrets (ask Pedro)
└── Documentation files...
```

---

## ✅ What You Can Safely Change

### Frontend Files (Go Crazy!)
- ✅ `src/app/page.jsx`
- ✅ `src/app/globals.css`
- ✅ `src/app/page.css`
- ✅ `src/components/` (create your own)
- ✅ `public/` (add images, fonts, etc.)

### Backend Files (Leave These Alone!)
- ❌ `src/app/api/**/*` - API routes
- ❌ `src/lib/**/*` - Backend logic
- ❌ `src/auth.ts` - Authentication
- ❌ `prisma/` - Database

---

## 🔧 Troubleshooting

### Backend Won't Start?

```bash
# Kill port 3002
lsof -ti:3002 | xargs kill -9

# Reinstall dependencies
rm -rf node_modules .next
npm install

# Try again
npm run dev
```

### Database Issues?

```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### API Not Working?

1. Check backend is running: `curl http://localhost:3002/api/health`
2. Check browser console for CORS errors
3. Verify you're using the full URL with `/api/` prefix

---

## 🎨 Available Services (For Your UI)

These are the spa services customers can book:

1. **Masaje Relajante** - 60 min - $150,000 COP
2. **Masaje Deportivo** - 60 min - $160,000 COP
3. **Masaje con Piedras Calientes** - 90 min - $200,000 COP
4. **Facial Hidratante** - 60 min - $120,000 COP
5. **Facial Antienvejecimiento** - 75 min - $150,000 COP
6. **Limpieza Facial Profunda** - 90 min - $130,000 COP
7. **Tratamiento Corporal** - 120 min - $250,000 COP
8. **Paquete Relajación Total** - 150 min - $350,000 COP

---

## 🤖 SMS Reminder System

There's a separate SMS bot in `/Users/pedro/Documents/Websites/miosotys-whatsapp-bot/`

**You don't need to worry about this** - Pedro manages it. It runs independently and sends reminders automatically.

---

## 📞 Contact

For credentials, deployment questions, or backend issues:
- **Ask Pedro** for Google/Twilio credentials
- **Ask Pedro** to update CORS when you deploy
- **Ask Pedro** about backend logic changes

---

## 🎯 Your Mission

1. ✅ Get backend running locally
2. ✅ Build beautiful UI components
3. ✅ Integrate booking form with API
4. ✅ Test bookings work end-to-end
5. ✅ Deploy your frontend separately
6. ✅ Give Pedro your frontend URL (for CORS)

---

## 📚 Documentation Files

- **CLAUDE_CODE_INSTRUCTIONS.md** - Complete guide for AI assistant
- **LOCAL_SETUP.md** - Step-by-step local setup
- **FRONTEND_INTEGRATION.md** - API integration examples
- **BACKEND_ONLY_DEPLOYMENT.md** - Separate deployment guide
- **DEPLOYMENT_GUIDE.md** - Full deployment guide
- **PRODUCTION_READY.md** - Production checklist

---

## 💡 Pro Tips

1. **Keep backend running** in one terminal while you work
2. **Use environment variables** for the API URL
3. **Check browser console** for errors
4. **Test with real data** to see SMS/WhatsApp in action
5. **Ask Claude Code** to read the documentation files for help

---

## ✨ Final Notes

The backend is **fully functional and tested**:
- ✅ Bookings create Google Calendar events
- ✅ Bookings log to Google Sheets
- ✅ WhatsApp confirmations send successfully
- ✅ SMS reminders send automatically (24h and 2h before)
- ✅ CORS is configured to allow your frontend

**Your job**: Make the frontend beautiful and connect it to these APIs! 🎨

---

**Ready to start?**
1. Run `npm install`
2. Get `.env.local` from Pedro
3. Run `npm run dev`
4. Read `FRONTEND_INTEGRATION.md`
5. Build something amazing! 🚀

Good luck! You've got this! 💪
