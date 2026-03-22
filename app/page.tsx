"use client"

import Header from '@/components/features/shared/Header'
import Link from 'next/link'
import Script from "next/script"
import { useRef, useEffect, useState } from 'react'

const INDUSTRY_BUTTONS = [
  { 
    label: 'Hidrocarburos y Energía', 
    href: '#', 
    position: 'top-left', 
    id: 'hydrocarbons',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-400/60 text-blue-300 hover:bg-blue-500/20',
    icon: '⚡'
  },
  { 
    label: 'Minería y Metales', 
    href: '#', 
    position: 'top-right', 
    id: 'mining',
    color: 'from-gray-500/20 to-slate-500/20 border-gray-400/60 text-gray-300 hover:bg-gray-500/20',
    icon: '⛏️'
  },
  { 
    label: 'Agroindustria y Agroalimentos', 
    href: '#', 
    position: 'center-left', 
    id: 'agroindustry',
    color: 'from-emerald-500/20 to-green-500/20 border-emerald-400/60 text-emerald-300 hover:bg-emerald-500/20',
    icon: '🌾'
  },
  { 
    label: 'Metales Preciosos', 
    href: '#', 
    position: 'mid-right', 
    id: 'precious',
    color: 'from-amber-500/20 to-yellow-500/20 border-amber-400/60 text-amber-300 hover:bg-amber-500/20',
    icon: '💎'
  },
  { 
    label: 'Alimentos Procesados', 
    href: '#', 
    position: 'bottom-right', 
    id: 'food',
    color: 'from-orange-500/20 to-red-500/20 border-orange-400/60 text-orange-300 hover:bg-orange-500/20',
    icon: '🍲'
  },
] as const

