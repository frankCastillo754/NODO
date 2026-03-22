/**
 * Utilidades para objetos y comprobaciones de valor.
 */

export const isAvailable = (
  inventory: number | undefined | null
): boolean => (inventory ?? 0) > 0

export function isValidPage(value: number): boolean {
  if (value == null) return false
  if (typeof value !== 'number' || isNaN(value)) return false
  if (value <= 0) return false
  if (!Number.isInteger(value)) return false
  return true
}
