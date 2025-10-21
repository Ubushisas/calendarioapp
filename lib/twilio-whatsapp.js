import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

let client = null;

function getTwilioClient() {
  if (!client) {
    client = twilio(accountSid, authToken);
  }
  return client;
}

export async function sendWhatsAppMessage(phoneNumber, message, buttons = null) {
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials not configured. Please check your .env.local file.');
  }

  try {
    const twilioClient = getTwilioClient();

    // Format phone number to WhatsApp format
    // Ensure it starts with whatsapp: and has country code
    let formattedNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits

    // If number doesn't start with country code, assume Colombia (+57)
    if (!formattedNumber.startsWith('57')) {
      formattedNumber = '57' + formattedNumber;
    }

    const toNumber = `whatsapp:+${formattedNumber}`;

    const messageParams = {
      from: fromNumber,
      to: toNumber,
    };

    // Add interactive buttons if provided (WhatsApp Business API)
    if (buttons && buttons.length > 0 && buttons.length <= 3) {
      // Use ContentSid for pre-approved templates with buttons
      // Or use interactive buttons (requires approved Business account)
      const actions = buttons.map((btn, idx) => ({
        type: 'button',
        button: {
          type: 'reply',
          reply: {
            id: btn.id || `btn_${idx}`,
            title: btn.text
          }
        }
      }));

      // Format message with interactive buttons
      messageParams.contentSid = null; // We'll use body + buttons
      messageParams.body = message;

      // Note: Twilio doesn't support buttons directly in body
      // We need to use pre-approved Content Templates
      // For now, fallback to text buttons
      messageParams.body = message + '\n\n' + buttons.map((btn, idx) =>
        `${idx + 1}. ${btn.text}`
      ).join('\n');

    } else {
      messageParams.body = message;
    }

    const messageResponse = await twilioClient.messages.create(messageParams);

    console.log('✅ WhatsApp message sent via Twilio:', messageResponse.sid);
    return { success: true, messageSid: messageResponse.sid };
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message via Twilio:', error);
    throw error;
  }
}

// Message templates with interactive buttons
export function createConfirmationMessage(bookingDetails) {
  const {
    customerName,
    serviceName,
    date,
    time,
    numberOfPeople,
    guestNames,
    deposit,
  } = bookingDetails;

  let message = `🌸 *Confirmación de Cita - Miosotys Spa* 🌸\n\n`;
  message += `Hola ${customerName}! ✨\n\n`;
  message += `Hemos recibido tu solicitud de cita:\n\n`;
  message += `📅 *Fecha:* ${date}\n`;
  message += `🕐 *Hora:* ${time}\n`;
  message += `💆 *Servicio:* ${serviceName}\n`;
  message += `👥 *Personas:* ${numberOfPeople}\n`;

  if (guestNames && guestNames.length > 0) {
    message += `\n*Invitados:*\n`;
    guestNames.forEach((name, index) => {
      message += `  ${index + 1}. ${name}\n`;
    });
  }

  if (deposit && deposit > 0) {
    message += `\n💵 *Depósito requerido (50%):* $${deposit.toLocaleString()}\n`;
  }

  message += `\n*¿Confirmas esta cita?*\n\n`;
  message += `✅ *SI* - Confirmo\n`;
  message += `❌ *NO* - Cancelo\n\n`;
  message += `Responde SI o NO`;

  return message;
}

export function createPaymentMessage(bookingDetails) {
  const { customerName, deposit } = bookingDetails;

  const paymentBank = process.env.PAYMENT_BANK || 'Bancolombia';
  const paymentType = process.env.PAYMENT_TYPE || 'Llave Brilla';
  const paymentKey = process.env.PAYMENT_KEY || '[CONFIGURAR EN .ENV]';
  const paymentHolder = process.env.PAYMENT_HOLDER || '[CONFIGURAR EN .ENV]';

  let message = `✅ *¡Cita Confirmada!*\n\n`;
  message += `Gracias ${customerName}! 💙\n\n`;
  message += `Para asegurar tu cita, realiza el depósito de *$${deposit.toLocaleString()}*\n\n`;
  message += `*🏦 Datos de Pago:*\n`;
  message += `• Banco: ${paymentBank}\n`;
  message += `• ${paymentType}: ${paymentKey}\n`;
  message += `• Titular: ${paymentHolder}\n\n`;
  message += `📸 Una vez realizado el pago, envíanos el comprobante por este chat.\n\n`;
  message += `💰 *PAGUE* - Ya pagué\n`;
  message += `⏰ *DESPUES* - Pago luego\n\n`;
  message += `Responde PAGUE o DESPUES`;

  return message;
}

export function createPaymentConfirmedMessage(customerName) {
  let message = `🎉 *¡Pago Confirmado!*\n\n`;
  message += `Gracias ${customerName}! 💙\n\n`;
  message += `Tu cita está 100% confirmada.\n`;
  message += `Te enviaremos recordatorios antes de tu cita.\n\n`;
  message += `¡Nos vemos pronto en Miosotys Spa! ✨`;

  return message;
}

export function createPaymentPendingMessage(customerName) {
  let message = `⏰ *Recordatorio de Pago*\n\n`;
  message += `Hola ${customerName}! 👋\n\n`;
  message += `Recuerda que tu depósito está pendiente.\n`;
  message += `Realiza el pago para asegurar tu cita.\n\n`;
  message += `Responde *PAGUE* cuando hayas realizado el pago. 💰`;

  return message;
}

export function createCancellationMessage(customerName) {
  let message = `❌ *Cita Cancelada*\n\n`;
  message += `Entendido ${customerName}.\n\n`;
  message += `Tu cita ha sido cancelada.\n`;
  message += `Si cambias de opinión, puedes reservar nuevamente en cualquier momento.\n\n`;
  message += `¡Esperamos verte pronto! 💙\n`;
  message += `_Miosotys Spa_`;

  return message;
}

export function createReminderMessage(bookingDetails, hoursUntil) {
  const { customerName, serviceName, time, date } = bookingDetails;

  let message = `🔔 *Recordatorio de Cita - Miosotys Spa*\n\n`;
  message += `Hola ${customerName}! 👋\n\n`;

  if (hoursUntil === 24) {
    message += `Te recordamos que tu cita es *mañana*:\n\n`;
  } else if (hoursUntil === 1) {
    message += `Tu cita es *en 1 hora*:\n\n`;
  }

  message += `📅 ${date}\n`;
  message += `🕐 ${time}\n`;
  message += `💆 ${serviceName}\n\n`;

  message += `*¿Confirmas tu asistencia?*\n\n`;
  message += `✅ *CONFIRMO* - Asistiré\n`;
  message += `❌ *CANCELO* - No podré\n\n`;
  message += `Responde CONFIRMO o CANCELO\n\n`;
  message += `¡Nos vemos pronto! ✨`;

  return message;
}
