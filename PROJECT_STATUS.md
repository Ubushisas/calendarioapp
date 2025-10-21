# 🌸 Miosotys Spa - WhatsApp Bot Project Status

## 📋 Project Overview

Sistema de reservas para spa con notificaciones automáticas de WhatsApp para confirmaciones, pagos y recordatorios.

## 🎯 Current Goal

Implementar botones interactivos de WhatsApp para mejorar la experiencia del usuario en el flujo de reservas.

## ✅ What's Working Now

### WhatsApp Integration (Twilio)
- ✅ Twilio WhatsApp Sandbox configurado y funcionando
- ✅ Mensajes de confirmación de cita
- ✅ Mensajes de pago con datos bancarios
- ✅ Recordatorios automáticos (24h y 1h antes)
- ✅ Cron job cada 2 minutos para revisar citas (`vercel.json`)
- ✅ Mensajes mejorados con "botones" visuales (emojis + cajas)

### Twilio Credentials (Working)
```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```
> Note: Real credentials are stored in `.env.local` (not committed to git)

### Payment Info
```
PAYMENT_BANK=your_bank_name
PAYMENT_TYPE=your_payment_type
PAYMENT_KEY=your_payment_key
PAYMENT_HOLDER=your_name
```
> Note: Real payment info is stored in `.env.local` (not committed to git)

### Phone Numbers
- **User/Owner:** +57 3213582608 (convertido a WhatsApp Business)
- **Test Number (Meta):** 15558636950 (Miosotys Spa - número temporal de Meta)

## 🏗️ Tech Stack

- **Framework:** Next.js 15.4.6
- **React:** 19.1.0
- **Database:** Google Calendar API (no traditional DB)
- **WhatsApp:** Twilio (current), Meta WhatsApp Business API (future)
- **Deployment:** Vercel

## 📁 Key Files

### `/lib/twilio-whatsapp.js`
Funciones principales de mensajería:
- `sendWhatsAppMessage(phoneNumber, message)` - Envía mensajes via Twilio
- `createConfirmationMessage(bookingDetails)` - Mensaje de confirmación con "botones" SI/NO
- `createPaymentMessage(bookingDetails)` - Mensaje de pago con datos bancarios
- `createReminderMessage(bookingDetails, hoursUntil)` - Recordatorios 24h/1h
- `createPaymentConfirmedMessage(customerName)` - Confirmación de pago recibido
- `createPaymentPendingMessage(customerName)` - Recordatorio de pago pendiente
- `createCancellationMessage(customerName)` - Confirmación de cancelación

**Mejoras recientes:** Añadidos separadores visuales (━━━) y cajas tipo botones (┌─┐) con emojis para simular botones interactivos.

### `/pages/api/whatsapp/send.js`
API endpoint para enviar mensajes. Acepta:
```javascript
POST /api/whatsapp/send
{
  "phoneNumber": "3213582608",
  "type": "confirmation|payment|payment-confirmed|payment-pending|cancellation|reminder-24h|reminder-1h",
  "bookingDetails": {
    "customerName": "Pedro",
    "serviceName": "Masaje de Relajación",
    "date": "Sábado, 21 de octubre",
    "time": "2:00 PM",
    "numberOfPeople": 2,
    "guestNames": ["María"],
    "deposit": 75000
  }
}
```

### `/pages/api/cron/send-reminders.js`
Cron job que:
1. Revisa Google Calendar cada 2 minutos
2. Extrae citas próximas (siguiente 25 horas)
3. Envía recordatorios automáticos:
   - 24h antes: ventana 23.5-24.5 horas
   - 1h antes: ventana 0.5-1.5 horas
4. Extrae teléfono de la descripción del evento: `Phone: +57XXXXXXXXXX`

### `/vercel.json`
```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "*/2 * * * *"
  }]
}
```

## 🎨 Message Flow Examples

### 1. Confirmation Message
```
🌸 *Confirmación de Cita - Miosotys Spa* 🌸

Hola Pedro! ✨

Hemos recibido tu solicitud de cita:

📅 *Fecha:* Sábado, 21 de octubre
🕐 *Hora:* 2:00 PM
💆 *Servicio:* Masaje de Relajación
👥 *Personas:* 2

*Invitados:*
  1. María

💵 *Depósito requerido (50%):* $75,000

━━━━━━━━━━━━━━━━━━━━
*¿Confirmas esta cita?*
━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┐
│ ✅ *SI* - Confirmo   │
└─────────────────────┘

┌─────────────────────┐
│ ❌ *NO* - Cancelo    │
└─────────────────────┘

_Responde *SI* o *NO*_
```

### 2. Payment Message
```
✅ *¡Cita Confirmada!*

Gracias Pedro! 💙

Para asegurar tu cita, realiza el depósito de *$75,000*

━━━━━━━━━━━━━━━━━━━━
🏦 *Datos de Pago:*
━━━━━━━━━━━━━━━━━━━━
• Banco: Bancolombia
• Llave Brilla: 3213582608
• Titular: Pedro

📸 Una vez realizado el pago, envíanos el comprobante por este chat.

┌──────────────────────────┐
│ 💰 *PAGUE* - Ya pagué    │
└──────────────────────────┘

┌──────────────────────────┐
│ ⏰ *DESPUES* - Pago luego│
└──────────────────────────┘

_Responde *PAGUE* o *DESPUES*_
```

