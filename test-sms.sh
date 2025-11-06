#!/bin/bash

echo "🧪 Testeando SMS/WhatsApp desde Vercel..."
echo ""

curl -X POST https://miosotys-spa-booking.vercel.app/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d "{\"phoneNumber\":\"3213582608\",\"message\":\"Test de Twilio desde Vercel! Si recibes este mensaje, la integracion de SMS/WhatsApp esta funcionando. Miosotys Spa\"}"

echo ""
echo ""
echo "✅ Mensaje enviado! Revisa tu teléfono 3213582608"
