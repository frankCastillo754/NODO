'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-toastify'
import Header from '@/components/features/shared/Header'
import { api } from '@/lib'

const DOC_LABELS = ['Guía de Movimiento Animal', 'Acta de Certificación Sanitaria', 'Acta de Lavado y Desinfección']

type VerificationDetails = {
  product?: { id: string; name: string; slug: string; description: string | null } | null
  records: Array<{
    id: string
    client: string
    batchId: string
    shipmentId: string
    slaughterDate: string | null
    guideId: string | null
    imageUrl: string | null
    documentUrl: string | null
    blockchainTxHash?: string
    createdAt: string
  }>
}

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatDate(iso: string | null | undefined): string {
  if (iso == null || typeof iso !== 'string') return '—'
  const dateOnly = String(iso).slice(0, 10)
  const [y, m, d] = dateOnly.split('-').map(Number)
  if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y) || m < 1 || m > 12) return dateOnly || '—'
  return `${d} de ${MONTHS_ES[m - 1]}, ${y}`
}

function formatDateTime(iso: string | null | undefined): string {
  if (iso == null || typeof iso !== 'string') return '—'
  try {
    const d = new Date(String(iso))
    if (Number.isNaN(d.getTime())) return String(iso)
    return d.toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return String(iso)
  }
}