### 3. Reminder Message
```
🔔 *Recordatorio de Cita - Miosotys Spa*

Hola Pedro! 👋

Tu cita es *en 1 hora*:

📅 hoy, 19 de octubre
🕐 7:15 AM
💆 Masaje de Relajación

━━━━━━━━━━━━━━━━━━━━
*¿Confirmas tu asistencia?*
━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────┐
│ ✅ *CONFIRMO* - Asistiré │
└──────────────────────────┘

┌──────────────────────────┐
│ ❌ *CANCELO* - No podré  │
└──────────────────────────┘

_Responde *CONFIRMO* o *CANCELO*_

¡Nos vemos pronto! ✨
```

## 🚧 What We're Working On

### Meta WhatsApp Business API Integration (ON HOLD)

**Goal:** Reemplazar "botones" visuales con botones interactivos reales de WhatsApp.

**Status:** Pausado - requiere verificación de negocio de Meta (días/semanas)

**Meta Account Info:**
- App ID: `833194692793686`
- App Name: `Miosotys Spa API`
- Business ID: `120038141862244`
- WhatsApp Business Account ID: `113208639239075`
- Test Phone Number: `15558636950`

**Problema encontrado:**
- WhatsApp no está agregado como producto en la app de desarrolladores
- La interfaz de Meta Developers no muestra opción clara para "Agregar productos"
- Necesita verificación de negocio antes de usar botones interactivos

**Próximos pasos cuando se retome:**
1. Completar verificación de negocio en Meta Business Suite
2. Agregar producto WhatsApp a la app de desarrolladores
3. Obtener Access Token y Phone Number ID
4. Implementar botones interactivos con Meta WhatsApp Cloud API
5. Configurar webhook para procesar respuestas de botones

## 📝 Testing Commands

### Test Confirmation Message
```bash
curl -X POST http://localhost:3002/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "3213582608",
    "type": "confirmation",
    "bookingDetails": {
      "customerName": "Pedro",
      "serviceName": "Masaje de Relajación + Jacuzzi",
      "date": "Sábado, 21 de octubre de 2025",
      "time": "2:00 PM",
      "numberOfPeople": 2,
      "guestNames": ["María"],
      "deposit": 75000
    }
  }'
```

### Test Payment Message
```bash
curl -X POST http://localhost:3002/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "3213582608",
    "type": "payment",
    "bookingDetails": {
      "customerName": "Pedro",
      "deposit": 75000
    }
  }'
```

### Test Reminder Message
```bash
curl -X POST http://localhost:3002/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "3213582608",
    "type": "reminder-1h",
    "bookingDetails": {
      "customerName": "Pedro",
      "serviceName": "Masaje de Relajación",
      "date": "hoy, 19 de octubre de 2025",
      "time": "7:15 AM"
    }
  }'
```

### Test Cron Job Manually
```bash
curl http://localhost:3002/api/cron/send-reminders
```

## 🔄 Current Workflow

1. **Usuario hace reserva** → Booking form
2. **Sistema crea evento** → Google Calendar
3. **Sistema envía confirmación** → WhatsApp (Twilio)
4. **Usuario responde SI** → Se envía mensaje de pago
5. **Usuario paga** → Responde PAGUE → Sistema confirma
6. **Cron job revisa** → Cada 2 minutos busca citas próximas
7. **Envía recordatorios** → 24h y 1h antes de la cita
8. **Usuario confirma asistencia** → Responde CONFIRMO/CANCELO

## 🎯 Next Steps

### Short Term (Current Solution - Twilio)
- ✅ Mensajes con "botones" visuales implementados
- ⏳ Opcional: Implementar webhook para procesar respuestas automáticamente
- ⏳ Opcional: Sistema de estado de reservas (pending → confirmed → paid)

### Long Term (Meta WhatsApp Business)
- ⏳ Completar verificación de negocio en Meta
- ⏳ Obtener aprobación de Meta para WhatsApp Business API
- ⏳ Migrar de Twilio a Meta WhatsApp Cloud API
- ⏳ Implementar botones interactivos reales
- ⏳ Configurar webhook para respuestas de botones
- ⏳ Conseguir número colombiano verificado para WhatsApp Business

## 💡 Important Notes

### Google Calendar Event Format
Para que el cron job funcione, los eventos de Google Calendar deben incluir en la descripción:
```
Name: Pedro Márquez
Phone: +573213582608
Email: pmarquezg20@gmail.com
```

### Formato de Números de Teléfono
- La función auto-añade +57 si no tiene código de país
- Formato esperado: `3213582608` o `573213582608`
- Se convierte a: `whatsapp:+573213582608`

### Twilio Sandbox
- Número de prueba: `whatsapp:+14155238886`
- Usuarios deben unirse enviando: `join <keyword>` al número de Twilio
- Para producción: necesita número de Twilio verificado (~$20/mes)

### Costos
- Twilio: $20 USD ya pagado (configuración inicial)
- Meta WhatsApp API: Gratis para primeros 1000 mensajes/mes
- Número WhatsApp Business: Requiere verificación

## 🐛 Known Issues

1. **Meta Developers Dashboard** no muestra opción "Agregar productos" claramente
2. **Botones interactivos** no disponibles en Twilio Sandbox (solo con API de Meta)
3. **Respuestas de usuarios** no se procesan automáticamente (requiere webhook)

## 📚 Resources

- [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp)
- [Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [WhatsApp Business Platform](https://business.facebook.com/latest/inbox/settings/whatsapp_account)

---

**Last Updated:** October 19, 2025
**Status:** ✅ Working with visual buttons | ⏳ Meta integration on hold
**Developer:** Claude Code + Pedro
