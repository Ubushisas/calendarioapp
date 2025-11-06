import { NextResponse } from 'next/server';
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

    // Twilio credentials from environment
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

    if (!accountSid || !authToken) {
      console.error('Twilio credentials not configured');
      return NextResponse.json(
        { error: 'WhatsApp service not configured' },
        { status: 500 }
      );
    }

    // Format phone number for Colombia (ensure it starts with +57)
    let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (formattedPhone.startsWith('57')) {
      formattedPhone = '+' + formattedPhone;
    } else if (formattedPhone.length === 10) {
      formattedPhone = '+57' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }

    // Send SMS only (no WhatsApp - user will send WhatsApp manually)
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const twilioAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const messageType = 'sms';

    // Send SMS via Twilio
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${twilioAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: twilioFrom.replace('whatsapp:', ''), // Remove whatsapp: prefix for SMS
        To: formattedPhone,
        Body: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio API error:', data);

      // Save failed message to sheet
      await saveMessageToSheet({
        phoneNumber: formattedPhone,
        direction: 'outbound-api',
        body: message,
        status: 'failed',
        messageType: messageType,
        twilioSid: data.sid || '',
        errorMessage: data.message || 'Unknown error',
      });

      return NextResponse.json(
        { error: data.message || 'Failed to send message' },
        { status: response.status }
      );
    }

    // Save successful message to sheet
    await saveMessageToSheet({
      phoneNumber: formattedPhone,
      direction: 'outbound-api',
      body: message,
      status: data.status,
      messageType: messageType,
      twilioSid: data.sid,
      errorMessage: '',
    });

    return NextResponse.json({
      success: true,
      messageType: messageType,
      sid: data.sid,
      status: data.status,
    });

  } catch (error) {
    console.error('Error in send-message API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
