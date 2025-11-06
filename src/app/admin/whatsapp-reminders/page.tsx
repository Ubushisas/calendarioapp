'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  IconMessageCircle,
  IconClock,
  IconSend,
  IconCheck,
  IconAlertCircle,
  IconCalendarEvent,
  IconRefresh,
} from '@tabler/icons-react'

export default function WhatsAppReminders() {
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastSent, setLastSent] = useState<string | null>(null)
  const [appointments24h, setAppointments24h] = useState([])
  const [appointments2h, setAppointments2h] = useState([])

  // Fetch appointments needing reminders
  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // Fetch 24h reminders
      const res24h = await fetch('/api/admin/get-appointments-for-reminders?type=24h')
      const data24h = await res24h.json()

      // Fetch 2h reminders
      const res2h = await fetch('/api/admin/get-appointments-for-reminders?type=2h')
      const data2h = await res2h.json()

      setAppointments24h(data24h.appointments || [])
      setAppointments2h(data2h.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleSendReminders = async () => {
    setSending(true)

    // Simulate API call to send reminders
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLastSent(new Date().toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }))
    setSending(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Recordatorios de WhatsApp</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona los recordatorios automáticos para las citas
        </p>
      </motion.div>

      {/* Automation Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <IconClock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Sistema Automático</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <IconCheck className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-600">Bot Activo (DigitalOcean)</p>
              <p className="text-sm text-muted-foreground mt-1">
                El bot verifica cada hora si hay citas que necesitan recordatorios y los envía automáticamente
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <IconMessageCircle className="w-4 h-4 text-primary" />
                <p className="font-medium text-foreground">Recordatorio 24 Horas Antes</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Se envían recordatorios un día antes de la cita (citas programadas para mañana)
              </p>
              <p className="text-xs text-primary mt-2 font-medium">
                {appointments24h.length} cita(s) pendiente(s)
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <IconMessageCircle className="w-4 h-4 text-primary" />
                <p className="font-medium text-foreground">Recordatorio 2 Horas Antes</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Se envían recordatorios 2 horas antes de la cita (citas de hoy)
              </p>
              <p className="text-xs text-primary mt-2 font-medium">
                {appointments2h.length} cita(s) pendiente(s)
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <IconCalendarEvent className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Citas Pendientes de Recordatorio</h2>
          </div>
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <IconRefresh className={`w-5 h-5 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 24h Reminders */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Recordatorios 24h (Mañana)</h3>
              {appointments24h.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No hay citas programadas para mañana</p>
              ) : (
                <div className="space-y-2">
                  {appointments24h.map((appointment: any) => (
                    <div
                      key={appointment.rowIndex}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-foreground">{appointment.customerName}</p>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            {appointment.service}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{appointment.date}</span>
                          <span>{appointment.time}</span>
                          <span>{appointment.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconMessageCircle className="w-5 h-5 text-amber-500" title="Pendiente de envío" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2h Reminders */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Recordatorios 2h (Hoy)</h3>
              {appointments2h.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No hay citas en las próximas 2-3 horas</p>
              ) : (
                <div className="space-y-2">
                  {appointments2h.map((appointment: any) => (
                    <div
                      key={appointment.rowIndex}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-foreground">{appointment.customerName}</p>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            {appointment.service}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{appointment.date}</span>
                          <span>{appointment.time}</span>
                          <span>{appointment.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconMessageCircle className="w-5 h-5 text-amber-500" title="Pendiente de envío" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Implementation Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-muted/50 border border-border rounded-lg p-4"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Nota del Sistema:</span> El bot de WhatsApp se ejecuta
          en un servidor de DigitalOcean ($4/mes) y verifica automáticamente cada hora si hay citas que necesitan
          recordatorios. Los mensajes se envían desde tu número de WhatsApp Business (333 Miosotis) y aparecen en
          tu chat como si los hubieras enviado manualmente.
        </p>
      </motion.div>
    </div>
  )
}
