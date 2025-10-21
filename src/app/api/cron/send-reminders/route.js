import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { sendWhatsAppMessage } from '../../../../../lib/twilio-whatsapp.js';
import { saveMessageToSheet, updateAppointmentStatus } from '../../../../../lib/google-sheets.js';

const CALENDAR_IDS = {
  individual: 'c_83f3b9184bb03652fe4f7b9858ba4dc022f6ae195245d233c9b7e3603d64dc9a@group.calendar.google.com',
  principal: 'c_388f36cd098bb4f42b02cd43b728000ddb283db209570fc4e80c626a177d1f74@group.calendar.google.com',
};

const TOKEN_PATH = path.join(process.cwd(), 'google-oauth-token.json');

function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(token);
  }

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

function extractPhoneFromDescription(description) {
  if (!description) return null;
  const phoneMatch = description.match(/Teléfono:\s*(\d+)/);
  return phoneMatch ? phoneMatch[1] : null;
}

function extractNameFromDescription(description) {
  if (!description) return null;
  const nameMatch = description.match(/Nombre:\s*([^\n]+)/);
  return nameMatch ? nameMatch[1].trim() : null;
}

export async function GET() {
  try {
    const calendar = getCalendarClient();
    const now = new Date();

    // Check for appointments in the next 30 minutes
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 30 * 60000).toISOString();

    const reminders = [];

    // Check both calendars
    for (const [calendarName, calendarId] of Object.entries(CALENDAR_IDS)) {
      const response = await calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      for (const event of events) {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const minutesUntil = Math.floor((eventStart - now) / 60000);

        // Send reminder at 5 minutes before
        if (minutesUntil >= 4 && minutesUntil <= 6) {
          const phone = extractPhoneFromDescription(event.description);
          const customerName = extractNameFromDescription(event.description);

          if (phone) {
            const reminderMessage = `¡Hola ${customerName || 'estimado/a'}! 👋\n\nTe recordamos que tienes tu cita de ${event.summary} en 5 minutos.\n\n⏰ Hora: ${eventStart.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}\n\n¡Te esperamos! 💆‍♀️✨`;

            try {
              const result = await sendWhatsAppMessage(phone, reminderMessage);

              // Save to Google Sheets
              await saveMessageToSheet({
                phoneNumber: phone,
                direction: 'outbound-api',
                body: reminderMessage,
                status: 'sent',
                messageType: 'reminder-5min',
                twilioSid: result.messageSid,
              });

              // Update appointment to mark reminder sent
              await updateAppointmentStatus(event.id, null, {
                reminder5min: true,
              });

              reminders.push({
                eventId: event.id,
                eventTitle: event.summary,
                phone,
                minutesUntil,
                status: 'sent',
              });
            } catch (error) {
              console.error(`Failed to send reminder for ${event.id}:`, error);
              reminders.push({
                eventId: event.id,
                eventTitle: event.summary,
                phone,
                minutesUntil,
                status: 'failed',
                error: error.message,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      checkedAt: now.toISOString(),
      remindersSent: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error('Error checking reminders:', error);
    return NextResponse.json(
      { error: 'Failed to check reminders', details: error.message },
      { status: 500 }
    );
  }
}
