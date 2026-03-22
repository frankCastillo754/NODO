'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function DomainIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  )
}

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
  'w-full rounded-lg border border-slate-600 bg-[#1e3a52] py-3 text-white placeholder:text-slate-500 focus:border-[#00E676] focus:ring-2 focus:ring-[#00E676]/50 outline-none transition-all dark:border-slate-600 dark:bg-[#1e3a52] pl-11 pr-4'

export default function RegisterEntidadPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen flex-grow flex-col">
      {/* Main */}
      <div className="flex flex-grow items-center justify-center bg-mesh p-4 md:p-8">
        <div className="w-full max-w-[520px] overflow-hidden rounded-xl border border-slate-700/50 bg-[#162a3a] shadow-2xl dark:border-slate-700/50 dark:bg-[#162a3a]">
          {/* Logo */}
          <div className="flex justify-center pb-4 pt-8">
            <Image
              src="/logo_nodo.png"
              alt="NODO Logo"
              width={240}
              height={96}
              className="h-24 w-[240px] object-contain"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700/50">
            <Link
              href="/register"
              className="flex-1 py-4 text-center text-sm font-semibold text-slate-400 transition-colors hover:text-[#ec5b13]"
            >
              Crear Cuenta
            </Link>
            <Link
              href="/register"
              className="flex-1 py-4 text-center text-sm font-semibold text-slate-400 transition-colors hover:text-[#ec5b13]"
            >
              Cuenta Empresa
            </Link>
            <div className="relative flex-1 py-4 text-center text-sm font-semibold text-[#00E676]">
              Cuenta Entidad
              <span
                className="absolute bottom-0 left-0 h-0.5 w-full bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.6)]"
                aria-hidden
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:px-10">
            <div className="mb-8 text-center md:text-left">
              <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                Crea tu cuenta entidad
              </h1>
              <p className="text-sm text-slate-400">
                Registra tu entidad dentro del ecosistema NODO
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nombre de entidad
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    <DomainIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Ej. Fundación Futuro"
                    className={inputClass}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nombre
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    <PersonIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    className={inputClass}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Correo corporativo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    placeholder="email@entidad.com"
                    className={inputClass}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                    disabled
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon className="text-xl" />
                    ) : (
                      <VisibilityIcon className="text-xl" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    id="terms-entidad"
                    className="h-4 w-4 rounded border-slate-600 bg-[#1e3a52] text-[#00E676] focus:ring-[#00E676]"
                    disabled
                  />
                </div>
                <label htmlFor="terms-entidad" className="cursor-pointer text-xs leading-relaxed text-slate-400">
                  Acepto los{' '}
                  <Link href="#" className="text-[#00E676] hover:underline">
                    Términos de Servicio
                  </Link>{' '}
                  y la{' '}
                  <Link href="#" className="text-[#00E676] hover:underline">
                    Política de Privacidad
                  </Link>
                  .
                </label>
              </div>

              <button
                type="button"
                className="w-full rounded-lg bg-[#00E676] py-4 font-bold uppercase tracking-wider text-[#0B1F2D] shadow-lg shadow-[#00E676]/20 transition-all hover:bg-[#00c868] hover:scale-[1.01] active:scale-[0.99]"
              >
                CREAR CUENTA ENTIDAD
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#162a3a] px-4 font-medium text-slate-400">
                  O registrarse con
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-lg border border-slate-600 px-4 py-3 text-slate-200 transition-colors hover:bg-slate-700/50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 rounded-lg border border-slate-600 px-4 py-3 text-slate-200 transition-colors hover:bg-slate-700/50"
              >
                <svg className="h-5 w-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M1 1h9v9H1z" fill="#f25022" />
                  <path d="M11 1h9v9h-9z" fill="#7fba00" />
                  <path d="M1 11h9v9H1z" fill="#00a4ef" />
                  <path d="M11 11h9v9h-9z" fill="#ffb900" />
                </svg>
                <span className="text-sm font-medium">Microsoft</span>
              </button>
            </div>
          </div>

          {/* Bottom note */}
          <div className="border-t border-slate-700/50 bg-slate-800/30 p-6 text-center">
            <p className="text-sm text-slate-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-semibold text-[#ec5b13] hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0B1F2D] py-6 text-center text-xs tracking-widest text-slate-500">
        <p>COPYRIGHT 2026 NODO • TODOS LOS DERECHOS RESERVADOS</p>
      </footer>
    </div>
  )
}
