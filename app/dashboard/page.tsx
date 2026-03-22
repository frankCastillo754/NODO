'use client'

import Script from 'next/script'
import Link from 'next/link'
import { useRef } from 'react'
import Header from '@/components/features/shared/Header'

const productLines = [
  {
    title: 'Productos en Trazabilidad',
    count: '6 Productos',
    products: [
      {
        name: 'Carne al Vacío',
        desc: 'Cortes premium sellados al vacío',
        details: 'Con historial completo de temperatura, certificado de origen y trazabilidad de granja a mesa',
        emoji: '🥩',
        batches: 42,
        status: 'Activo',
        certification: 'ISO 22000',
        origin: 'Pastizales de Córdoba',
        color: 'from-red-500/20 to-red-600/10',
      },
      {
        name: 'Hamburguesa Gourmet',
        desc: 'Blend gourmet premium',
        details: 'Mezcla de cortes selectos con trazabilidad integrada, control de humedad y certificación de calidad',
        emoji: '🍔',
        batches: 58,
        status: 'Activo',
        certification: 'ISO 22000',
        origin: 'Establecimientos Premium',
        color: 'from-orange-500/20 to-orange-600/10',
      },
      {
        name: 'Salchichas Artesanales',
        desc: 'Producción artesanal certificada',
        details: 'Especias validadas, proceso auditado, control de pH y vinculación con criadores verificados',
        emoji: '🌭',
        batches: 24,
        status: 'Activo',
        certification: 'HACCP',
        origin: 'Producción Nacional',
        color: 'from-pink-500/20 to-pink-600/10',
      },
      {
        name: 'Harina de Hueso',
        desc: 'Suplemento nutricional premium procesado',
        details: 'Producto mineralizado, esterilizado y certificado para consumo animal, trazabilidad completa desde materia prima',
        emoji: '🏭',
        batches: 35,
        status: 'Activo',
        certification: 'ISO 9001',
        origin: 'Planta de Procesamiento',
        color: 'from-yellow-500/20 to-yellow-600/10',
      },
      {
        name: 'Zapatos de Cuero',
        desc: 'Calzado industrial de cuero certificado',
        details: 'Material ganadero certificado de origen, procesado con estándares internacionales de curtido ecológico',
        emoji: '👞',
        batches: 18,
        status: 'Activo',
        certification: 'LEATHER CERT',
        origin: 'Curtiduría Nacional',
        color: 'from-amber-500/20 to-amber-600/10',
      },
      {
        name: 'Menudos Frescos',
        desc: 'Subproductos selectos refrigerados',
        details: 'Procesados bajo normas HACCP, cadena de frío garantizada, disponibles en diferentes presentaciones',
        emoji: '🥣',
        batches: 67,
        status: 'Activo',
        certification: 'HACCP',
        origin: 'Frigorífico Central',
        color: 'from-cyan-500/20 to-cyan-600/10',
      },
    ],
  },
]

const stats = [
  { icon: 'bx-package', label: 'Total de Lotes', value: '124', trend: '+12% este mes' },
  { icon: 'bx-check-circle', label: 'Verificados', value: '98%', trend: 'Sin anomalías' },
  { icon: 'bx-map-pin', label: 'Origen Trazado', value: '100%', trend: '42 proveedores' },
  { icon: 'bx-time-five', label: 'Tiempo Promedio', value: '2.3h', trend: 'Desde origen' },
]

const recentActivity = [
  { id: 1, product: 'Carne al Vacío', batch: 'LOTE-2026-001', action: 'Escaneado por Consumer', time: 'Hace 10 min', icon: 'check-circle' },
  { id: 2, product: 'Hamburguesa Gourmet', batch: 'LOTE-2026-045', action: 'Verificado en Tránsito', time: 'Hace 34 min', icon: 'check-circle' },
  { id: 3, product: 'Salchichas Artesanales', batch: 'LOTE-2026-089', action: 'Registrado en Sistema', time: 'Hace 1h', icon: 'check-circle' },
  { id: 4, product: 'Carne al Vacío', batch: 'LOTE-2026-002', action: 'En Almacén Destino', time: 'Hace 2h', icon: 'check-circle' },
]

