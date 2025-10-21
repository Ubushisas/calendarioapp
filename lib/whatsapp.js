import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import path from 'path';

let sock = null;
let qrCodeData = null;
let isConnecting = false;

// Store for WhatsApp session
const authPath = path.join(process.cwd(), 'whatsapp-auth');

export async function connectToWhatsApp() {
  if (isConnecting && !sock) {
    // Wait a bit and return existing connection attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    return sock;
  }

  if (sock) {
    return sock;
  }

  isConnecting = true;
  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // We'll handle QR ourselves
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeData = qr;
      console.log('🔗 QR Code generated! Visit /admin/whatsapp-setup to scan');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log('❌ Connection closed. Reconnecting:', shouldReconnect);

      if (shouldReconnect) {
        sock = null;
        isConnecting = false;
        setTimeout(() => connectToWhatsApp(), 3000);
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp connected successfully!');
      qrCodeData = null;
      isConnecting = false;
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

export function getQRCode() {
  return qrCodeData;
}

export function getSocket() {
  return sock;
}

export async function sendWhatsAppMessage(phoneNumber, message) {
  if (!sock) {
    throw new Error('WhatsApp not connected. Please scan QR code first.');
  }

  // Format phone number to WhatsApp format
  // Remove any non-digit characters and add @s.whatsapp.net
  const formattedNumber = phoneNumber.replace(/\D/g, '') + '@s.whatsapp.net';

  try {
    await sock.sendMessage(formattedNumber, { text: message });
    console.log(`✅ Message sent to ${phoneNumber}`);
    return { success: true, message: 'Message sent successfully' };
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:', error);
    throw error;
  }
}

// Message templates
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
  message += `Tu cita ha sido confirmada:\n\n`;
  message += `📅 *Fecha:* ${date}\n`;
  message += `🕐 *Hora:* ${time}\n`;
  message += `💆 *Servicio:* ${serviceName}\n`;
  message += `👥 *Personas:* ${numberOfPeople}\n`;

  if (guestNames && guestNames.length > 0) {
    message += `\n*Invitados:*\n`;
    guestNames.forEach((name, index) => {
      message += `${index + 1}. ${name}\n`;
    });
  }

  if (deposit && deposit > 0) {
    message += `\n💵 *Depósito requerido:* $${deposit.toLocaleString()}\n`;
  }

  message += `\n¡Te esperamos! 💙\n`;
  message += `_Miosotys Spa_`;

  return message;
}

export function createReminderMessage(bookingDetails, hoursUntil) {
  const { customerName, serviceName, time } = bookingDetails;

  let message = `🔔 *Recordatorio de Cita - Miosotys Spa*\n\n`;
  message += `Hola ${customerName}! 👋\n\n`;

  if (hoursUntil === 24) {
    message += `Tu cita es mañana a las ${time}\n`;
  } else if (hoursUntil === 1) {
    message += `Tu cita es en 1 hora (${time})\n`;
  }

  message += `💆 *Servicio:* ${serviceName}\n\n`;
  message += `¡Nos vemos pronto! ✨\n`;
  message += `_Miosotys Spa_`;

  return message;
}
