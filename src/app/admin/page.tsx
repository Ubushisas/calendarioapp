'use client'

import { motion } from 'framer-motion'
import {
  IconCurrencyDollar,
  IconSparkles,
  IconUsers,
  IconTrendingUp,
  IconCalendar,
  IconBulb,
} from '@tabler/icons-react'

export default function AdminDashboard() {
  // Mock data for demonstration
  const metrics = {
    revenue: {
      total: 3450000,
      monthly: 850000,
      growth: 12.5,
    },
    topServices: [
      { name: 'Limpieza Facial', bookings: 45, revenue: 5400000 },
      { name: 'Masaje con Aceite Caliente', bookings: 38, revenue: 5320000 },
      { name: 'Masaje en Pareja', bookings: 22, revenue: 6160000 },
      { name: 'Spa Romantico Completo', bookings: 15, revenue: 5250000 },
      { name: 'Exfoliacion Corporal', bookings: 28, revenue: 3640000 },
    ],
    patients: {
      total: 234,
      new: 18,
      returning: 67,
    },
    aiRecommendations: [
      {
        title: 'Optimizar Horarios de Mayor Demanda',
        description: 'Los viernes de 2pm-6pm tienen 85% de ocupación. Considera agregar personal adicional.',
        priority: 'high',
      },
      {
        title: 'Promoción de Servicios de Baja Demanda',
        description: 'Los servicios en grupo tienen 40% menos reservas. Una promoción 2x1 podría aumentar la demanda.',
        priority: 'medium',
      },
      {
        title: 'Recordatorios Tempranos',
        description: 'Las cancelaciones de último minuto disminuyeron 30% con recordatorios a las 6am del mismo día.',
        priority: 'low',
      },
    ],
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Vista general de métricas y recomendaciones
        </p>
      </motion.div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(metrics.revenue.total)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <IconCurrencyDollar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Este Mes</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(metrics.revenue.monthly)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <IconCalendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Crecimiento</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                +{metrics.revenue.growth}%
              </h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <IconTrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <IconSparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Servicios Más Populares</h2>
        </div>
        <div className="space-y-3">
          {metrics.topServices.map((service, index) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.bookings} reservas
                  </p>
                </div>
              </div>
              <p className="font-bold text-foreground">
                {formatCurrency(service.revenue)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Patient Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <IconUsers className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Análisis de Pacientes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Pacientes</p>
            <h3 className="text-3xl font-bold text-foreground mt-2">
              {metrics.patients.total}
            </h3>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
            <h3 className="text-3xl font-bold text-foreground mt-2">
              {metrics.patients.new}
            </h3>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Clientes Recurrentes</p>
            <h3 className="text-3xl font-bold text-foreground mt-2">
              {metrics.patients.returning}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <IconBulb className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Recomendaciones IA</h2>
        </div>
        <div className="space-y-3">
          {metrics.aiRecommendations.map((rec, index) => {
            const priorityColors = {
              high: 'bg-red-500/10 border-red-500/30 text-red-600',
              medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600',
              low: 'bg-green-500/10 border-green-500/30 text-green-600',
            }

            return (
              <div
                key={index}
                className="p-4 bg-muted/30 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      priorityColors[rec.priority as keyof typeof priorityColors]
                    }`}
                  >
                    {rec.priority === 'high'
                      ? 'Alta'
                      : rec.priority === 'medium'
                      ? 'Media'
                      : 'Baja'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

