import { google } from 'googleapis';
import { sendWhatsAppMessage, createReminderMessage } from '../../../lib/twilio-whatsapp';

export const config = {
  maxDuration: 60, // Maximum execution time in seconds
};

export default async function handler(req, res) {
  // Verify this is a cron request (in production, use Vercel cron secret)
  // For now, we'll allow manual triggers for testing

  try {
    console.log('🔍 Checking for upcoming appointments...');

    // Get OAuth credentials from environment
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials (you'll need to store refresh token)
    // For now, this will need manual OAuth flow
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Calculate time windows for reminders
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
    const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000); // Buffer window

    // Get events for the next 25 hours (to catch 24h reminders)
    const tomorrow = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`📅 Found ${events.length} upcoming appointments`);

    let remindersSent = 0;

    for (const event of events) {
      if (!event.start || !event.start.dateTime) continue;

      const eventTime = new Date(event.start.dateTime);
      const timeUntilEvent = eventTime.getTime() - now.getTime();
      const hoursUntilEvent = timeUntilEvent / (1000 * 60 * 60);

      // Extract customer info from event description
      const description = event.description || '';
      const phoneMatch = description.match(/Phone:\s*(\+?\d+)/i);
      const nameMatch = description.match(/Name:\s*([^\n]+)/i);

      if (!phoneMatch) {
        console.log(`⚠️ No phone number found for event: ${event.summary}`);
        continue;
      }

      const phoneNumber = phoneMatch[1].replace(/\D/g, '');
      const customerName = nameMatch ? nameMatch[1].trim() : 'Cliente';

      // Check if we should send 24h reminder (between 23.5 and 24.5 hours)
      if (hoursUntilEvent >= 23.5 && hoursUntilEvent <= 24.5) {
        console.log(`📨 Sending 24h reminder to ${customerName} (${phoneNumber})`);

        const message = createReminderMessage({
          customerName,
          serviceName: event.summary || 'Tu cita',
          date: eventTime.toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          time: eventTime.toLocaleTimeString('es-CO', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        }, 24);

        await sendWhatsAppMessage(phoneNumber, message);
        remindersSent++;
      }

      // Check if we should send 1h reminder (between 0.5 and 1.5 hours)
      if (hoursUntilEvent >= 0.5 && hoursUntilEvent <= 1.5) {
        console.log(`📨 Sending 1h reminder to ${customerName} (${phoneNumber})`);

        const message = createReminderMessage({
          customerName,
          serviceName: event.summary || 'Tu cita',
          date: eventTime.toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          time: eventTime.toLocaleTimeString('es-CO', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        }, 1);

        await sendWhatsAppMessage(phoneNumber, message);
        remindersSent++;
      }
    }

    console.log(`✅ Sent ${remindersSent} reminders`);

    return res.status(200).json({
      success: true,
      message: `Checked ${events.length} appointments, sent ${remindersSent} reminders`,
      remindersSent,
    });

  } catch (error) {
    console.error('❌ Error sending reminders:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
