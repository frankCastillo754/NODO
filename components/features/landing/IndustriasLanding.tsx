"use client"

import { useState } from 'react'
import { APP_NAME } from '@/lib/constants'
import Header from '@/components/features/shared/Header'
import Footer from '@/components/features/shared/Footer'
import HomeAuthActions from '@/components/features/shared/HomeAuthActions'
import Link from 'next/link'
import Image from 'next/image'

// const HERO_BACKGROUND_IMAGE = '/logo_nodo.png'

// Iconos SVG personalizados
const SearchIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const QrScannerIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" />
    <line x1="9" y1="3" x2="15" y2="3" />
    <line x1="9" y1="21" x2="15" y2="21" />
    <line x1="3" y1="9" x2="3" y2="15" />
    <line x1="21" y1="9" x2="21" y2="15" />
  </svg>
)

const ArrowForwardIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// Iconos para botones de navegación
const CertificationIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L2 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
)

const TimelineIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
    <line x1="4" y1="4" x2="8" y2="8" />
  </svg>
)

const TraceabilityIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12h4l3-9 4 18 3-9h4" />
  </svg>
)

const DashboardIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
)

const ExportIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// Iconos para características
const BlockchainIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="12" y1="8" x2="12" y2="16" />
  </svg>
)

const CheckIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const QrIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="6" height="6" />
    <rect x="15" y="3" width="6" height="6" />
    <rect x="3" y="15" width="6" height="6" />
    <rect x="15" y="15" width="6" height="6" />
  </svg>
)

const AnalyticsIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const ShieldIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
  </svg>
)

const PaymentIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

