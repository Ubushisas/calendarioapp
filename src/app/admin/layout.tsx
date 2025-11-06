'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SessionProvider, useSession, signOut } from 'next-auth/react'
import {
  IconLayoutDashboard,
  IconUsers,
  IconCalendar,
  IconBriefcase,
  IconRobot,
  IconSettings,
  IconSparkles,
  IconCalendarEvent,
  IconMessageCircle,
  IconLogout,
} from '@tabler/icons-react'

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [mounted, status, router])

  const navItems = [
    { href: '/admin', icon: IconLayoutDashboard, label: 'Dashboard' },
    { href: '/admin/whatsapp-reminders', icon: IconMessageCircle, label: 'Recordatorios de WhatsApp' },
    { href: '/admin/patients', icon: IconUsers, label: 'Gestión de Pacientes' },
    { href: '/admin/settings', icon: IconSettings, label: 'Configuración' },
  ]

  const getColorClasses = (isActive: boolean) => {
    if (!isActive) {
      return 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }
    return 'bg-primary text-primary-foreground border-l-4 border-foreground'
  }

  // Show loading while checking auth
  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-64 bg-card border-r border-border flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <IconSparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Miosotys
                </h1>
                <p className="text-xs text-muted-foreground">Gestión de Spa</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <AnimatePresence>
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)

                return (
                  <motion.div
                    key={item.href}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${getColorClasses(isActive)}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </nav>

          {/* Footer - User Profile */}
          <div className="p-4 border-t border-border">
            {session?.user && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-primary"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <IconLogout className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            )}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="min-h-full p-6 md:p-8"
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.div>
        </main>
        </div>
      </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}
