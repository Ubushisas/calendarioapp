import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '../../../../../lib/twilio-whatsapp.js';
import { saveMessageToSheet } from '@/lib/google-sheets';

export async function POST(request) {
  try {
    const { phoneNumber, message } = await request.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Send plain message
    const result = await sendWhatsAppMessage(phoneNumber, message);

    // Save to Google Sheets
    await saveMessageToSheet({
      phoneNumber,
      direction: 'outbound-api',
      body: message,
      status: 'sent',
      messageType: 'manual',
      twilioSid: result.messageSid,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}
