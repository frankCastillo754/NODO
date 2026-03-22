/**
 * Paleta de colores del proyecto.
 * Basada en el diseño Panel de Control ChainSight (primary verde, fondos light/dark).
 * Usar estas claves en componentes y en tailwind.config (theme.extend.colors).
 */

export const palette = {
  /** Fondo principal (light) y dark para modo oscuro */
  background: {
    primary: '#f6f8f7',
    secondary: '#FFFFFF',
    dark: '#11211b',
  },

  /** Color de acento / CTA (verde ChainSight) */
  accent: {
    DEFAULT: '#19e694',
    hover: '#14c77a',
    light: 'rgba(25, 230, 148, 0.1)',
  },

  /** Texto (slate-like) */
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    inverse: '#11211b',
  },

  /** Bordes y divisores */
  border: {
    light: '#e2e8f0',
    DEFAULT: '#cbd5e1',
    dark: '#1e293b',
  },

  /** Iconos placeholder y secundarios */
  icon: {
    placeholder: '#64748b',
    primary: '#0f172a',
  },

  /** Brand (mantener por compatibilidad; acento principal es accent) */
  brand: {
    youtube: '#ef4444',
    youtubeDark: '#b91c1c',
  },
} as const

export type Palette = typeof palette
