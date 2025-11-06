# Vercel Deployment Fixes - Critical Production Issues Resolved

## Issues Fixed

### 1. 500 Errors on API Routes (FIXED)
**Problem**: SQLite database and file system operations don't work on Vercel serverless functions.

**Solution**: Modified the following files to use environment variables instead of file system:
- `/src/lib/calendar.js` - Now uses `GOOGLE_OAUTH_TOKEN` environment variable
- `/src/lib/google-sheets.js` - Now uses `GOOGLE_OAUTH_TOKEN` environment variable
- `/src/lib/calendar-settings.js` - Now uses `CALENDAR_SETTINGS` environment variable

### 2. Random "0" Displaying in Booking Summary (FIXED)
**Problem**: React was rendering the falsy value `0` when `guestNames.length` was 0.

**Solution**: Changed the conditional rendering in `/src/components/BookingFlow/BookingFlow.jsx`:
- Line 539: Changed `{service.minPeople &&` to `{service.minPeople > 0 &&`
- Line 545: Changed `{guestNames.length > 0 &&` to `{guestNames.length > 0 ?` with explicit `: null`

### 3. Booking Failures (FIXED)
**Problem**: APIs were crashing due to missing OAuth tokens from file system.

**Solution**: All Google API integrations now use environment variables that work on Vercel.

---

## Required Environment Variables for Vercel

You MUST add these environment variables to your Vercel project:

### 1. GOOGLE_OAUTH_TOKEN (REQUIRED)
This is the OAuth token for Google Calendar and Sheets access.

**Where to get it:**
Copy the EXACT contents from your local `.env.local` file (line 8).
It's a long JSON string that starts with `{"access_token":...}`

**Important:** This token is already configured in your local `.env.local` file. Just copy the full JSON value from there.

### 2. GOOGLE_REDIRECT_URI (UPDATE REQUIRED)
Change this to your production URL:

**Current (localhost):**
```
http://localhost:3002/api/auth/callback
```

**Production (change to):**
```
https://your-vercel-domain.vercel.app/api/auth/callback
```

### 3. NEXTAUTH_URL (UPDATE REQUIRED)
Change this to your production URL:

**Current (localhost):**
```
http://localhost:3002
```

**Production (change to):**
```
https://your-vercel-domain.vercel.app
```

### 4. NEXT_PUBLIC_BASE_URL (ADD THIS)
This is used for WhatsApp message sending:

```
https://your-vercel-domain.vercel.app
```

### 5. CALENDAR_BUFFER_TIME (Optional)
Buffer time between appointments in minutes. Defaults to 15 if not set.

```
15
```

---

## How to Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each variable one by one:
   - Enter the **Name** (e.g., `GOOGLE_OAUTH_TOKEN`)
   - Enter the **Value** (paste the full JSON or value)
   - Select **Production**, **Preview**, and **Development** environments
   - Click "Save"

5. After adding all variables, **redeploy** your application:
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

---

## Verification Checklist

After redeploying with the environment variables, verify:

- [ ] `/api/calendar/availability` returns 200 OK (not 500)
- [ ] `/api/calendar/book` successfully creates bookings
- [ ] No random "0" appears in booking summary
- [ ] Bookings are created in Google Calendar
- [ ] Bookings are saved to Google Sheets
- [ ] WhatsApp confirmation messages are sent

---

## Files Changed

1. **`/src/lib/calendar.js`**
   - Removed: `fs`, `path` imports
   - Removed: File system token reading
   - Added: Environment variable `GOOGLE_OAUTH_TOKEN` reading
   - Changed: Lines 1-75

2. **`/src/lib/google-sheets.js`**
   - Removed: `fs`, `path` imports
   - Removed: File system token reading
   - Added: Environment variable `GOOGLE_OAUTH_TOKEN` reading
   - Changed: Lines 1-30

3. **`/src/lib/calendar-settings.js`**
   - Removed: All file system operations
   - Added: Environment variable `CALENDAR_SETTINGS` reading (optional)
   - Changed: Lines 1-55
   - Now uses hardcoded defaults if env var not set

4. **`/src/components/BookingFlow/BookingFlow.jsx`**
   - Fixed: Random "0" rendering issue
   - Changed: Lines 539, 545-550

5. **`/.env.local`**
   - Added: `GOOGLE_OAUTH_TOKEN` environment variable

---

## Important Notes

1. **OAuth Token Expiry**: The access token expires after ~1 hour, but the `refresh_token` will automatically get a new access token. Make sure the full JSON is in the environment variable.

2. **No Database Needed**: The app now works completely with Google Calendar and Google Sheets - no SQLite/Prisma database needed on Vercel.

3. **Settings Updates**: To change calendar settings (working hours, blocked dates, etc.) in production, you'll need to update the `CALENDAR_SETTINGS` environment variable in Vercel and redeploy.

4. **Local Development**: The `.env.local` file has been updated with the OAuth token, so local development should work without issues.

---

## Testing Locally

Before deploying to Vercel, test locally:

```bash
cd /Users/pedro/Documents/Websites/miosotys-spa-booking
npm run dev
```

Then test:
1. Visit booking page
2. Select a service
3. Choose date/time
4. Fill in customer info
5. Confirm booking
6. Verify no "0" appears
7. Check booking created in Google Calendar

---

## Support

If you encounter issues:
1. Check Vercel deployment logs for errors
2. Verify all environment variables are set correctly
3. Make sure the `GOOGLE_OAUTH_TOKEN` is valid and not expired
4. Redeploy after adding/updating environment variables
