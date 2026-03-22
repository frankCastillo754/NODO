export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500"
        aria-label="Cargando"
      />
    </div>
  )
}
