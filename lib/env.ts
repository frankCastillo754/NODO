/**
 * Validación de variables de entorno (cliente).
 * Para validación en build/server usar schema según necesidad.
 */

const requiredEnv = [
  'NEXT_PUBLIC_API_URL',
] as const

type EnvKeys = (typeof requiredEnv)[number]

/**
 * Obtiene una variable de entorno requerida.
 * En desarrollo puede usar valores por defecto si no está definida.
 */
export function getEnv(key: EnvKeys): string {
  const value = process.env[key]
  if (process.env.NODE_ENV === 'production' && !value) {
    throw new Error(`Missing required env: ${key}`)
  }
  return value ?? ''
}

/** URL base de la API (cliente) */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

/** URL del sitio (cliente) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
