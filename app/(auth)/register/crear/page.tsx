'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  )
}

function VisibilityIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  )
}

function VisibilityOffIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05 .21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-[#0B1F2D]/50 py-3 text-white placeholder:text-slate-600 focus:border-[#19e694] focus:ring-2 focus:ring-[#19e694]/20 outline-none transition-all pl-10 pr-4'

export default function RegisterCrearPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-mesh px-6 py-12">
      <main className="relative z-10 w-full max-w-[540px]">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo_nodo.png"
            alt="NODO Corporate Logo"
            width={240}
            height={96}
            className="h-24 w-[240px] object-contain"
          />
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200/10 bg-[#162B3B] shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-200/10 bg-slate-50/5">
            <div className="relative flex-1 py-4 text-center text-sm font-semibold text-white">
              Crear Cuenta
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E676]" aria-hidden />
            </div>
            <Link
              href="/register"
              className="flex-1 py-4 text-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
            >
              Cuenta Empresa
            </Link>
            <Link
              href="/register/entidad"
              className="flex-1 py-4 text-center text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
            >
              Cuenta Entidad
            </Link>
          </div>

          <div className="p-8">
            <header className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
                Comienza con NODO
              </h1>
              <p className="text-sm text-slate-400">
                Únete a la plataforma de trazabilidad verificada del futuro
              </p>
            </header>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Social buttons */}
              <div className="mb-6 space-y-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-[#0B1F2D]/50 py-3 text-white transition-colors hover:bg-slate-700/50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-sm font-medium">Registrarse con Google</span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-[#0B1F2D]/50 py-3 text-white transition-colors hover:bg-slate-700/50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M0 0h11v11H0z" fill="#f35325" />
                    <path d="M12 0h11v11H12z" fill="#81bc06" />
                    <path d="M0 12h11v11H0z" fill="#05a6f0" />
                    <path d="M12 12h11v11H12z" fill="#ffba08" />
                  </svg>
                  <span className="text-sm font-medium">Registrarse con Microsoft</span>
                </button>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-slate-700" />
                  <span className="mx-4 flex-shrink text-xs uppercase tracking-widest text-slate-500">
                    o con tu correo
                  </span>
                  <div className="flex-grow border-t border-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Nombre
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                      <PersonIcon />
                    </span>
                    <input
                      type="text"
                      placeholder="Ej. Alexis"
                      className={inputClass}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Flores"
                    className={inputClass.replace('pl-10', 'px-4')}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    placeholder="tu@ejemplo.com"
                    className={inputClass}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                    readOnly
                    disabled
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon className="text-lg" />
                    ) : (
                      <VisibilityIcon className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms-crear"
                  className="mt-1 rounded border-slate-700 bg-[#0B1F2D] text-[#19e694] focus:ring-[#19e694]/20"
                  disabled
                />
                <label htmlFor="terms-crear" className="cursor-pointer text-sm leading-tight text-slate-400">
                  Acepto los{' '}
                  <Link href="#" className="text-[#19e694] hover:underline">
                    Términos de Servicio
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" className="text-[#19e694] hover:underline">
                    Política de Privacidad
                  </Link>{' '}
                  de NODO.
                </label>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-[#1F7A5C] py-4 font-bold uppercase tracking-widest text-sm text-white shadow-lg shadow-[#1F7A5C]/20 transition-all active:scale-[0.98] hover:bg-[#1F7A5C]/90"
              >
                Registrarse
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200/10 pt-6 text-center">
              <p className="text-sm text-slate-400">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="ml-1 font-semibold text-[#00E676] hover:underline">
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            © 2026 NODO TECHNOLOGY GROUP. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </footer>
      </main>
    </div>
  )
}
