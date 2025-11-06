#!/bin/bash

# Script para testear el flujo completo de Twilio con números reales
# Crea múltiples reservas con los números de Pedro y Lis

API_URL="${1:-https://miosotys-spa-booking.vercel.app}"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test de Flujo Twilio - Miosotys Spa${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "API URL: ${GREEN}$API_URL${NC}"
echo ""

# Función para crear una reserva
create_booking() {
    local date=$1
    local time=$2
    local service_name=$3
    local service_price=$4
    local service_duration=$5
    local customer_name=$6
    local customer_phone=$7
    local customer_email=$8

    echo -e "${BLUE}Creando reserva:${NC}"
    echo "  Nombre: $customer_name"
    echo "  Teléfono: $customer_phone"
    echo "  Servicio: $service_name"
    echo "  Fecha: $date a las $time"
    echo ""

    response=$(curl -s -X POST "$API_URL/api/calendar/book" \
        -H "Content-Type: application/json" \
        -d "{
            \"date\": \"$date\",
            \"time\": \"$time\",
            \"service\": {
                \"name\": \"$service_name\",
                \"price\": $service_price,
                \"duration\": $service_duration
            },
            \"customerInfo\": {
                \"name\": \"$customer_name\",
                \"phone\": \"$customer_phone\",
                \"email\": \"$customer_email\"
            }
        }")

    if echo "$response" | grep -q "\"success\":true"; then
        echo -e "${GREEN}✓ Reserva creada exitosamente${NC}"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    else
        echo -e "${RED}✗ Error creando reserva${NC}"
        echo "$response"
    fi

    echo -e "\n${BLUE}----------------------------------------${NC}\n"
    sleep 2
}

# Obtener fecha de mañana (para cumplir con el requisito de 12 horas)
tomorrow=$(date -v+1d '+%Y-%m-%d' 2>/dev/null || date -d '+1 day' '+%Y-%m-%d')
day_after=$(date -v+2d '+%Y-%m-%d' 2>/dev/null || date -d '+2 days' '+%Y-%m-%d')

echo -e "${GREEN}Creando 6 reservas de prueba para testear Twilio...${NC}\n"

# Reserva 1: Pedro - Masaje Relajante
create_booking \
    "$tomorrow" \
    "10:00 AM" \
    "Masaje Relajante" \
    "120000" \
    "60" \
    "Pedro" \
    "3213582608" \
    "pedro@ubushi.com"

# Reserva 2: Lis - Limpieza Facial
create_booking \
    "$tomorrow" \
    "11:30 AM" \
    "Limpieza Facial" \
    "120000" \
    "60" \
    "Lis" \
    "3118980526" \
    "lis@ubushi.com"

# Reserva 3: Pedro - Tratamiento Corporal
create_booking \
    "$tomorrow" \
    "2:00 PM" \
    "Tratamiento Corporal" \
    "150000" \
    "90" \
    "Pedro Ubushi" \
    "3213582608" \
    "pedro@example.com"

# Reserva 4: Lis - Masaje con Piedras Calientes
create_booking \
    "$day_after" \
    "10:00 AM" \
    "Masaje con Piedras Calientes" \
    "180000" \
    "90" \
    "Lis Ubushi" \
    "3118980526" \
    "lis@example.com"

# Reserva 5: Pedro - Reflexología
create_booking \
    "$day_after" \
    "12:00 PM" \
    "Reflexología" \
    "100000" \
    "60" \
    "Pedro U" \
    "3213582608" \
    "contact@ubushi.com"

# Reserva 6: Lis - Exfoliación Corporal
create_booking \
    "$day_after" \
    "3:00 PM" \
    "Exfoliación Corporal" \
    "130000" \
    "60" \
    "Lis U" \
    "3118980526" \
    "hello@ubushi.com"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Test completado${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Revisen sus teléfonos para ver los mensajes de WhatsApp/SMS:${NC}"
echo "  - Pedro: 3213582608 (3 reservas)"
echo "  - Lis: 3118980526 (3 reservas)"
echo ""
echo -e "${BLUE}Para ver las reservas en el admin:${NC}"
echo "  $API_URL/admin"
echo ""
echo -e "${BLUE}Para ver los datos en Google Sheets:${NC}"
echo "  Bookings: https://docs.google.com/spreadsheets/d/1DuM7pokDbek98srwPamsDGNVqD6hXafO3RHwj9gPTVw/edit"
echo "  WhatsApp: https://docs.google.com/spreadsheets/d/1LxE0we_tfkjr7I2TplF5VALGEQRz6-zjgZxdLcsteT4/edit"
echo ""
