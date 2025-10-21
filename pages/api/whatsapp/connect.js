import { connectToWhatsApp, getQRCode } from '../../../lib/whatsapp';

let isConnecting = false;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!isConnecting) {
      isConnecting = true;
      await connectToWhatsApp();
    }

    const qrCode = getQRCode();

    if (qrCode) {
      return res.status(200).json({
        success: true,
        message: 'QR code generated. Please scan with WhatsApp.',
        qrCode,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'WhatsApp already connected!',
      });
    }
  } catch (error) {
    console.error('WhatsApp connection error:', error);
    isConnecting = false;
    return res.status(500).json({
      success: false,
      error: 'Failed to connect to WhatsApp',
      details: error.message,
    });
  }
}
