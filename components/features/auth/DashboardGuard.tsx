'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser } from '@/utils/auth'

/**
 * Protege rutas de dashboard: solo usuarios logueados (empresas).
 * Si no hay sesión, redirige a /login.
 */
export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      router.replace('/login')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-auth-bg">
        <p className="text-sm text-slate-400">Cargando…</p>
      </div>
    )
  }

  return <>{children}</>
}
