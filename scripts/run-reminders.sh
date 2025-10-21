#!/bin/bash

# Script to run reminder checks every minute
# Usage: ./scripts/run-reminders.sh

echo "Starting automated reminder system..."
echo "Checking for upcoming appointments every minute"
echo "Press Ctrl+C to stop"
echo ""

while true; do
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Checking for reminders..."

  response=$(curl -s http://localhost:3002/api/cron/send-reminders)

  # Parse the response to show reminders sent
  reminders_sent=$(echo $response | grep -o '"remindersSent":[0-9]*' | cut -d':' -f2)

  if [ "$reminders_sent" != "0" ]; then
    echo "  ✅ Sent $reminders_sent reminder(s)"
  fi

  # Wait 1 minute
  sleep 60
done
