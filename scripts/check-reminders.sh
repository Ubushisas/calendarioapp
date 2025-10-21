#!/bin/bash

# Script to check and send WhatsApp reminders
# Run this every hour with cron

echo "🔔 Checking for appointments that need reminders..."
echo "⏰ $(date)"

curl -s http://localhost:3002/api/whatsapp/reminders | jq '.'

echo ""
echo "✅ Reminder check completed"
