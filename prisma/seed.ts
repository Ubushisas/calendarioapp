import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create settings
  const hashedPassword = await bcrypt.hash('miosotys2025', 10)

  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      bufferTime: 15,
      calendarEnabled: true,
      workingHours: JSON.stringify({
        mon: { start: '09:00', end: '18:00' },
        tue: { start: '09:00', end: '18:00' },
        wed: { start: '09:00', end: '18:00' },
        thu: { start: '09:00', end: '18:00' },
        fri: { start: '09:00', end: '18:00' },
        sat: { start: '10:00', end: '16:00' },
        sun: { start: 'closed', end: 'closed' },
      }),
      adminPassword: hashedPassword,
    },
  })

  console.log('✅ Settings created')

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Swedish Massage',
        duration: 60,
        price: 85,
        description: 'Relaxing full-body massage with gentle pressure',
        color: '#3B82F6',
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Deep Tissue Massage',
        duration: 90,
        price: 120,
        description: 'Intensive massage for muscle tension relief',
        color: '#10B981',
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hot Stone Therapy',
        duration: 75,
        price: 95,
        description: 'Therapeutic massage with heated stones',
        color: '#F59E0B',
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Aromatherapy Massage',
        duration: 60,
        price: 90,
        description: 'Relaxing massage with essential oils',
        color: '#8B5CF6',
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Facial Treatment',
        duration: 45,
        price: 75,
        description: 'Rejuvenating facial with skincare',
        color: '#EC4899',
        active: true,
      },
    }),
  ])

  console.log('✅ Services created')

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria@example.com',
        phone: '+1-555-0101',
        notes: 'Prefers light pressure, allergic to lavender oil',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0102',
        notes: 'Regular client, likes deep tissue',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Emily Chen',
        email: 'emily@example.com',
        phone: '+1-555-0103',
        notes: 'First time client',
      },
    }),
  ])

  console.log('✅ Patients created')

  // Create sample appointments for today
  const today = new Date()
  today.setHours(10, 0, 0, 0)

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        serviceId: services[0].id,
        startTime: new Date(today.getTime()),
        endTime: new Date(today.getTime() + services[0].duration * 60000),
        status: 'scheduled',
        notes: 'First appointment of the day',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        serviceId: services[1].id,
        startTime: new Date(today.getTime() + 90 * 60000), // 11:30 AM
        endTime: new Date(today.getTime() + 180 * 60000),
        status: 'scheduled',
        notes: 'Regular weekly session',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        serviceId: services[4].id,
        startTime: new Date(today.getTime() + 240 * 60000), // 2:00 PM
        endTime: new Date(today.getTime() + 285 * 60000),
        status: 'scheduled',
      },
    }),
  ])

  console.log('✅ Appointments created')

  console.log('🎉 Seeding complete!')
  console.log('\n📋 Summary:')
  console.log(`- Settings: Created`)
  console.log(`- Services: ${services.length}`)
  console.log(`- Patients: ${patients.length}`)
  console.log(`- Appointments: ${appointments.length}`)
  console.log('\n🔑 Admin password: miosotys2025')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
