'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Resolver } from 'react-hook-form'
import { api } from '@/lib'
import { setSession } from '@/utils/auth'

const registerSchema = z
  .object({
    nombreCompleto: z.string().min(1, 'El nombre es requerido'),
    empresa: z.string().optional(),
    industria: z.string().optional(),
    cargo: z.string().optional(),
    ubicacion: z.string().optional(),
    email: z.string().email('Email no válido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((v) => v === true, {
      message: 'Debes aceptar los Términos de Servicio y la Política de Privacidad',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const zodResolverCustom: Resolver<RegisterFormData> = (values) => {
  const result = registerSchema.safeParse(values)
  if (result.success) return { values: result.data, errors: {} }
  const fieldErrors = result.error.flatten().fieldErrors
  const errors: Partial<
    Record<keyof RegisterFormData, { message: string; type: string }>
  > = {}
  for (const key of Object.keys(fieldErrors) as (keyof RegisterFormData)[]) {
    const msg = fieldErrors[key]?.[0]
    if (msg) errors[key] = { message: msg, type: 'manual' }
  }
  return { values: {}, errors }
}

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Selecciona una industria' },
  { value: 'tech', label: 'Tecnología & SaaS' },
  { value: 'fintech', label: 'Finanzas & Fintech' },
  { value: 'logistics', label: 'Logística & Supply Chain' },
  { value: 'manufacturing', label: 'Manufactura' },
  { value: 'other', label: 'Otros' },
]

const inputClass =
  'w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] outline-none transition-all'

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  )
}

export default function RegisterForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolverCustom,
    defaultValues: { industria: '', termsAccepted: false },
  })

  async function onSubmit(data: RegisterFormData) {
    try {
      const res = await api.post<{
        user: { id: string; name: string; email: string; role: string }
        token: string
      }>('/auth/register', {
        name: data.nombreCompleto.trim(),
        email: data.email,
        password: data.password,
      })
      setSession(res.data.token, res.data.user)
      toast.success('Cuenta creada.')
      router.push('/')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } })
              .response?.data?.message
          : null
      const text =
        Array.isArray(msg) ? msg[0] : typeof msg === 'string' ? msg : null
      toast.error(text ?? 'Error al crear la cuenta. Intenta de nuevo.')
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-mesh p-4 md:p-8">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/logo_nodo.png"
          alt="NODO Logo"
          width={240}
          height={96}
          className="h-24 w-[240px] object-contain"
        />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[800px] overflow-hidden rounded-xl shadow-2xl flex flex-col"
        style={{
          background: 'rgba(21, 50, 70, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <Link
            href="/register/crear"
            className="flex-1 py-4 text-center text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            Crear Cuenta
          </Link>
          <button
            type="button"
            className="relative flex-1 py-4 text-sm font-semibold text-white"
          >
            Cuenta Empresa
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#00E676]" />
          </button>
          <Link
            href="/register/entidad"
            className="flex-1 py-4 text-center text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            Cuenta Entidad
          </Link>
        </div>

        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
              Crea tu cuenta empresa
            </h1>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">
              Únete a la plataforma de trazabilidad verificada del futuro
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Nombre de empresa
                  </label>
                  <input
                    {...register('empresa')}
                    type="text"
                    placeholder="Ej: NODO Tech S.A."
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Tipo de industria
                  </label>
                  <select
                    {...register('industria')}
                    className={`${inputClass} appearance-none`}
                  >
                    {INDUSTRY_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value} disabled={value === ''}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Cargo
                  </label>
                  <input
                    {...register('cargo')}
                    type="text"
                    placeholder="Ej: Gerente de Operaciones"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Ubicación
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-500">
                      <LocationIcon />
                    </span>
                    <input
                      {...register('ubicacion')}
                      type="text"
                      placeholder="Ciudad, País"
                      className={`${inputClass} pl-10 pr-4`}
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Nombre completo
                  </label>
                  <input
                    {...register('nombreCompleto')}
                    type="text"
                    placeholder="Tu nombre y apellido"
                    className={inputClass}
                    autoComplete="name"
                  />
                  {errors.nombreCompleto && (
                    <p className="text-sm text-red-400">{errors.nombreCompleto.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Correo corporativo
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="nombre@empresa.com"
                    className={inputClass}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Contraseña
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••••••"
                    className={inputClass}
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="ml-1 text-sm font-medium text-slate-300">
                    Confirmar contraseña
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••••••"
                    className={inputClass}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <div className="pt-4">
                  <label className="group flex cursor-pointer items-start gap-3">
                    <div className="relative mt-1">
                      <input
                        {...register('termsAccepted')}
                        type="checkbox"
                        className="peer hidden"
                      />
                      <div className="flex size-5 items-center justify-center rounded border border-white/20 bg-slate-900 transition-all peer-checked:border-[#ec5b13] peer-checked:bg-[#ec5b13] [&_.check-icon]:scale-0 peer-checked:[&_.check-icon]:scale-100">
                        <svg
                          className="check-icon h-3 w-3 text-white transition-transform"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm leading-tight text-slate-400 transition-colors group-hover:text-slate-300">
                      Acepto los{' '}
                      <Link href="#" className="text-[#ec5b13] hover:underline">
                        Términos de Servicio
                      </Link>{' '}
                      y la{' '}
                      <Link href="#" className="text-[#ec5b13] hover:underline">
                        Política de Privacidad
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="mt-1 text-sm text-red-400">{errors.termsAccepted.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#00E676] py-4 font-black tracking-wider text-sm text-[#0B1F2D] shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all hover:bg-[#00E676]/90 active:scale-[0.98] disabled:opacity-50"
              >
                CREAR CUENTA EMPRESA
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-4 font-bold tracking-widest text-slate-500">
                O continúa con
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              className="flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10"
            >
              <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-semibold">Registrarse con Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10"
            >
              <svg className="size-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M1 1h9v9H1z" fill="#f25022" />
                <path d="M11 1h9v9h-9z" fill="#7fba00" />
                <path d="M1 11h9v9H1z" fill="#00a4ef" />
                <path d="M11 11h9v9h-9z" fill="#ffb900" />
              </svg>
              <span className="text-sm font-semibold">Registrarse con Microsoft</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm font-medium tracking-wide text-slate-500">
        © 2026 NODO. Todos los derechos reservados.
      </footer>
    </div>
  )
}
