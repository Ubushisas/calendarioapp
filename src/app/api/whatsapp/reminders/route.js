import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import twilio from 'twilio';

const CALENDAR_IDS = {
  individual: 'c_83f3b9184bb03652fe4f7b9858ba4dc022f6ae195245d233c9b7e3603d64dc9a@group.calendar.google.com',
  principal: 'c_388f36cd098bb4f42b02cd43b728000ddb283db209570fc4e80c626a177d1f74@group.calendar.google.com',
};

const TOKEN_PATH = path.join(process.cwd(), 'google-oauth-token.json');

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

function getCalendarClient() {
  const oauth2Client = getOAuth2Client();
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(token);
  } else {
    throw new Error('OAuth token not found');
  }
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Parse contact info from event description
function parseContactInfo(description) {
  if (!description) return {};

  const lines = description.split('\n');
  const contact = {};

  lines.forEach((line) => {
    if (line.startsWith('Nombre:')) contact.name = line.replace('Nombre:', '').trim();
    if (line.startsWith('Teléfono:')) contact.phone = line.replace('Teléfono:', '').trim();
    if (line.startsWith('Email:')) contact.email = line.replace('Email:', '').trim();
  });

  return contact;
}

// Send WhatsApp reminder
async function sendWhatsAppReminder(phoneNumber, type, bookingDetails) {
  try {
    const response = await fetch('http://localhost:3002/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        type,
        bookingDetails,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    throw error;
  }
}

// Check for appointments that need reminders
export async function GET() {
  try {
    const calendar = getCalendarClient();
    const now = new Date();

    // Check for appointments in the next 25 hours (to catch 24h and 1h reminders)
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

    // Fetch from both calendars
    const [individualEvents, principalEvents] = await Promise.all([
      calendar.events.list({
        calendarId: CALENDAR_IDS.individual,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      }),
      calendar.events.list({
        calendarId: CALENDAR_IDS.principal,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      }),
    ]);

    const allEvents = [
      ...(individualEvents.data.items || []),
      ...(principalEvents.data.items || []),
    ];

    const reminders = [];

    for (const event of allEvents) {
      if (!event.start.dateTime) continue; // Skip all-day events

      const startTime = new Date(event.start.dateTime);
      const timeUntilStart = startTime - now;
      const hoursUntilStart = timeUntilStart / (1000 * 60 * 60);

      const contact = parseContactInfo(event.description);
      if (!contact.phone) continue;

      const bookingDetails = {
        customerName: contact.name || 'Cliente',
        serviceName: event.summary,
        date: startTime.toLocaleDateString('es-CO', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        time: startTime.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };

      // Send 24h reminder
      if (hoursUntilStart <= 24 && hoursUntilStart > 23) {
        console.log(`📱 Sending 24h reminder for ${event.summary} to ${contact.phone}`);
        await sendWhatsAppReminder(contact.phone, 'reminder-24h', bookingDetails);
        reminders.push({
          type: '24h',
          eventId: event.id,
          phone: contact.phone,
          service: event.summary,
        });
      }

      // Send 1h reminder
      if (hoursUntilStart <= 1 && hoursUntilStart > 0.5) {
        console.log(`📱 Sending 1h reminder for ${event.summary} to ${contact.phone}`);
        await sendWhatsAppReminder(contact.phone, 'reminder-1h', bookingDetails);
        reminders.push({
          type: '1h',
          eventId: event.id,
          phone: contact.phone,
          service: event.summary,
        });
      }
    }

    return NextResponse.json({
      success: true,
      reminders,
      count: reminders.length,
      checkedEvents: allEvents.length,
    });
  } catch (error) {
    console.error('Error processing reminders:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders', details: error.message },
      { status: 500 }
    );
  }
}
