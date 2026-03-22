'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold text-white">Algo salió mal</h2>
      <p className="max-w-md text-gray-400">
        Ha ocurrido un error. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-300 hover:bg-gray-800"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
