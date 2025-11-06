#!/bin/bash

echo "🧪 Creando reservas de prueba para SMS..."
echo ""

# Reserva para Pedro
echo "📱 Reserva 1: Pedro (3213582608)"
curl -X POST https://miosotys-spa-booking.vercel.app/api/calendar/book \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-11-07\",\"time\":\"2:00 PM\",\"service\":{\"name\":\"Masaje Relajante\",\"price\":120000,\"duration\":60},\"customerInfo\":{\"name\":\"Pedro\",\"phone\":\"3213582608\",\"email\":\"pedro@ubushi.com\"}}"

echo ""
echo ""

# Reserva para Lis
echo "📱 Reserva 2: Lis (3118980526)"
curl -X POST https://miosotys-spa-booking.vercel.app/api/calendar/book \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-11-07\",\"time\":\"4:00 PM\",\"service\":{\"name\":\"Limpieza Facial\",\"price\":120000,\"duration\":60},\"customerInfo\":{\"name\":\"Lis\",\"phone\":\"3118980526\",\"email\":\"lis@ubushi.com\"}}"

echo ""
echo ""
echo "✅ Reservas creadas! Revisen sus celulares:"
echo "   - Pedro: 3213582608"
echo "   - Lis: 3118980526"
echo ""
echo "📊 También pueden verificar en:"
echo "   - Google Calendar: calendar.google.com"
echo "   - Hoja de Citas: https://docs.google.com/spreadsheets/d/1DuM7pokDbek98srwPamsDGNVqD6hXafO3RHwj9gPTVw/edit"
echo "   - Hoja de Mensajes SMS: https://docs.google.com/spreadsheets/d/1LxE0we_tfkjr7I2TplF5VALGEQRz6-zjgZxdLcsteT4/edit"
