import AuthGuard from '@/components/features/auth/AuthGuard'
import Link from 'next/link'

/** Icono qr_code_2 (decoración) */
function QrCode2Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-14 w-14'} aria-hidden>
      <path d="M3 3h4v4H3V3zm2 2v2h2V5H5zm-2 8h4v4H3v-4zm2 2v2h2v-2H5zm8-12h4v4h-4V3zm2 2v2h2V5h-2zm-2 6h2v2h2v2h-2v2h-2v-2H9v-2h2v-2zm4 2h2v2h2v2h-2v-2h-2v-2zm2-6h-2V5h-2V3h4v4zM13 13h2v2h-2v-2zm4 4h2v2h-2v-2zm-4 0h-2v-2H9v2h2v2h2z" />
    </svg>
  )
}

/** Icono verified_user (decoración) */
function VerifiedUserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-14 w-14'} aria-hidden>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  )
}

/**
 * Layout para rutas de autenticación (login, registro).
 * Si el usuario ya está logueado, redirige a home.
 * Pantalla completa con fondo mesh y card centrada.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-mesh px-4 py-10">
        {/* Decoraciones (solo desktop) */}
        <div className="pointer-events-none absolute left-10 top-10 hidden opacity-20 lg:block">
          <QrCode2Icon className="h-14 w-14 text-palette-accent lg:h-16 lg:w-16" />
        </div>
        <div className="pointer-events-none absolute bottom-10 right-10 hidden opacity-20 lg:block">
          <VerifiedUserIcon className="h-14 w-14 text-palette-accent lg:h-16 lg:w-16" />
        </div>

        {/* Card central (formulario) */}
        {children}

        {/* Barra de estado del sistema */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-palette-accent animate-pulse" aria-hidden />
            Servidores Operativos
          </div>
          <Link href="#" className="transition-colors hover:text-palette-accent">Privacidad</Link>
          <Link href="#" className="transition-colors hover:text-palette-accent">Términos</Link>
          <Link href="#" className="transition-colors hover:text-palette-accent">Soporte</Link>
        </div>
      </div>
    </AuthGuard>
  )
}
