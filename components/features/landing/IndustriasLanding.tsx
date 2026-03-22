import { APP_NAME } from '@/lib/constants'
import Header from '@/components/features/shared/Header'
import Footer from '@/components/features/shared/Footer'
import HomeAuthActions from '@/components/features/shared/HomeAuthActions'
import Link from 'next/link'
import Image from 'next/image'

const HERO_BACKGROUND_IMAGE = '/nodoBackground.jpg'

function QrScannerIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M3 3h6v2H5v4H3V3zm2 12H3v4h4v-2H5v-2zm12 0v2h4v4h2v-6h-6zm0-12h2v4h4v2h-6V3zM9 9h2v2H9V9zm4 0h2v2h-2V9zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" />
    </svg>
  )
}

function PrecisionManufacturingIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M19.93 8.21l-3.6 1.68L14 7.7V6.3l2.33-2.19 3.6 1.68c.38.18.82.01 1-.36.18-.38.01-.82-.36-1L16.65 2.6c-.38-.18-.82-.01-1 .36-.18.38-.01.82.36 1L18 4.9v1.4l2.33 2.19c.38.18.82.01 1-.36.18-.38.01-.82-.36-1zM4.5 11h-2V9H1v6h1.5v-2h2v2H6V9H4.5v2zm2.5-.5h1v1H7v-1zm2 0h1v1H9v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zM22 14v-2h-1.5v2h-2v1.5h2v2H22v-2h1.5v-2H22zm-1.5 2.5h-2v-1h2v1z" />
    </svg>
  )
}

function ArrowForwardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-4 w-4'} aria-hidden>
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  )
}

function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
    </svg>
  )
}

function BlockchainIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
    </svg>
  )
}

function CertificationIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 2L2 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
    </svg>
  )
}

function PaymentIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4h3l3-3-3-3zm-3 6h-2v2h-2v-2h-2v-2h2V8h2v2h2v2z" />
    </svg>
  )
}

function SecurityIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 sm:p-6 text-center">
      <div className="mb-3 rounded-lg bg-palette-accent/10 p-3 text-palette-accent">{icon}</div>
      <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

export default function IndustriasLanding() {
  return (
    <div className="flex min-h-screen flex-col bg-auth-bg font-sans text-slate-100 antialiased">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
               <span className="text-palette-accent">NODO</span>
            </h1>

            <HomeAuthActions />
          </div>

          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 aspect-[21/9] min-h-[200px] sm:min-h-[260px]">
              <Image
                src={HERO_BACKGROUND_IMAGE}
                alt="NODO - Trazabilidad blockchain"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/verify-product"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-palette-accent px-8 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-palette-accent-hover"
              >
                Escanear
                <ArrowForwardIcon />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-palette-accent px-8 py-3 text-sm font-bold text-palette-accent transition-colors hover:bg-palette-accent/10"
              >
                Panel gerencial
                <ArrowForwardIcon />
              </Link>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<BlockchainIcon className="h-6 w-6" />}
                title="Verificación Blockchain"
                description="Toda la información está registrada en blockchain para máxima transparencia e inmutabilidad."
              />
              <FeatureCard
                icon={<CertificationIcon className="h-6 w-6" />}
                title="Certificaciones ISO"
                description="Integración con estándares ISO para asegurar calidad y trazabilidad en cada paso."
              />
              <FeatureCard
                icon={<QrScannerIcon className="h-6 w-6" />}
                title="Código QR"
                description="Genera y escanea códigos QR para identificar productos instantáneamente."
              />
              <FeatureCard
                icon={<AnalyticsIcon className="h-6 w-6" />}
                title="Reportes Detallados"
                description="Análisis en tiempo real de producción, despachos y conformidad de productos."
              />
              <FeatureCard
                icon={<SecurityIcon className="h-6 w-6" />}
                title="Seguridad Web3"
                description="Encriptación de extremo a extremo y autenticación descentralizada."
              />
              <FeatureCard
                icon={<PaymentIcon className="h-6 w-6" />}
                title="Gestión de Pagos"
                description="Planes flexibles con facturación transparente para todos los usuarios."
              />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
              ¿Cómo Funciona?
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {[
                { step: '1', title: 'Registra', description: 'Crea tu cuenta como consumidor, productor o empresa certificadora ISO.' },
                { step: '2', title: 'Registra Productos', description: 'Genera códigos QR únicos para cada lote de productos con datos verificables.' },
                { step: '3', title: 'Comparte & Verifica', description: 'Consumidores escanean para ver el historial completo y certificaciones.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-palette-accent text-lg font-bold text-slate-900">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-white text-base">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
              Para Diferentes Usuarios
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {[
                { role: 'Consumidor', icon: '🛒', benefit: 'Verifica la autenticidad y origen de productos antes de comprar' },
                { role: 'Productor', icon: '🚜', benefit: 'Gestiona tu cadena de producción y demuestra calidad' },
                { role: 'Distribuidor', icon: '🚚', benefit: 'Controla logística y trazabilidad en tiempo real' },
                { role: 'Empresa ISO', icon: '✅', benefit: 'Certifica y audita con estándares internacionales' },
                { role: 'Regulador', icon: '📋', benefit: 'Supervisa compliance y regulaciones del sector' },
                { role: 'Retail', icon: '🏪', benefit: 'Ofrece garantía de autenticidad a tus clientes' },
              ].map((user) => (
                <div key={user.role} className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 sm:p-6 text-center">
                  <div className="mb-3 text-3xl">{user.icon}</div>
                  <h3 className="mb-2 font-semibold text-white text-base">{user.role}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{user.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-palette-accent/30 bg-gradient-to-r from-palette-accent/10 to-palette-accent/5 p-8 sm:p-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Comienza hoy</h2>
            <p className="mb-6 text-sm sm:text-base text-slate-300">
              Únete a la revolución de la trazabilidad blockchain
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-lg bg-palette-accent px-6 py-3 text-sm font-bold text-slate-900 hover:bg-palette-accent-hover transition-colors"
              >
                Crear Cuenta
                <ArrowForwardIcon />
              </Link>
              <Link
                href="/verify-product"
                className="flex items-center justify-center gap-2 rounded-lg border border-palette-accent px-6 py-3 text-sm font-bold text-palette-accent hover:bg-palette-accent/10 transition-colors"
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
