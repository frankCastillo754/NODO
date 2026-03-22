import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold text-white">404</h1>
      <p className="text-gray-400">No encontramos la página que buscas.</p>
      <Link
        href="/"
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
