/**
 * Formateo de moneda y redondeo monetario.
 */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/** Redondea montos a 2 decimales para evitar errores de punto flotante en cálculos monetarios. */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100
}
