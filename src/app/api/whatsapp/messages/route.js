import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export async function GET(request) {
  try {
    if (!accountSid || !authToken) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Get messages from the last 30 days
    const messages = await client.messages.list({
      limit: 100,
    });

    // Format messages for the UI
    const formattedMessages = messages.map((msg) => ({
      sid: msg.sid,
      from: msg.from,
      to: msg.to,
      body: msg.body,
      direction: msg.direction, // inbound or outbound-api
      status: msg.status,
      dateCreated: msg.dateCreated,
      dateSent: msg.dateSent,
      errorCode: msg.errorCode,
      errorMessage: msg.errorMessage,
    }));

    // Group messages by conversation (phone number)
    const conversations = {};
    formattedMessages.forEach((msg) => {
      // Extract phone number (remove whatsapp: prefix)
      const phoneNumber = msg.direction === 'inbound'
        ? msg.from.replace('whatsapp:', '')
        : msg.to.replace('whatsapp:', '');

      if (!conversations[phoneNumber]) {
        conversations[phoneNumber] = [];
      }
      conversations[phoneNumber].push(msg);
    });

    // Sort messages within each conversation by date
    Object.keys(conversations).forEach((phone) => {
      conversations[phone].sort((a, b) =>
        new Date(a.dateCreated) - new Date(b.dateCreated)
      );
    });

    return NextResponse.json({
      success: true,
      conversations,
      totalMessages: formattedMessages.length,
    });
  } catch (error) {
    console.error('Error fetching Twilio messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error.message },
      { status: 500 }
    );
  }
}
