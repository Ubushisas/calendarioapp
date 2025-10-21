# 🔔 Sistema de Recordatorios Automáticos de WhatsApp

## ✅ Citas de Prueba Creadas

Se han creado **2 citas de prueba** en Google Calendar:

### 📅 Cita 1: Masaje de Relajación
- **Cliente:** Pedro Test
- **Teléfono:** 3213582608
- **Fecha:** Hoy, 19 de octubre de 2025
- **Hora:** 5:00 PM
- **Duración:** 60 minutos
- **Sala:** Individual

### 📅 Cita 2: Romántico Oasis para Dos
- **Cliente:** María García
- **Asistentes:** María García, Juan Pérez
- **Teléfono:** 3213582608
- **Fecha:** Mañana, 20 de octubre de 2025
- **Hora:** 3:00 PM
- **Duración:** 165 minutos
- **Sala:** Principal

---

## 📱 Sistema de Recordatorios

El sistema envía automáticamente recordatorios de WhatsApp:

### Tipos de Recordatorios:
1. **Confirmación** - Al momento de crear la reserva ✅
2. **Recordatorio 24h** - 24 horas antes de la cita 📅
3. **Recordatorio 1h** - 1 hora antes de la cita ⏰

---

## 🚀 Cómo Funciona

### 1. **API Endpoint**: `/api/whatsapp/reminders`

Este endpoint:
- Revisa ambos calendarios de Google
- Busca citas en las próximas 25 horas
- Identifica cuáles necesitan recordatorios (24h o 1h antes)
- Envía mensajes de WhatsApp automáticamente via Twilio

### 2. **Ejecución Manual**

Puedes probar el sistema manualmente:

\`\`\`bash
# Revisar recordatorios ahora
curl http://localhost:3002/api/whatsapp/reminders | jq '.'
\`\`\`

O ejecutar el script:

\`\`\`bash
./scripts/check-reminders.sh
\`\`\`

### 3. **Automatización con Cron (Opcional)**

Para ejecutar automáticamente cada hora, agrega a tu crontab:

\`\`\`bash
# Editar crontab
crontab -e

# Agregar esta línea (ejecuta cada hora)
0 * * * * /Users/pedro/Documents/Websites/miosotys-spa-booking/scripts/check-reminders.sh >> /Users/pedro/Documents/Websites/miosotys-spa-booking/logs/reminders.log 2>&1
\`\`\`

O cada 30 minutos:

\`\`\`bash
*/30 * * * * /Users/pedro/Documents/Websites/miosotys-spa-booking/scripts/check-reminders.sh >> /Users/pedro/Documents/Websites/miosotys-spa-booking/logs/reminders.log 2>&1
\`\`\`

---

## 🧪 Probar el Sistema

### Opción 1: Revisar recordatorios manualmente

\`\`\`bash
curl http://localhost:3002/api/whatsapp/reminders
\`\`\`

### Opción 2: Ver las citas en el dashboard

1. Ve a http://localhost:3002/admin/appointments
2. Deberías ver las 2 citas de prueba
3. Expande cada cita para ver los detalles

### Opción 3: Simular recordatorio inmediato

\`\`\`bash
# Enviar recordatorio de prueba
curl -X POST http://localhost:3002/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "3213582608",
    "type": "reminder-1h",
    "bookingDetails": {
      "customerName": "Pedro Test",
      "serviceName": "Masaje de Relajación",
      "date": "hoy, 19 de octubre de 2025",
      "time": "5:00 PM"
    }
  }'
\`\`\`

---

## 📊 Monitorear el Sistema

### Ver logs del servidor

Revisa los logs de Next.js para ver cuando se envían recordatorios:

\`\`\`bash
# Si usas el background bash
# Busca mensajes como:
# 📱 Sending 24h reminder for...
# ✅ WhatsApp message sent via Twilio
\`\`\`

### Verificar en Twilio

1. Ve a https://console.twilio.com
2. Sección "Messaging" → "Logs"
3. Verás todos los mensajes enviados

---

## 🎯 Próximos Pasos

1. ✅ Las confirmaciones ya funcionan automáticamente al crear reservas
2. 🔄 Los recordatorios se activarán cuando sea 24h o 1h antes de cada cita
3. ⚙️ Configura cron para ejecución automática (opcional)
4. 📈 Monitorea el sistema en `/admin/appointments`

---

## 💡 Tips

- El sistema es inteligente: solo envía recordatorios si encuentra un teléfono en la descripción
- Los recordatorios se envían una sola vez (dentro de la ventana de tiempo)
- Puedes ajustar los tiempos en `/api/whatsapp/reminders/route.js`
- Para producción, considera usar un servicio de cron externo como:
  - Vercel Cron Jobs
  - GitHub Actions
  - EasyCron
  - cron-job.org

¡El sistema está listo para enviar recordatorios automáticos! 🎉
