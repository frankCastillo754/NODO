'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getStoredUser, clearSession } from '@/utils/auth'
import type { StoredUser } from '@/utils/auth'

const navItems: { label: string; href: string }[] = []

/** Icono logout */
function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo_nodo.png"
        alt="Nodo"
        width={80}
        height={80}
        className="h-14 w-14 object-contain sm:h-16 sm:w-16"
        priority
      />
      <span className="text-xl font-bold tracking-tight text-white">Nodo</span>
    </div>
  )
}

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<StoredUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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

  function handleLogout() {
    setMenuOpen(false)
    clearSession()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-auth-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 md:h-16 md:gap-4 md:px-6 md:flex-nowrap lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Ir al inicio"
          onClick={() => setMenuOpen(false)}
        >
          <Logo />
        </Link>

        {/* Botón hamburguesa: solo móvil/tablet */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Navegación: panel móvil o inline desktop; botones a la derecha en desktop */}
        <nav
          aria-label="Navegación principal"
          className={`w-full basis-full flex-col gap-2 border-t border-slate-700 bg-auth-bg pt-3 md:flex md:basis-auto md:flex-1 md:flex-row md:items-center md:justify-end md:gap-4 md:border-t-0 md:bg-transparent md:pt-0 ${
            menuOpen ? 'flex' : 'hidden'
          }`}
        >
          <div className="mt-2 flex flex-col gap-2 border-t border-slate-700 pt-3 md:mt-0 md:ml-auto md:flex-row md:items-center md:gap-4 md:border-t-0 md:pt-0">
            {!user && (
              <Link
                href="/register"
                className="inline-block rounded-lg border border-palette-accent px-4 py-2.5 text-sm font-medium text-palette-accent transition-colors hover:bg-palette-accent/10"
                onClick={() => setMenuOpen(false)}
              >
                Registrar
              </Link>
            )}
            {user ? (
              <>
                <div className="hidden items-center gap-3 border-r border-slate-600 pr-6 md:flex">
                  <div className="text-right">
                    <p className="text-sm font-semibold leading-none text-white">
                      {user.name?.trim() || user.email || 'Usuario'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{user.role ?? 'Usuario'}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-palette-accent/30 bg-palette-accent/20 text-white">
                    <span className="text-sm font-semibold">
                      {(user.name?.trim() || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="line-clamp-1 text-sm font-medium text-white md:hidden">
                  {user.name?.trim() || user.email || 'Usuario'}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-300 transition-colors hover:text-palette-accent"
                >
                  <LogoutIcon />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-block rounded-lg bg-palette-accent px-4 py-2.5 text-sm font-bold text-auth-bg transition-colors hover:bg-palette-accent-hover"
                onClick={() => setMenuOpen(false)}
              >
                Ingresar
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
