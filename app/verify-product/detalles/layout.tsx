import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Detalles de verificación | NODO',
  description: 'Verificación de autenticidad y trazabilidad del producto.',
}

export default function DetallesLayout({ children }: { children: React.ReactNode }) {
  return children
}
