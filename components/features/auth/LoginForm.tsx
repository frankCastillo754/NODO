'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Resolver } from 'react-hook-form'
import { api } from '@/lib'
import { setSession } from '@/utils/auth'

const loginSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

const zodResolverCustom: Resolver<LoginFormData> = (values) => {
  const result = loginSchema.safeParse(values)
  if (result.success) return { values: result.data, errors: {} }
  const fieldErrors = result.error.flatten().fieldErrors
  const errors: Partial<
    Record<keyof LoginFormData, { message: string; type: string }>
  > = {}
  for (const key of Object.keys(fieldErrors) as (keyof LoginFormData)[]) {
    const msg = fieldErrors[key]?.[0]
    if (msg) errors[key] = { message: msg, type: 'manual' }
  }
  return { values: {}, errors }
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
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  )
}

function ArrowForwardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  )
}

function SecurityIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-4 w-4'} aria-hidden>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolverCustom,
  })

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await api.post<{
        user: { id: string; name: string; email: string; role: string }
        token: string
      }>('/auth/login', { email: data.email, password: data.password })
      setSession(res.data.token, res.data.user)
      toast.success('Sesión iniciada.')
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } })
              .response?.data?.message
          : null
      const text =
        Array.isArray(msg) ? msg[0] : typeof msg === 'string' ? msg : null
      toast.error(text ?? 'Error al ingresar. Revisa email y contraseña.')
    }
  }

  return (
    <div className="flex w-full max-w-md flex-shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200/50 border-slate-300/50 bg-[#F8FAFC] p-8 shadow-2xl md:p-10">
      {/* Branding */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-800">
          NODO
        </h1>
        <Image
          src="/logo_nodo.png"
          alt="NODO Logo"
          width={240}
          height={96}
          className="mb-4 h-24 w-[240px] object-contain transition-transform duration-300 hover:scale-105"
        />
        <p className="px-4 text-sm font-medium leading-relaxed text-slate-500">
          Infraestructura de validación que conecta al productor con el consumidor final
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Correo Electrónico
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
              <MailIcon />
            </span>
            <input
              {...register('email')}
              type="email"
              placeholder="usuario@empresa.com"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#19e694] focus:ring-2 focus:ring-[#19e694]/50"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-1.5 ml-1 flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Contraseña
            </label>
            <Link
              href="#"
              className="text-xs font-semibold text-[#1F7A5C] transition-colors hover:text-[#00E676]"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400">
              <LockIcon />
            </span>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-12 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#19e694] focus:ring-2 focus:ring-[#19e694]/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <VisibilityOffIcon className="text-xl" />
              ) : (
                <VisibilityIcon className="text-xl" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F7A5C] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1F7A5C]/20 transition-all hover:bg-[#00E676] active:scale-[0.98] disabled:opacity-50"
        >
          Iniciar Sesión
          <ArrowForwardIcon className="h-4 w-4 shrink-0" />
        </button>
      </form>

      {/* Social */}
      <div className="mt-8">
        <div className="relative mb-6 flex w-full items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-[#F8FAFC] px-4 text-xs font-medium uppercase tracking-widest text-slate-400">
            O continuar con
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 transition-colors hover:bg-slate-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-semibold text-slate-800">Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 transition-colors hover:bg-slate-50"
          >
            <svg className="h-5 w-5 fill-slate-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
            </svg>
            <span className="text-sm font-semibold text-slate-800">Microsoft</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/register"
            className="font-bold text-[#1F7A5C] transition-colors hover:text-[#00E676]"
          >
            Crear cuenta
          </Link>
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-tighter text-slate-400">
          <SecurityIcon className="text-sm text-[#19e694]/60" />
          <span className="tracking-widest">
            ENCRIPTACIÓN DE EXTREMO A EXTREMO • BLOCKCHAIN VERIFIED
          </span>
        </div>
      </div>
    </div>
  )
}
