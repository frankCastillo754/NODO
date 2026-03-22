'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-[#05111a] text-white font-sans antialiased">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0B1F2D]/80 backdrop-blur-md border-b border-white/10 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logo_nodo.png"
            alt="NODO Logo"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-bold tracking-tight">NODO</span>
        </div>
        <div className="flex items-center gap-4">
          <a aria-label="Facebook" className="bg-[#162C3D] p-2 rounded-full hover:bg-white/10 transition-colors text-white" href="#">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a aria-label="Instagram" className="bg-[#162C3D] p-2 rounded-full hover:bg-white/10 transition-colors text-white" href="#">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
          </a>
          <a aria-label="LinkedIn" className="bg-[#162C3D] p-2 rounded-full hover:bg-white/10 transition-colors text-white" href="#">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </a>
        </div>
      </header>

      <main className="pt-[64px] min-h-screen flex flex-col">
        {/* Map Section */}
        <section className="relative h-[60vh] min-h-[400px] w-full bg-[#0B1F2D] overflow-hidden">
          {/* Dark map-style background */}
          <div className="absolute inset-0 opacity-40">
            <div
              className="w-full h-full bg-gradient-to-br from-[#0B1F2D] via-[#162C3D] to-[#0B1F2D]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='50' viewBox='0 0 100 50'%3E%3Cpath fill='%23162C3D' d='M0 25 Q25 15 50 25 T100 25 L100 50 L0 50 Z'/%3E%3Cpath fill='%23162C3D' d='M0 20 Q30 10 60 22 T100 18 L100 50 L0 50 Z' opacity='0.6'/%3E%3C/svg%3E")`,
              }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
              <defs>
                <filter id="glow-line">
                  <feGaussianBlur result="coloredBlur" stdDeviation="3" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#1F7A5C" />
                  <stop offset="50%" stopColor="#00E676" />
                  <stop offset="100%" stopColor="#00E676" />
                </linearGradient>
              </defs>
              {/* Route: Costa Rica -> Santa Cruz (curved path) */}
              <path
                d="M 180 360 Q 480 120 720 280"
                fill="none"
                filter="url(#glow-line)"
                stroke="url(#routeGradient)"
                strokeDasharray="10 5"
                strokeWidth="3"
                className="opacity-90"
              >
                <animate attributeName="stroke-dashoffset" dur="30s" from="1000" to="0" repeatCount="indefinite" />
              </path>
              {/* Origin: Costa Rica */}
              <circle cx="180" cy="360" r="4" fill="#1F7A5C" stroke="white" strokeWidth="1" />
              <text fill="#9ca3af" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" x="120" y="375">Costa Rica</text>
              {/* Current position (pulsing dot on route) */}
              <circle cx="480" cy="200" r="6" fill="#00E676" filter="url(#glow-line)" className="animate-pulse" />
              <circle cx="480" cy="200" r="10" fill="none" stroke="#00E676" strokeOpacity="0.5" strokeWidth="1">
                <animate attributeName="r" dur="2s" from="6" to="15" repeatCount="indefinite" />
                <animate attributeName="strokeOpacity" dur="2s" from="0.5" to="0" repeatCount="indefinite" />
              </circle>
              {/* Destination: Santa Cruz */}
              <circle cx="720" cy="280" r="4" fill="#00E676" stroke="white" strokeWidth="1" />
              <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" x="730" y="285">Santa Cruz, BOL</text>
            </svg>
          </div>

          {/* Badge */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-2xl ring-1 ring-black/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E676]" />
              </span>
              <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em] whitespace-nowrap">
                En tránsito · Costa Rica → Santa Cruz
              </span>
            </div>
          </div>

          {/* Route label */}
          <div className="absolute bottom-12 left-10 hidden lg:block z-10">
            <h2 className="text-4xl font-bold tracking-tight">
              Costa Rica <span className="text-[#1F7A5C] mx-2">→</span> Santa Cruz
            </h2>
            <p className="text-gray-400 mt-2 font-mono text-sm tracking-wider uppercase">ID Envío: NODO-772-2026-RTD</p>
          </div>

          {/* Stats cards */}
          <div className="absolute bottom-12 right-10 flex gap-4 z-10">
            <div className="bg-[#162C3D]/60 backdrop-blur-xl p-5 rounded-[20px] border border-white/10 shadow-2xl">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Temp. actual</p>
              <p className="text-2xl font-mono text-white">-1.2°C</p>
            </div>
            <div className="bg-[#162C3D]/60 backdrop-blur-xl p-5 rounded-[20px] border border-white/10 shadow-2xl">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Humedad</p>
              <p className="text-2xl font-mono text-white">84%</p>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="flex-grow bg-[#05111a] p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Traceability summary */}
          <article className="bg-[#162C3D] p-8 rounded-[20px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold">Resumen de Trazabilidad</h3>
              <span className="bg-[#00E676]/10 text-[#00E676] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-[#00E676]/20">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd" /></svg>
                Registrado en Blockchain
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Producto</p>
                <p className="font-medium">Entraña Corte Premium</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Gramos</p>
                <p className="font-medium">1100</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Exportador</p>
                <p className="font-medium">NODO Export</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Lote</p>
                <span className="inline-block mt-1 bg-white/5 px-2 py-0.5 rounded text-sm border border-white/10 font-mono">L-2026-X</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Fecha de faena</p>
                <p className="font-medium">Febrero 2026</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Shipment ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm">NODO-772-2026-RTD</span>
                </div>
              </div>
            </div>
            <Link
              href="/verify-product"
              className="mt-4 w-full bg-[#1F7A5C] hover:bg-[#1F7A5C]/90 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 group"
            >
              Ver trazabilidad completa
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </article>

          {/* Rating card */}
          <article className="bg-[#162C3D] p-8 rounded-[20px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col items-center justify-center text-center min-h-[280px]">
            <h3 className="text-2xl font-bold mb-2">Califica este producto</h3>
            <p className="text-gray-400 text-sm mb-6">Tu opinión ayuda a mejorar la cadena de valor</p>
            <div className="mb-4">
              <span className="text-6xl font-black text-white">4.8</span>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <svg key={i} className="w-8 h-8 text-[#00E676] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
              <svg className="w-8 h-8 text-white/20 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <p className="text-sm text-gray-500 font-medium">Basado en 156 valoraciones</p>
            <div className="mt-8 flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#162C3D] bg-[#1F7A5C]/50" />
              <div className="w-10 h-10 rounded-full border-2 border-[#162C3D] bg-[#1F7A5C]/50" />
              <div className="w-10 h-10 rounded-full border-2 border-[#162C3D] bg-[#1F7A5C]/50" />
              <div className="w-10 h-10 rounded-full border-2 border-[#162C3D] bg-[#1F7A5C] flex items-center justify-center text-[10px] font-bold">+150</div>
            </div>
          </article>
        </section>
      </main>

      <footer className="p-8 border-t border-white/5 bg-[#0B1F2D]/50 text-center text-xs text-gray-500">
        <p>© 2026 NODO Technologies. Powered by Blockchain Connectivity.</p>
      </footer>
    </div>
  )
}
