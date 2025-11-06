'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconAlertCircle, IconHome, IconArrowLeft } from '@tabler/icons-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 px-4">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <IconAlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Acceso Denegado
            </h1>
            <p className="text-gray-600 text-base">
              Lo sentimos, no tienes permisos para acceder a esta área
            </p>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-800 text-center">
              {error === 'AccessDenied'
                ? 'Tu correo electrónico no está autorizado para acceder al panel de administración.'
                : 'Ha ocurrido un error durante la autenticación.'
              }
            </p>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-800 font-medium mb-2">
              Solo personal autorizado
            </p>
            <p className="text-xs text-blue-700">
              Este sistema está restringido a cuentas autorizadas de Miosotys Spa y Ubushi.
              Si crees que deberías tener acceso, contacta al administrador.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Link
              href="/auth/signin"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Intentar con otra cuenta</span>
            </Link>

            <Link
              href="/"
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <IconHome className="w-4 h-4" />
              <span>Volver al inicio</span>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          <p>
            Sistema de gestión de{' '}
            <span className="font-semibold text-red-600">Miosotys Spa</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
