import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Middleware (auth, i18n, etc.).
 * Por ahora delega sin lógica; añadir protección de rutas cuando existan (auth)/admin.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files, api, and PWA assets.
     * Excluir sw.js y manifest para que se sirvan sin pasar por middleware.
     */
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.webmanifest|workbox-|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
