import Header from '@/components/features/shared/Header'
import Link from 'next/link'
import Image from 'next/image'

const NODO_IMAGE = '/parqueIndustrial.png'

const INDUSTRY_BUTTONS = [
  { label: 'Hidrocarburos y Energía', href: '/industrias', position: 'top-left' },
  { label: 'Minería y Metales', href: '/industrias', position: 'top-right' },
  { label: 'Agroindustria y Agroalimentos', href: '/industrias', position: 'center-left' },
  { label: 'Metales Preciosos', href: '/industrias', position: 'mid-right' },
  { label: 'Alimentos Procesados', href: '/industrias', position: 'bottom-right' },
] as const

const positionClasses: Record<string, string> = {
  'top-left': 'left-[6%] top-[20%] md:left-[8%] md:top-[22%]',
  'top-right': 'right-[38%] top-[18%] md:right-[36%] md:top-[20%]',
  'center-left': 'left-[5%] top-[46%] md:left-[7%] md:top-[48%]',
  'mid-right': 'right-[36%] top-[38%] md:right-[34%] md:top-[40%]',
  'bottom-right': 'right-[40%] bottom-[20%] md:right-[38%] md:bottom-[22%]',
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 antialiased">
      <Header />

      <main className="relative flex-1">
        <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden">
          <Image
            src={NODO_IMAGE}
            alt="NODO - Plataforma de trazabilidad por industrias"
            fill
            className="object-cover object-center w-full"
            sizes="100vw"
            priority
          />

          {INDUSTRY_BUTTONS.map((btn) => (
            <Link
              key={btn.label}
              href={btn.href}
              className={`absolute z-10 max-w-[180px] md:max-w-[220px] rounded-lg border border-emerald-400/70 bg-slate-900/90 px-3 py-2 text-xs font-bold text-emerald-400 shadow-lg backdrop-blur-sm transition hover:bg-emerald-500/25 hover:border-emerald-400 hover:text-white md:px-4 md:py-2.5 md:text-sm text-center leading-tight ${positionClasses[btn.position]}`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
