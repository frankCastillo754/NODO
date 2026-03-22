import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Verificar producto | ChainSight',
  description: 'Escanea el código QR de tu producto para ver su historial de trazabilidad.',
}

export default function VerifyProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <Suspense fallback={<div className="min-h-screen bg-[#0B1F2D] flex items-center justify-center"><p className="text-slate-400">Cargando…</p></div>}>
        {children}
      </Suspense>
    </>
  )
}