function ProductCarousel({ products }: { products: typeof productLines[0]['products'] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map((product) => (
          <div
            key={product.name}
            className="group relative min-w-[280px] sm:min-w-[320px] md:min-w-[360px] flex flex-col rounded-xl border border-slate-300 bg-white p-4 sm:p-5 transition-all duration-300 hover:border-emerald-custom hover:shadow-xl hover:shadow-emerald-custom/15 hover:bg-slate-50 active:scale-95"
          >
            {/* Header con icono y status */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${product.color} transition-all duration-300 group-hover:scale-105 flex-shrink-0 text-3xl`}>
                {product.emoji}
              </div>
              <div className="flex flex-col items-end gap-1 flex-1">
                <span className="rounded-full bg-emerald-custom/20 px-2.5 py-0.5 text-xs font-bold text-emerald-custom whitespace-nowrap">
                  {product.status}
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  <i className="bx bx-package text-slate-500 text-xs mr-0.5"></i>
                  {product.batches} lotes
                </span>
              </div>
            </div>

            {/* Título */}
            <h3 className="mb-1 text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-custom line-clamp-2">
              {product.name}
            </h3>

            {/* Descripción corta */}
            <p className="mb-3 text-xs text-slate-600 font-medium line-clamp-2">{product.desc}</p>

            {/* Detalles expandidos */}
            <div className="mb-4 space-y-2 flex-grow">
              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{product.details}</p>
            </div>

            {/* Badges informativos */}
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 hover:bg-slate-200 transition-colors border border-slate-200">
                <i className="bx bx-award text-emerald-custom text-xs"></i>
                <span className="text-xs font-semibold text-slate-700">{product.certification}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 hover:bg-slate-200 transition-colors border border-slate-200">
                <i className="bx bx-map-pin text-emerald-custom text-xs"></i>
                <span className="text-xs font-semibold text-slate-700 truncate">{product.origin}</span>
              </div>
            </div>

            {/* Botón CTA */}
            <Link
              href={`/dashboard/registro?product=${encodeURIComponent(product.name)}`}
              className="mt-auto w-full flex items-center justify-center gap-2 rounded-md bg-emerald-custom px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-emerald-hover hover:shadow-md active:scale-95"
            >
              <i className="bx bx-chevron-right text-sm"></i>
              Ver Detalles
            </Link>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={() => scroll('left')}
        className="group absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 transform rounded-full bg-gradient-to-r from-emerald-custom/20 to-emerald-custom/10 p-2.5 text-emerald-custom border border-emerald-custom/30 transition-all hover:from-emerald-custom/40 hover:to-emerald-custom/20 hover:shadow-lg sm:block"
        aria-label="Scroll izquierda"
      >
        <i className="bx bx-chevron-left text-xl"></i>
      </button>
      <button
        onClick={() => scroll('right')}
        className="group absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 transform rounded-full bg-gradient-to-r from-emerald-custom/20 to-emerald-custom/10 p-2.5 text-emerald-custom border border-emerald-custom/30 transition-all hover:from-emerald-custom/40 hover:to-emerald-custom/20 hover:shadow-lg sm:block"
        aria-label="Scroll derecha"
      >
        <i className="bx bx-chevron-right text-xl"></i>
      </button>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/dist/boxicons.js" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" />

      <div className="min-h-screen bg-auth-bg font-sans text-slate-100 antialiased">
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <div className="flex h-full grow flex-col">
            <Header />

            <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {/* Hero / Header mejorado */}
              <section className="mb-6 rounded-lg border border-slate-700 bg-gradient-to-r from-slate-900/60 to-slate-900/30 p-4 sm:p-6">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="bx bx-package text-emerald-custom text-base"></i>
                        <h1 className="text-base sm:text-lg font-bold text-white">
                          Panel de Control - Trazabilidad
                        </h1>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-snug">
                        Monitorea en tiempo real el viaje de cada producto desde el origen hasta el consumidor final. Trazabilidad completa con validación de cadena de frío y certificaciones.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <i className="bx bx-info-circle text-slate-500 text-sm"></i>
                      Inicia el proceso de trazabilidad para tus productos de carne de res
                    </p>
                    <Link
                      href="/dashboard/registro"
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-custom px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-emerald-hover active:scale-95 whitespace-nowrap"
                    >
                      <i className="bx bx-plus text-sm"></i>
                      Registrar Trazabilidad
                    </Link>
                  </div>
                </div>
              </section>

              {/* Estadísticas */}
              <section className="mb-6 rounded-lg bg-slate-700/30 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <i className="bx bx-bar-chart text-emerald-custom text-base"></i>
                  <h2 className="text-sm sm:text-base font-bold text-white">Resumen Operacional</h2>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-slate-600 bg-slate-100 p-3 transition-all hover:border-emerald-custom hover:bg-white hover:shadow-md"
                    >
                      <i className={`bx ${stat.icon} text-lg text-emerald-custom mb-2 block`}></i>
                      <p className="text-xs text-slate-600 mb-1 font-medium">{stat.label}</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 mb-0.5">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.trend}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Productos */}
              <section className="mb-6 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="bx bx-package text-emerald-custom text-base"></i>
                    <h2 className="text-sm sm:text-base font-bold text-white">Productos en Trazabilidad</h2>
                  </div>
                  <ProductCarousel products={productLines[0].products} />
                </div>
              </section>

              {/* Actividad reciente */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <i className="bx bx-history text-emerald-custom text-base"></i>
                  <h2 className="text-sm sm:text-base font-bold text-white">Actividad Reciente</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="group rounded-lg border border-slate-300 bg-white p-3 sm:p-4 transition-all duration-300 hover:border-emerald-custom hover:bg-slate-50 hover:shadow-md"
                    >
                      <div className="flex gap-3">
                        {/* Icono de estado */}
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-emerald-custom/15 group-hover:bg-emerald-custom/25 transition-colors">
                          <i className={`bx bx-${activity.icon} text-emerald-custom text-base`}></i>
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-0.5 mb-1.5">
                            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-emerald-custom transition-colors">
                              {activity.product}
                            </h3>
                            <span className="text-xs font-mono text-emerald-custom/70 bg-emerald-custom/10 px-1.5 py-0.5 rounded w-fit border border-emerald-custom/20">
                              {activity.batch}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 flex items-center gap-1 mb-1.5">
                            <i className="bx bx-info-circle text-slate-500 text-xs flex-shrink-0"></i>
                            <span className="line-clamp-1">{activity.action}</span>
                          </p>

                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <i className="bx bx-time text-slate-500 text-xs"></i>
                            <span className="font-medium">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>


            </main>

            {/* Footer */}
            <footer className="border-t border-slate-700 bg-auth-bg px-4 py-6 sm:px-6 sm:py-8 text-center">
              <div className="flex flex-col items-center justify-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <i className="bx bx-restaurant text-emerald-custom text-2xl"></i>
                  <span className="text-sm sm:text-base font-bold text-white">ChainSight Carne</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  © 2026 Sistema de Trazabilidad | Privacidad · Términos
                </div>
                <div className="flex gap-4">
                  <Link href="#" className="text-slate-400 transition hover:text-emerald-custom group" title="Soporte">
                    <i className="bx bx-help-circle text-lg group-hover:scale-110 transition"></i>
                  </Link>
                  <Link href="#" className="text-slate-400 transition hover:text-emerald-custom group" title="Configuración">
                    <i className="bx bx-cog text-lg group-hover:scale-110 transition"></i>
                  </Link>
                  <Link href="#" className="text-slate-400 transition hover:text-emerald-custom group" title="Notificaciones">
                    <i className="bx bx-bell text-lg group-hover:scale-110 transition"></i>
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  )
}
