import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export default function WhatsAppSetup() {
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const connectWhatsApp = async () => {
      try {
        const response = await fetch('/api/whatsapp/connect', {
          method: 'POST',
        });
        const data = await response.json();

        if (data.qrCode) {
          setQrCode(data.qrCode);
          setStatus('Scan this QR code with your WhatsApp');
        } else if (data.message === 'WhatsApp already connected!') {
          setStatus('✅ WhatsApp already connected!');
        }
      } catch (error) {
        setStatus('❌ Error connecting: ' + error.message);
      }
    };

    connectWhatsApp();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
      }}>
        <h1 style={{ marginBottom: '1rem', color: '#25D366' }}>
          WhatsApp Setup
        </h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>{status}</p>

        {qrCode && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'inline-block',
          }}>
            <QRCode value={qrCode} size={300} />
          </div>
        )}

        {qrCode && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Instructions:</h3>
            <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Open WhatsApp on your phone (+57 3213582608)</li>
              <li>Tap Menu or Settings</li>
              <li>Tap "Linked Devices"</li>
              <li>Tap "Link a Device"</li>
              <li>Scan this QR code</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
