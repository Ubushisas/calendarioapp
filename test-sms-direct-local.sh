#!/bin/bash

echo "📱 Enviando SMS de prueba de cita..."
echo ""

# Twilio credentials from .env.local
ACCOUNT_SID="AC29615b0d93470986c60eb08665dc4a74"
AUTH_TOKEN="5865d77a21347f4a0bc295379b3ff6cd"
MESSAGING_SERVICE_SID="MGcc991c74e965252c74035d14a22cd12d"
TO_NUMBER="+573213582608"

# SMS message with appointment details
MESSAGE="Hola Pedro! Tu cita ha sido confirmada:

Servicio: Masaje Relajante de Prueba
Fecha: 7 de noviembre, 2025
Hora: 2:00 PM
Duración: 60 minutos
Precio: \$120,000 COP

Dirección: Miosotys Spa, Colombia
Tel: 321-358-2608

Gracias por tu preferencia!
Nos vemos pronto 🌸"

echo "Enviando a: $TO_NUMBER"
echo ""

curl -X POST "https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json" \
  --data-urlencode "MessagingServiceSid=${MESSAGING_SERVICE_SID}" \
  --data-urlencode "To=${TO_NUMBER}" \
  --data-urlencode "Body=${MESSAGE}" \
  -u "${ACCOUNT_SID}:${AUTH_TOKEN}"

echo ""
echo ""
echo "✅ SMS enviado! Revisa tu teléfono 3213582608"
