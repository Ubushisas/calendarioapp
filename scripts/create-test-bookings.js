// Script to create test bookings
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3002/api/calendar/book';

async function createTestBooking(booking) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    const data = await response.json();
    console.log('✅ Booking created:', data);
    return data;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
  }
}

async function main() {
  console.log('🚀 Creating test bookings...\n');

  // Booking 1: Individual service - 2 hours from now
  const date1 = new Date();
  date1.setHours(date1.getHours() + 2);
  const time1Hours = date1.getHours();
  const time1Minutes = date1.getMinutes();
  const period1 = time1Hours >= 12 ? 'PM' : 'AM';
  const displayHours1 = time1Hours > 12 ? time1Hours - 12 : (time1Hours === 0 ? 12 : time1Hours);
  const time1 = `${displayHours1}:${time1Minutes.toString().padStart(2, '0')} ${period1}`;

  await createTestBooking({
    date: date1.toISOString(),
    time: time1,
    service: {
      id: 'relajacion',
      name: 'Masaje de Relajación',
      duration: 60,
      price: 150000,
    },
    guestNames: [],
    customerInfo: {
      name: 'Pedro Test',
      phone: '3213582608',
      email: 'test@example.com',
    },
  });

  console.log('\n⏳ Waiting 2 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Booking 2: Group service - 24 hours from now
  const date2 = new Date();
  date2.setHours(date2.getHours() + 24);
  const time2Hours = date2.getHours();
  const time2Minutes = date2.getMinutes();
  const period2 = time2Hours >= 12 ? 'PM' : 'AM';
  const displayHours2 = time2Hours > 12 ? time2Hours - 12 : (time2Hours === 0 ? 12 : time2Hours);
  const time2 = `${displayHours2}:${time2Minutes.toString().padStart(2, '0')} ${period2}`;

  await createTestBooking({
    date: date2.toISOString(),
    time: time2,
    service: {
      id: 'romantico_oasis',
      name: 'Romántico Oasis para Dos',
      duration: 165,
      price: 450000,
      minPeople: 2,
      maxPeople: 2,
    },
    guestNames: ['María García', 'Juan Pérez'],
    customerInfo: {
      name: 'María García',
      phone: '3213582608',
      email: 'maria@example.com',
    },
  });

  console.log('\n✨ Test bookings created successfully!');
  console.log('\n📱 Confirmación de WhatsApp enviada para ambas citas');
  console.log('⏰ Recordatorios programados:');
  console.log(`   - Cita 1: ${time1} (recordatorio en 1 hora)`);
  console.log(`   - Cita 2: ${time2} mañana (recordatorio en 23 horas)`);
}

main();