const positionClasses: Record<string, string> = {
  'top-left': 'left-[4%] top-[18%] md:left-[6%] md:top-[20%]',
  'top-right': 'right-[32%] top-[16%] md:right-[30%] md:top-[18%]',
  'center-left': 'left-[4%] top-[44%] md:left-[6%] md:top-[46%]',
  'mid-right': 'right-[30%] top-[36%] md:right-[28%] md:top-[38%]',
  'bottom-right': 'right-[34%] bottom-[18%] md:right-[32%] md:bottom-[20%]',
}

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleDownloadPDF = () => {
    const reportContent = `INFORME AGROINDUSTRIA Y AGROALIMENTOS
Fecha: ${new Date().toLocaleDateString('es-ES')}
--------------------------------------------------
CERTIFICACIONES:
✅ Certificado Fitosanitario - Validado (Bleqn: 488222)
✅ Certificado de Origen - Aprobado
❌ Inspección de Calidad - Pendiente
✅ Declaración de Aduanas - Lista

PROGRESO DE CUMPLIMIENTO: 69%`

    const blob = new Blob([reportContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Informe_Agroindustria_${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0B1E2D] via-[#0F2A3A] via-[#1C4A4A] to-[#033131] font-sans text-slate-100 antialiased">
      <Header />

      <main className="relative flex-1">
        <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden">
          {/* CDN model-viewer */}
          <Script
            type="module"
            src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
            strategy="afterInteractive"
          />

          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0B1E2D] via-[#0F2A3A] via-[#1C4A4A] to-[#033131]">
            {/* @ts-ignore */}
            <model-viewer
              src="/parque.glb"
              auto-rotate
              camera-controls
              autoplay
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* Botones con colores personalizados - mejor espaciados */}
          {INDUSTRY_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              ref={btn.id === 'agroindustry' ? buttonRef : null}
              onClick={() => {
                if (btn.id === 'agroindustry') {
                  openModal()
                }
              }}
              className={`absolute z-20 group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${positionClasses[btn.position]}`}
            >
              <div className={`flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-4 md:py-2.5 rounded-xl bg-gradient-to-r ${btn.color} bg-slate-900/80 backdrop-blur-md border shadow-lg hover:shadow-xl`}>
                <span className="text-sm md:text-lg">{btn.icon}</span>
                <span className="text-[10px] md:text-xs font-bold tracking-wide whitespace-nowrap">
                  {btn.label}
                </span>
              </div>
            </button>
          ))}

          {/* Panel flotante - en desktop aparece al lado, en móvil es modal centrado */}
          {isOpen && (
            <>
              {/* Overlay solo en móvil */}
              {isMobile && (
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                  onClick={closeModal}
                />
              )}
              
              <div 
                ref={panelRef}
                className={`
                  fixed z-50 bg-slate-900/95 backdrop-blur-xl border border-emerald-400/40 rounded-xl overflow-hidden shadow-2xl
                  ${isMobile 
                    ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[320px]' 
                    : 'w-80'
                  }
                  animate-in fade-in zoom-in duration-200
                `}
                style={!isMobile ? {
                  position: 'fixed',
                  left: 'calc(6% + 210px)',
                  top: '46%',
                  transform: 'translateY(-50%)',
                } : {}}
              >
                {/* Header compacto */}
                <div className="bg-gradient-to-r from-emerald-900/80 to-teal-800/80 px-3 py-2.5 border-b border-emerald-500/30 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌾</span>
                    <div>
                      <h3 className="font-bold text-xs text-emerald-200">Agroindustria</h3>
                      <p className="text-[9px] text-emerald-300/70">Gestión inteligente y trazabilidad</p>
                    </div>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-all w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Contenido ultra compacto */}
                <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto custom-scroll">
                  
                  {/* Certificados */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] p-1.5 rounded bg-emerald-500/10">
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-400 text-[11px]">✅</span>
                        <span className="text-slate-200">Fitosanitario</span>
                      </div>
                      <span className="text-[8px] text-emerald-300">Validado</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] p-1.5 rounded hover:bg-emerald-500/5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-400 text-[11px]">✅</span>
                        <span className="text-slate-200">Certificado Origen</span>
                      </div>
                      <span className="text-[8px] text-emerald-300">Aprobado</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] p-1.5 rounded hover:bg-emerald-500/5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 text-[11px]">⏳</span>
                        <span className="text-slate-200">Inspección Calidad</span>
                      </div>
                      <span className="text-[8px] text-amber-300">Pendiente</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] p-1.5 rounded hover:bg-emerald-500/5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-400 text-[11px]">✅</span>
                        <span className="text-slate-200">Declaración Aduanas</span>
                      </div>
                      <span className="text-[8px] text-emerald-300">Lista</span>
                    </div>
                  </div>

                  {/* Progreso */}
                  <div className="bg-slate-800/50 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-emerald-200 font-medium">Progreso</span>
                      <span className="text-sm font-bold text-emerald-400">69%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full" style={{ width: '69%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[8px] text-emerald-200/60">
                      <span>Trazabilidad: 92%</span>
                      <span>Auditoría: 45%</span>
                    </div>
                  </div>

                  {/* Info rápida */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-slate-800/30 rounded-lg p-1.5">
                      <div className="flex items-center gap-1 text-emerald-300 text-[9px] font-medium mb-0.5">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Requisitos</span>
                      </div>
                      <p className="text-[8px] text-slate-300 leading-tight">Certificaciones · FDA/UE · Inocuidad</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-1.5">
                      <div className="flex items-center gap-1 text-emerald-300 text-[9px] font-medium mb-0.5">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Trazabilidad</span>
                      </div>
                      <p className="text-[8px] text-slate-300 leading-tight">Blockchain · Registro digital · IA</p>
                    </div>
                  </div>

                  {/* Botón descarga */}
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg text-white font-medium transition-all text-[9px]"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 4h16M4 20h16" />
                    </svg>
                    Descargar PDF
                  </button>
                </div>

                {/* Footer */}
                <div className="px-2 py-1 text-center text-[7px] text-emerald-600/50 border-t border-emerald-500/20 bg-black/20">
                  Trazabilidad inteligente
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #1e3a3a;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #2dd4bf;
          border-radius: 10px;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { opacity: 0; transform: translateY(-50%) scale(0.95); }
          to { opacity: 1; transform: translateY(-50%) scale(1); }
        }
        @keyframes zoom-in-mobile {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
        @media (max-width: 768px) {
          .zoom-in {
            animation-name: zoom-in-mobile;
          }
        }
      `}</style>
    </div>
  )
}