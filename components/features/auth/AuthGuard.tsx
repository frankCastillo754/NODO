'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser } from '@/utils/auth'

/**
 * Si el usuario está logueado, redirige a home.
 * Usado en layout de /login y /register.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      router.replace('/dashboard')
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando…</p>
      </div>
    )
  }

  return <>{children}</>
}
