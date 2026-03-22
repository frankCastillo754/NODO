import Header from '@/components/features/shared/Header'
import { ProductCarousel, type ProductItem } from '@/components/features/traceability/ProductCarousel'
import Link from 'next/link'

const bovinoProducts: ProductItem[] = [
  { name: 'Hamburguesa', iconKey: 'hamburger' },
  { name: 'Carne al vacío', iconKey: 'steak' },
  { name: 'Salchicha', iconKey: 'sausage' },
]

const avicolaProducts: ProductItem[] = [
  { name: 'Hamburguesa pollo', iconKey: 'chickenBurger' },
  { name: 'Nugget', iconKey: 'nugget' },
  { name: 'Sandwich', iconKey: 'sandwich' },
]

export default function TraceabilityPage() {
  return (
    <div className="min-h-screen bg-palette-background-primary">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero: icono + título + botón */}
        <section className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div
            className="flex h-48 w-full shrink-0 items-center justify-center rounded-xl border border-palette-border bg-palette-background-secondary sm:h-56 sm:max-w-sm"
            aria-hidden
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-24 w-24 text-palette-icon-placeholder"
            >
              <path d="M12 2L4 14h4l2 6 2-6h4L12 2z" />
              <circle cx="18" cy="6" r="2.5" />
            </svg>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-2xl font-bold text-palette-text-primary sm:text-3xl">
              La mejor trazabilidad para tu negocio
            </h1>
            <Link
              href="/traceability"
              className="inline-flex w-fit rounded-lg bg-palette-accent px-5 py-2.5 text-sm font-medium text-palette-text-inverse transition hover:bg-palette-accent-hover"
            >
              Trazabilidad
            </Link>
          </div>
        </section>

        {/* Categorías con carruseles */}
        <div className="flex flex-col gap-10">
          <ProductCarousel
            title="Bovino"
            products={bovinoProducts}
            cardClassName="bg-sky-50 border-sky-100"
          />
          <ProductCarousel
            title="Avícola"
            products={avicolaProducts}
            cardClassName="bg-amber-50/80 border-amber-100"
          />
        </div>
      </main>
    </div>
  )
}
