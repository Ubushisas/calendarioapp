'use client'

import { signIn } from 'next-auth/react'
import { IconBrandGoogle } from '@tabler/icons-react'

export default function SignInPage() {
  const handleSignIn = async () => {
    await signIn('google', {
      callbackUrl: '/admin',
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded"></div>
            <span className="text-white text-xl font-semibold">Miosotys Spa</span>
          </div>
          <blockquote className="space-y-4">
            <p className="text-lg text-zinc-100">
              "Sistema completo de gestión para tu spa. Control total de reservas,
              recordatorios automáticos y gestión de pacientes en una sola plataforma."
            </p>
            <footer className="text-sm text-zinc-400">
              Panel Administrativo
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 bg-zinc-900 rounded"></div>
            <span className="text-xl font-semibold">Miosotys Spa</span>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa con tu cuenta autorizada de Google
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <IconBrandGoogle className="w-5 h-5" />
              Continuar con Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Solo personal autorizado
                </span>
              </div>
            </div>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Al continuar, aceptas que solo cuentas autorizadas pueden acceder al sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
