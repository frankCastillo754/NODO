'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getStoredUser } from '@/utils/auth'

/**
 * Muestra los botones Registrar e Ingresar solo cuando el usuario NO está logueado.
 */
export default function HomeAuthActions() {
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null)

  useEffect(() => {
    setUser(getStoredUser())
    const onAuthChange = () => setUser(getStoredUser())
    window.addEventListener('auth-change', onAuthChange)
    window.addEventListener('auth-error', onAuthChange)
    return () => {
      window.removeEventListener('auth-change', onAuthChange)
      window.removeEventListener('auth-error', onAuthChange)
    }
  }, [])

  if (user) return null

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-xl bg-palette-accent px-8 py-4 text-base font-bold text-auth-bg shadow-lg shadow-palette-accent/20 transition-all hover:bg-palette-accent-hover hover:shadow-palette-accent/30"
      >
        Registrar
      </Link>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl border-2 border-palette-accent px-8 py-4 text-base font-bold text-palette-accent transition-all hover:bg-palette-accent/10"
      >
        Ingresar
      </Link>
    </div>
  )
}
