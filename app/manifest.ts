import type { MetadataRoute } from 'next'
import { APP_NAME } from '@/lib/constants'
import { palette } from '@/lib/palette'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: 'Verificación de productos y trazabilidad para empresas.',
    start_url: '/',
    display: 'standalone',
    scope: '/',
    background_color: palette.background.primary,
    theme_color: palette.accent.DEFAULT,
    lang: 'es',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
