'use client'

import { useEffect, useState } from 'react'
import { Users, Calendar, DollarSign, TrendingUp, Clock, ArrowUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Stats {
  totalPatients: number
  todayAppointments: number
  weekRevenue: number
  monthGrowth: number
}

// Mapeo de nombres de pacientes a IDs
const pacienteToId: Record<string, string> = {
  'María González': '1',
  'Carlos Ruiz': '2',
  'Ana López': '3',
  'Pedro Martínez': '4',
  'Laura Sánchez': '5',
  'Jorge Ramírez': '6',
  'Carmen Torres': '7',
  'Roberto Díaz': '8',
}

// Datos de ejemplo - próximas citas
const proximasCitas = [
  { hora: '10:00', paciente: 'María González', servicio: 'Masaje', duracion: '60min', estado: 'confirmada' },
  { hora: '11:30', paciente: 'Carlos Ruiz', servicio: 'Facial', duracion: '45min', estado: 'pendiente' },
  { hora: '14:00', paciente: 'Ana López', servicio: 'Terapia', duracion: '90min', estado: 'confirmada' },
  { hora: '15:45', paciente: 'Pedro Martínez', servicio: 'Aromaterapia', duracion: '60min', estado: 'confirmada' },
]

// Datos de ejemplo - pacientes recientes
const pacientesRecientes = [
  { id: '1', nombre: 'María González', ultimaVisita: '2 días', totalVisitas: 12, gastado: 620000 },
  { id: '2', nombre: 'Carlos Ruiz', ultimaVisita: '1 semana', totalVisitas: 8, gastado: 445000 },
  { id: '3', nombre: 'Ana López', ultimaVisita: '3 días', totalVisitas: 15, gastado: 825000 },
  { id: '4', nombre: 'Pedro Martínez', ultimaVisita: 'Hoy', totalVisitas: 3, gastado: 170000 },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 247,
    todayAppointments: 8,
    weekRevenue: 2810000,
    monthGrowth: 12.5,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header Simple */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Métricas Principales - Grid Compacto */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pacientes Totales
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPatients}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3" />
              <span>12% vs mes pasado</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Citas Hoy
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              4 completadas, 4 pendientes
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos Semana
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.weekRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3" />
              <span>8.2% vs semana pasada</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Crecimiento
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.monthGrowth}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mes a mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección Principal - Dos Columnas */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Agenda del Día - 2/3 del ancho */}
        <Card className="md:col-span-2 border border-border">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Agenda de Hoy</CardTitle>
              <Badge variant="secondary" className="gap-1.5">
                <Clock className="w-3 h-3" />
                {proximasCitas.length} citas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {proximasCitas.map((cita, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold">{cita.hora}</div>
                      <div className="text-xs text-muted-foreground">{cita.duracion}</div>
                    </div>
                    <div className="h-10 w-[1px] bg-border"></div>
                    <div>
                      <Link
                        href={`/admin/patients/${pacienteToId[cita.paciente] || '1'}`}
                        className="font-medium hover:text-primary transition-colors hover:underline"
                      >
                        {cita.paciente}
                      </Link>
                      <div className="text-sm text-muted-foreground">{cita.servicio}</div>
                    </div>
                  </div>
                  <Badge variant={cita.estado === 'confirmada' ? 'default' : 'secondary'}>
                    {cita.estado}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas - 1/3 del ancho */}
        <div className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="border-b">
              <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Link
                href="/admin/patients"
                className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">Ver Pacientes</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/admin/calendar"
                className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">Gestionar Horarios</span>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">Servicios</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pacientes Recientes - Lista Clickeable */}
      <Card className="border border-border">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Pacientes Recientes</CardTitle>
            <Link href="/admin/patients" className="text-sm text-muted-foreground hover:text-foreground">
              Ver todos →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">PACIENTE</th>
                  <th className="text-left p-4 text-xs font-medium text-muted-foreground">ÚLTIMA VISITA</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">VISITAS</th>
                  <th className="text-right p-4 text-xs font-medium text-muted-foreground">TOTAL GASTADO</th>
                </tr>
              </thead>
              <tbody>
                {pacientesRecientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 font-medium">
                      <Link
                        href={`/admin/patients/${paciente.id}`}
                        className="hover:text-primary transition-colors hover:underline"
                      >
                        {paciente.nombre}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{paciente.ultimaVisita}</td>
                    <td className="p-4 text-right text-sm">{paciente.totalVisitas}</td>
                    <td className="p-4 text-right font-medium">${paciente.gastado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
