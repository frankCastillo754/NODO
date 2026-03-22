import type { Metadata } from 'next'
import DashboardGuard from '@/components/features/auth/DashboardGuard'

export const metadata: Metadata = {
  title: 'Dashboard Empresa | Nodo',
  description: 'Gestión de trazabilidad y líneas de producto para empresas.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        rel="stylesheet"
      />
      <DashboardGuard>{children}</DashboardGuard>
    </>
  )
}
