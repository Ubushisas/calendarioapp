import {
  sendWhatsAppMessage,
  createConfirmationMessage,
  createPaymentMessage,
  createPaymentConfirmedMessage,
  createPaymentPendingMessage,
  createCancellationMessage,
  createReminderMessage,
} from '../../../lib/twilio-whatsapp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, type, bookingDetails } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Message type is required' });
    }

    let message;

    switch (type) {
      case 'confirmation':
        if (!bookingDetails) {
          return res.status(400).json({ error: 'Booking details required' });
        }
        message = createConfirmationMessage(bookingDetails);
        break;

      case 'payment':
        if (!bookingDetails) {
          return res.status(400).json({ error: 'Booking details required' });
        }
        message = createPaymentMessage(bookingDetails);
        break;

      case 'payment-confirmed':
        message = createPaymentConfirmedMessage(bookingDetails?.customerName || 'Cliente');
        break;

      case 'payment-pending':
        message = createPaymentPendingMessage(bookingDetails?.customerName || 'Cliente');
        break;

      case 'cancellation':
        message = createCancellationMessage(bookingDetails?.customerName || 'Cliente');
        break;

      case 'reminder-24h':
        if (!bookingDetails) {
          return res.status(400).json({ error: 'Booking details required' });
        }
        message = createReminderMessage(bookingDetails, 24);
        break;

      case 'reminder-1h':
        if (!bookingDetails) {
          return res.status(400).json({ error: 'Booking details required' });
        }
        message = createReminderMessage(bookingDetails, 1);
        break;

      default:
        return res.status(400).json({ error: 'Invalid message type' });
    }

    await sendWhatsAppMessage(phoneNumber, message);

    return res.status(200).json({
      success: true,
      message: 'WhatsApp message sent successfully',
    });
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send WhatsApp message',
      details: error.message,
    });
  }
}
