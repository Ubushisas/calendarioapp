#!/bin/bash

# Get Vercel token from auth
VERCEL_TOKEN=$(cat ~/.config/vercel/auth.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Add environment variable to Vercel project
curl -X POST "https://api.vercel.com/v10/projects/miosotys-spa-booking/env" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "TWILIO_MESSAGING_SERVICE_SID",
    "value": "MGcc991c74e965252c74035d14a22cd12d",
    "type": "encrypted",
    "target": ["production", "preview", "development"]
  }'

echo ""
echo "✅ Environment variable added to Vercel!"