export default function IndustriasLanding() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Buscando:', searchQuery)
    }
  }

  const navButtons = [
    { icon: <CertificationIcon />, label: 'CERTIFICACIONES', href: '/certifications' },
    { icon: <TimelineIcon />, label: 'LÍNEA DE TIEMPO', href: '/timeline' },
    { icon: <TraceabilityIcon />, label: 'TRAZABILIDAD POR LOTE', href: '/traceability' },
    { icon: <DashboardIcon />, label: 'DASHBOARD EMPRESARIAL', href: '/dashboard' },
    { icon: <ExportIcon />, label: 'REQUISITOS DE EXPORTACIÓN', href: '/export-requirements' },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0f1a] via-[#0f1420] to-[#05080f] font-sans text-slate-100 antialiased">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-2 py-4 sm:py-12">
        <div className="w-full max-w-6xl">
          {/* Header con logo y acciones */}
          <div className="mb-12 text-center sm:mb-16 text-align-center relative">


  {/* <Image
    src={HERO_BACKGROUND_IMAGE}
    alt="NODO - Trazabilidad blockchain"
    width={100}
    height={100}
    priority
    className="opacity-80"
    text-align="center"
  /> */}

  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />
            {/* <HomeAuthActions /> */}
          </div>

          {/* Hero con buscador */}
          <div className="mb-16">
            {/* Buscador */}
            <div className="mt-6">
              <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar lote, certificado, producto o código QR..."
                    className="w-full rounded-xl border border-emerald-500/30 bg-slate-900/60 py-3 pl-11 pr-24 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-medium text-white transition-all hover:from-emerald-400 hover:to-teal-400"
                  >
                    Buscar
                  </button>
                </div>
              </form>
            </div>

            {/* Botones de navegación */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {navButtons.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className="group flex items-center gap-2 rounded-full border border-emerald-500/30 bg-slate-800/40 px-3 py-1.5 text-[10px] font-medium text-emerald-300 backdrop-blur-sm transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-200 sm:gap-2.5 sm:px-4 sm:py-2 sm:text-xs"
                >
                  <span className="text-emerald-400">{btn.icon}</span>
                  <span className="whitespace-nowrap">{btn.label}</span>
                </Link>
              ))}
            </div>

            {/* Texto destacado */}
            <p className="mt-8 text-center text-sm text-emerald-300/70">
              Trazabilidad en tiempo real con tecnología blockchain
            </p>
          </div>

          {/* Características Principales */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <BlockchainIcon />, title: 'Verificación Blockchain', desc: 'Toda la información está registrada en blockchain para máxima transparencia e inmutabilidad.' },
                { icon: <CheckIcon />, title: 'Certificaciones ISO', desc: 'Integración con estándares ISO para asegurar calidad y trazabilidad en cada paso.' },
                { icon: <QrIcon />, title: 'Código QR', desc: 'Genera y escanea códigos QR para identificar productos instantáneamente.' },
                { icon: <AnalyticsIcon />, title: 'Reportes Detallados', desc: 'Análisis en tiempo real de producción, despachos y conformidad de productos.' },
                { icon: <ShieldIcon />, title: 'Seguridad Web3', desc: 'Encriptación de extremo a extremo y autenticación descentralizada.' },
                { icon: <PaymentIcon />, title: 'Gestión de Pagos', desc: 'Planes flexibles con facturación transparente para todos los usuarios.' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center rounded-xl border border-emerald-500/20 bg-slate-800/30 p-4 text-center transition-all hover:border-emerald-400/50 hover:bg-slate-800/50 sm:p-6">
                  <div className="mb-3 rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ¿Cómo Funciona? */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
              ¿Cómo Funciona?
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {[
                { step: '1', icon: <BlockchainIcon className="h-6 w-6" />, title: 'Registra', description: 'Crea tu cuenta como consumidor, productor o empresa certificadora ISO.' },
                { step: '2', icon: <QrIcon className="h-6 w-6" />, title: 'Registra Productos', description: 'Genera códigos QR únicos para cada lote de productos con datos verificables.' },
                { step: '3', icon: <SearchIcon className="h-6 w-6" />, title: 'Comparte & Verifica', description: 'Consumidores escanean para ver el historial completo y certificaciones.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-white text-base">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Para Diferentes Usuarios */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
              Para Diferentes Usuarios
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {[
                { role: 'Consumidor', icon: <SearchIcon className="h-5 w-5" />, benefit: 'Verifica autenticidad' },
                { role: 'Productor', icon: <BlockchainIcon className="h-5 w-5" />, benefit: 'Gestiona producción' },
                { role: 'Distribuidor', icon: <ArrowForwardIcon className="h-5 w-5" />, benefit: 'Controla logística' },
                { role: 'Empresa ISO', icon: <CheckIcon className="h-5 w-5" />, benefit: 'Certifica estándares' },
                { role: 'Regulador', icon: <ShieldIcon className="h-5 w-5" />, benefit: 'Supervisa compliance' },
                { role: 'Retail', icon: <QrIcon className="h-5 w-5" />, benefit: 'Ofrece garantía' },
              ].map((user) => (
                <div key={user.role} className="rounded-xl border border-emerald-500/20 bg-slate-800/30 p-3 text-center transition-all hover:border-emerald-400/50 hover:bg-slate-800/50">
                  <div className="mb-1 flex justify-center text-emerald-400">
                    {user.icon}
                  </div>
                  <h3 className="mb-0.5 text-xs font-semibold text-white sm:text-sm">{user.role}</h3>
                  <p className="text-[10px] text-slate-400 sm:text-xs">{user.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 text-center sm:p-12 backdrop-blur-sm">
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Comienza hoy</h2>
            <p className="mb-6 text-sm sm:text-base text-slate-300">
              Únete a la revolución de la trazabilidad blockchain
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white transition-all hover:from-emerald-400 hover:to-teal-400 hover:scale-105"
              >
                Crear Cuenta
                <ArrowForwardIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/verify-product"
                className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/50 px-6 py-3 text-sm font-bold text-emerald-300 transition-all hover:bg-emerald-500/10"
              >
                Escanear Producto
                <QrScannerIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}