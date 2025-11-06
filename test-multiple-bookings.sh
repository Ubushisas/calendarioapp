#!/bin/bash

# Script para crear múltiples citas de prueba en Miosotys Spa
# NO ejecutar en producción sin supervisión

API_URL="https://miosotys-spa-booking.vercel.app/api/calendar/book"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Script de Testing - Miosotys Spa Booking${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Función para crear una cita
create_booking() {
  local date=$1
  local time=$2
  local service_name=$3
  local service_duration=$4
  local service_price=$5
  local customer_name=$6
  local customer_phone=$7
  local customer_email=$8

  echo -e "${YELLOW}Creando cita: ${customer_name} - ${service_name} - ${date} ${time}${NC}"

  # Construir el JSON payload
  local payload=$(cat <<EOF
{
  "date": "${date}",
  "time": "${time}",
  "service": {
    "id": 1,
    "name": "${service_name}",
    "duration": ${service_duration},
    "price": ${service_price},
    "enabled": true,
    "minPeople": 0
  },
  "guestNames": [],
  "customerInfo": {
    "name": "${customer_name}",
    "phone": "${customer_phone}",
    "email": "${customer_email}"
  }
}
EOF
)

  # Hacer el request
  response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$payload")

  # Separar body y status code
  http_code=$(echo "$response" | tail -n1)
  response_body=$(echo "$response" | sed '$d')

  if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Cita creada exitosamente${NC}"
    echo "$response_body" | jq -r '.booking.id' 2>/dev/null || echo "ID no disponible"
  else
    echo -e "${RED}✗ Error al crear cita (HTTP $http_code)${NC}"
    echo "$response_body" | jq -r '.error' 2>/dev/null || echo "$response_body"
  fi
  echo ""
}

# Función para generar fecha futura (ISO format)
# Uso: get_future_date <days_ahead>
get_future_date() {
  local days=$1
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    date -v+${days}d -u +"%Y-%m-%dT%H:%M:%S.000Z"
  else
    # Linux
    date -u -d "+${days} days" +"%Y-%m-%dT%H:%M:%S.000Z"
  fi
}

# Ejemplos de citas - Modifica según necesites
echo -e "${YELLOW}Creando 5 citas de prueba...${NC}"
echo ""

# Cita 1 - En 2 días a las 10:00 AM
create_booking \
  "$(get_future_date 2)" \
  "10:00 AM" \
  "Limpieza Facial" \
  60 \
  120000 \
  "Test User 1" \
  "+573001234567" \
  "test1@example.com"

# Cita 2 - En 3 días a las 2:00 PM
create_booking \
  "$(get_future_date 3)" \
  "2:00 PM" \
  "Masaje con Aceite Caliente" \
  90 \
  140000 \
  "Test User 2" \
  "+573001234568" \
  "test2@example.com"

# Cita 3 - En 4 días a las 11:30 AM
create_booking \
  "$(get_future_date 4)" \
  "11:30 AM" \
  "Exfoliacion Corporal" \
  75 \
  130000 \
  "Test User 3" \
  "+573001234569" \
  "test3@example.com"

# Cita 4 - En 5 días a las 3:30 PM
create_booking \
  "$(get_future_date 5)" \
  "3:30 PM" \
  "Limpieza Facial" \
  60 \
  120000 \
  "Test User 4" \
  "+573001234570" \
  "test4@example.com"

# Cita 5 - En 6 días a las 9:00 AM
create_booking \
  "$(get_future_date 6)" \
  "9:00 AM" \
  "Masaje con Aceite Caliente" \
  90 \
  140000 \
  "Test User 5" \
  "+573001234571" \
  "test5@example.com"

echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}Script completado!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Revisa las citas creadas en:"
echo "1. Google Calendar: myosotisbymo@gmail.com"
echo "2. Google Sheets: https://docs.google.com/spreadsheets/d/1DuM7pokDbek98srwPamsDGNVqD6hXafO3RHwj9gPTVw/edit"
echo "3. Admin Dashboard: https://miosotys-spa-booking.vercel.app/admin/appointments"
echo ""