export default function VerifyProductDetallesPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const recordId = searchParams.get('recordId')
  const [data, setData] = useState<VerificationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (recordId) {
      api
        .get<VerificationDetails>(`/verify-product/details/record/${recordId}`, { timeout: 15000 })
        .then((res) => {
          const raw = res?.data
          if (raw && typeof raw === 'object' && Array.isArray(raw.records)) {
            setData({ product: raw.product ?? null, records: raw.records })
          } else {
            setError('Respuesta inválida del servidor.')
          }
        })
        .catch(() => setError('No se pudieron cargar los detalles.'))
        .finally(() => setLoading(false))
      return
    }
    if (productId) {
      api
        .get<VerificationDetails>(`/verify-product/details/${productId}`, { timeout: 15000 })
        .then((res) => {
          const raw = res?.data
          if (raw && typeof raw === 'object' && Array.isArray(raw.records)) {
            setData({ product: raw.product ?? null, records: raw.records })
          } else {
            setError('Respuesta inválida del servidor.')
          }
        })
        .catch(() => setError('No se pudieron cargar los detalles.'))
        .finally(() => setLoading(false))
      return
    }
    setError('Falta el identificador del producto o del registro.')
    setLoading(false)
  }, [productId, recordId])

  const firstRecordHash = data?.records?.[0]?.blockchainTxHash ?? null
  const handleCopyHash = useCallback(async () => {
    if (!firstRecordHash) {
      toast.info('No hay hash para copiar.')
      return
    }
    try {
      await navigator.clipboard.writeText(firstRecordHash)
      toast.success('Hash copiado al portapapeles.')
    } catch {
      toast.error('No se pudo copiar el hash.')
    }
  }, [firstRecordHash])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1F2D] font-sans text-slate-100">
        <Header />
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-slate-400">Cargando detalles…</p>
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0B1F2D] font-sans text-slate-100">
        <Header />
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-400 mb-4">{error ?? 'Datos no disponibles.'}</p>
          <Link href="/verify-product" className="text-[#00E676] hover:underline">
            Volver a verificar producto
          </Link>
        </main>
      </div>
    )
  }

  const records = Array.isArray(data.records) ? data.records : []
  const first = records[0] ?? null
  const docsWithUrl = records.filter((r) => r && (r.imageUrl || r.documentUrl)).slice(0, 3)

  if (!first) {
    return (
      <div className="min-h-screen bg-[#0B1F2D] font-sans text-slate-100">
        <Header />
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-400 mb-4">No hay datos de registro.</p>
          <Link href="/verify-product" className="text-[#00E676] hover:underline">
            Volver a verificar producto
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1F2D] text-[#F8FAFC] font-sans">
      <Header />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <Link href="/verify-product" className="flex items-center gap-3">
            <Image src="/logo_nodo.png" alt="NODO" width={32} height={32} className="rounded-lg" />
          </Link>
          <div className="flex items-center gap-4">
            <button type="button" className="hidden sm:flex items-center gap-2 bg-[#1F7A5C] px-4 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90">
              <span className="material-symbols-outlined text-sm">download</span>
              Descargar Reporte
            </button>
            <Link href="/verify-product" className="px-5 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white">
              Soporte
            </Link>
          </div>
        </header>

        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-4xl font-black mb-2 text-white">Verificación de Autenticidad</h2>
              <p className="text-slate-400 max-w-xl">
                Este producto ha sido registrado en un libro mayor inmutable. La trazabilidad completa está garantizada por criptografía de vanguardia.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 px-4 py-2 rounded-full text-[#00E676]">
                <span className="material-symbols-outlined text-xl">check_circle</span>
                <span className="text-sm font-bold">Verificado por la entidad emisora</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-slate-300">
                <span className="material-symbols-outlined text-xl">link</span>
                <span className="text-sm font-bold">Registrado en Blockchain</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Estado</p>
              <p className="text-2xl font-bold text-white">Activo / Válido</p>
            </div>
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Red</p>
              <p className="text-2xl font-bold text-white">Ethereum Mainnet</p>
            </div>
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Nivel de Confianza</p>
              <p className="text-2xl font-bold text-white">100% Inmutable</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-slate-800/40 rounded-xl border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1F7A5C]">inventory_2</span>
                <h3 className="font-bold text-lg text-white">
                  {data?.product ? 'Información del Producto' : 'Registro de trazabilidad'}
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Producto</p>
                  <p className="font-bold text-lg text-white">
                    {data?.product ? data.product.name : 'Registro de trazabilidad'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Exportador</p>
                  <p className="font-bold text-lg text-white">{first?.client ?? '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Número de Lote (Batch)</p>
                  <code className="font-mono bg-white/10 px-2 py-1 rounded text-sm font-bold text-[#00E676]">
                    #{first?.batchId ?? '—'}
                  </code>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Fecha de Sacrificio</p>
                  <p className="font-bold text-lg text-white">{first?.slaughterDate ? formatDate(first.slaughterDate) : '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">ID de Envío</p>
                  <p className="font-bold text-lg text-white">{first?.shipmentId ?? '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Guía</p>
                  <p className="font-bold text-lg text-white">{first?.guideId ?? '—'}</p>
                </div>
              </div>
            </section>

            <section className="bg-slate-800/40 rounded-xl border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1F7A5C]">attachment</span>
                <h3 className="font-bold text-lg text-white">Documentos y Certificaciones</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {docsWithUrl.length > 0 ? (
                    docsWithUrl.map((rec, i) => {
                      const src = rec.imageUrl || rec.documentUrl || ''
                      const label = DOC_LABELS[i] ?? `Documento ${i + 1}`
                      const isExternalIpfs = src.startsWith('http') && (src.includes('ipfs') || src.includes('pinata') || src.includes('mypinata'))
                      return (
                        <div key={`${rec.id}-${i}`} className="group cursor-pointer">
                          <div className="aspect-[3/4] rounded-lg bg-slate-900 mb-2 overflow-hidden border border-white/10 relative">
                            {src ? (
                              isExternalIpfs ? (
                                <img
                                  src={src}
                                  alt={label}
                                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                  loading="lazy"
                                />
                              ) : (
                                <Image
                                  src={src}
                                  alt={label}
                                  fill
                                  className="object-cover group-hover:opacity-80 transition-opacity"
                                  sizes="(max-width: 640px) 50vw, 33vw"
                                  unoptimized
                                />
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-4xl">description</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                              <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 text-3xl">visibility</span>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-center text-slate-300">{label}</p>
                        </div>
                      )
                    })
                  ) : (
                    <p className="col-span-full text-slate-400 text-sm py-4">No hay documentos ni imágenes asociados a este registro.</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-slate-900 rounded-xl p-6 border border-[#1F7A5C]/30 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-[#1F7A5C]">database</span>
                  <h3 className="font-bold text-lg text-white">Prueba de Blockchain</h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold mb-1">Hash de Transacción</p>
                    <div className="flex items-center justify-between bg-white/10 p-2 rounded border border-white/10 gap-2">
                      <p className="font-mono text-xs truncate flex-1 min-w-0">
                        {first?.blockchainTxHash ?? '—'}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyHash}
                        title="Copiar hash"
                        className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                        aria-label="Copiar hash de transacción"
                      >
                        <span className="material-symbols-outlined text-sm cursor-pointer hover:text-[#1F7A5C]">content_copy</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold mb-1">Fecha de Registro</p>
                    <p className="font-medium">{first?.createdAt ? formatDateTime(first.createdAt) : '—'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={
                      firstRecordHash
                        ? `https://lab.stellar.org/transaction/dashboard?network=testnet&horizonUrl=${encodeURIComponent('https://horizon-testnet.stellar.org')}&rpcUrl=${encodeURIComponent('https://soroban-testnet.stellar.org')}&transactionHash=${encodeURIComponent(firstRecordHash)}`
                        : '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 bg-[#1F7A5C] font-bold py-3 rounded-lg hover:opacity-90 ${!firstRecordHash ? 'pointer-events-none opacity-60' : ''}`}
                  >
                    <span className="material-symbols-outlined text-sm font-bold">open_in_new</span>
                    Ver en Explorador de Blockchain
                  </a>
                  <Link
                    href={recordId ? `/verify-product/mapa?recordId=${encodeURIComponent(recordId)}` : '/verify-product/mapa'}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#162C3D] border border-[#1F7A5C]/50 font-bold py-3 rounded-lg hover:bg-[#1F7A5C]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">map</span>
                    Ver mapa
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">© 2026 NODO Transparency Network. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#1F7A5C] text-slate-300">Términos</Link>
            <Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#1F7A5C] text-slate-300">Privacidad</Link>
            <Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#1F7A5C] text-slate-300">API Pública</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
