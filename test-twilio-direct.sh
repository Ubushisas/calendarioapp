#!/bin/bash

echo "🧪 Test directo de Twilio SMS con número correcto..."
echo ""
echo "Enviando SMS a 3213582608 desde +19896013761"
echo ""

ACCOUNT_SID="AC29615b0d93470986c60eb08665dc4a74"
AUTH_TOKEN="5865d77a21347f4a0bc295379b3ff6cd"
FROM_NUMBER="+19896013761"
TO_NUMBER="+573213582608"

curl -X POST "https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json" \
  --data-urlencode "From=${FROM_NUMBER}" \
  --data-urlencode "To=${TO_NUMBER}" \
  --data-urlencode "Body=Test SMS directo desde Twilio - Miosotys Spa funcionando! 🎉" \
  -u "${ACCOUNT_SID}:${AUTH_TOKEN}"

echo ""
echo ""
echo "✅ Mensaje enviado! Revisa tu teléfono 3213582608"
