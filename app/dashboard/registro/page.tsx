'use client'

import Script from 'next/script'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, useCallback } from 'react'
import { api, getRegistros, createRegistro, updateRegistro } from '@/lib'
import { toast } from 'react-toastify'
import Header from '@/components/features/shared/Header'

interface ExtractedData {
  client?: string
  batchId?: string
  shipmentId?: string
  slaughterDate?: string
  guideId?: string
  tipoDocumento?: string
  ipfsHash?: string
  rawText?: string
}

const clientOptions = [
  'Seleccionar cliente corporativo',
  'Distribuidora Gourmet S.A.',
  'Supermercados Global',
  'Frigorífico Central',
]

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function formatSlaughterDate(isoDate: string | null): string {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (Number.isNaN(m) || m < 1 || m > 12) return isoDate
  return `${d} ${MONTHS_ES[m - 1]} ${y}`
}

function statusLabel(status: string): string {
  if (status === 'pending') return 'Pendiente'
  if (status === 'signing') return 'Firmando'
  if (status === 'confirmed') return 'Confirmado'
  return status
}

type RegistroRow = {
  id: string
  client: string
  shipmentId: string
  batch: string
  date: string
  slaughterDateIso: string | null
  guide: string
  status: string
  hasImage: boolean
  imageUrl: string | null
}

function recordToRow(r: import('@/lib').TraceabilityRecord): RegistroRow {
  return {
    id: r.id,
    client: r.client,
    shipmentId: r.shipmentId,
    batch: r.batchId,
    date: formatSlaughterDate(r.slaughterDate),
    slaughterDateIso: r.slaughterDate ?? null,
    guide: r.guideId ?? '—',
    status: statusLabel(r.status),
    hasImage: !!r.imageUrl,
    imageUrl: r.imageUrl,
  }
}

export default function RegistroPage() {
  const searchParams = useSearchParams()
  const productName = (() => {
    const p = searchParams.get('product')
    if (!p) return null
    try {
      return decodeURIComponent(p)
    } catch {
      return p
    }
  })()

  const [client, setClient] = useState('')
  const [recentRegistros, setRecentRegistros] = useState<RegistroRow[]>([])
  const [editingRegistro, setEditingRegistro] = useState<RegistroRow | null>(null)
  const [editForm, setEditForm] = useState({ client: '', shipmentId: '', batchId: '', slaughterDate: '', guideId: '' })
  const [updating, setUpdating] = useState(false)
  const [stepScanned, setStepScanned] = useState(false)
  const [stepValidated, setStepValidated] = useState(false)
  const [stepChained, setStepChained] = useState(false)
  const [registrosTotal, setRegistrosTotal] = useState(0)
  const [registrosLoading, setRegistrosLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [batchId, setBatchId] = useState('')
  const [shipmentId, setShipmentId] = useState('')
  const [slaughterDate, setSlaughterDate] = useState('')
  const [guideId, setGuideId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadLabel, setUploadLabel] = useState<string | null>(null)
  const [lastRawText, setLastRawText] = useState<string | null>(null)
  const [ipfsHash, setIpfsHash] = useState<string | null>(null)
  const [tipoDocumento, setTipoDocumento] = useState('')
  const [showRawText, setShowRawText] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchRegistros = useCallback(() => {
    setRegistrosLoading(true)
    getRegistros({ take: 20, skip: 0 })
      .then((data) => {
        setRecentRegistros(data.records.map(recordToRow))
        setRegistrosTotal(data.total)
      })
      .catch((err) => {
        console.warn('getRegistros failed, using cached data if any', err)
        toast.error('No se pudieron cargar los registros desde el servidor. Reintentando con datos guardados.')
        setRecentRegistros([])
        setRegistrosTotal(0)
      })
      .finally(() => setRegistrosLoading(false))
  }, [])

  useEffect(() => {
    fetchRegistros()
  }, [fetchRegistros])

  useEffect(() => {
    if (editingRegistro) {
      setEditForm({
        client: editingRegistro.client,
        shipmentId: editingRegistro.shipmentId,
        batchId: editingRegistro.batch,
        slaughterDate: editingRegistro.slaughterDateIso ?? '',
        guideId: editingRegistro.guide === '—' ? '' : editingRegistro.guide,
      })
    }
  }, [editingRegistro])

  const applyExtracted = (data: ExtractedData) => {
    if (data.client) setClient(data.client)
    if (data.batchId) setBatchId(data.batchId)
    if (data.shipmentId) setShipmentId(data.shipmentId)
    if (data.slaughterDate) setSlaughterDate(data.slaughterDate)
    if (data.guideId) setGuideId(data.guideId)
    if (data.tipoDocumento) setTipoDocumento(data.tipoDocumento)
    if (data.ipfsHash) setIpfsHash(data.ipfsHash)
  }

  const handleFile = async (file: File) => {
    const mime = (file.type || '').toLowerCase()
    const isPdf = mime === 'application/pdf'
    const isImage = /^image\/(jpeg|png|gif|webp)$/.test(mime)
    if (!isPdf && !isImage) {
      toast.error('Sube un PDF o una imagen (JPEG, PNG, WebP, GIF).')
      return
    }
    setUploading(true)
    setUploadLabel(file.name)
    try {
      const formData = new FormData()
      formData.append('document', file)
      const res = await api.post<ExtractedData>('/traceability/extract-document', formData, {
        timeout: 120000,
      })
      console.log('[Registro] Data obtenida del documento:', res.data)
      const data = res.data
      setLastRawText(data.rawText ?? null)
      setIpfsHash(data.ipfsHash ?? null)
      applyExtracted(data)
      toast.success('✅ Documento escaneado con OCR. Los campos se han rellenado automáticamente.')
      setStepScanned(true)
      const missingRequired = !data.client || !data.batchId || !data.shipmentId
      if (data.rawText && missingRequired) {
        toast.info('⚠️ Algunos campos no se detectaron. Revisa que la guía se vea nítida o complétalos manualmente.')
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
          : null
      const text = Array.isArray(msg) ? msg[0] : typeof msg === 'string' ? msg : null
      toast.error(text ?? '❌ No se pudo leer el documento. Prueba con otro archivo.')
    } finally {
      setUploading(false)
      setUploadLabel(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onDragOver = (e: React.DragEvent) => e.preventDefault()

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const [qrVisible, setQrVisible] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)

  // mark as validated whenever mandatory values exist (even before saving)
  useEffect(() => {
    if (client.trim() && batchId.trim() && shipmentId.trim()) {
      setStepValidated(true)
    }
  }, [client, batchId, shipmentId])

  const handleSubmit = async () => {
    const c = client.trim()
    const b = batchId.trim()
    const s = shipmentId.trim()
    if (!c || !b || !s) {
      toast.error('Completa Cliente, ID de Lote e ID de Envío.')
      return
    }
    setSubmitting(true)
    try {
      await createRegistro({
        client: c,
        batchId: b,
        shipmentId: s,
        slaughterDate: slaughterDate.trim() || undefined,
        guideId: guideId.trim() || undefined,
        ipfsHash: ipfsHash ?? undefined,
      })
      toast.success('✅ Registro guardado correctamente.')
      setStepValidated(true)
      setClient('')
      setBatchId('')
      setShipmentId('')
      setSlaughterDate('')
      setGuideId('')
      setTipoDocumento('')
      setIpfsHash(null)
      // clear steps so next record starts fresh
      setStepScanned(false)
      setStepValidated(false)
      setStepChained(false)
      fetchRegistros()
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
          : null
      const text = Array.isArray(msg) ? msg[0] : typeof msg === 'string' ? msg : null
      toast.error(text ?? 'Error al guardar el registro.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateRegistro = async () => {
    if (!editingRegistro) return
    const { client: c, shipmentId: s, batchId: b, slaughterDate: sd, guideId: g } = editForm
    if (!c?.trim() || !s?.trim() || !b?.trim()) {
      toast.error('Cliente, Shipment y Lote son obligatorios.')
      return
    }
    setUpdating(true)
    try {
      await updateRegistro(editingRegistro.id, {
        client: c.trim(),
        shipmentId: s.trim(),
        batchId: b.trim(),
        slaughterDate: sd.trim() || null,
        guideId: g.trim() || null,
      })
      toast.success('Registro actualizado correctamente.')
      setEditingRegistro(null)
      fetchRegistros()
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
          : null
      const text = Array.isArray(msg) ? msg[0] : typeof msg === 'string' ? msg : null
      toast.error(text ?? 'Error al actualizar el registro.')
    } finally {
      setUpdating(false)
    }
  }

  const handleGenerateQr = async (row: RegistroRow) => {
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const detallesUrl = `${baseUrl}/verify-product/detalles?recordId=${encodeURIComponent(row.id)}`
    try {
      const QRCode = await import('qrcode')
      const dataUrl = await QRCode.toDataURL(detallesUrl, { width: 280 })
      setQrUrl(dataUrl)
      setQrVisible(true)
      toast.success('QR generado. Al escanearlo se abrirá la página de verificación con los datos.')
    } catch (err) {
      console.error('QR generation failed', err)
      toast.error('No se pudo generar el QR.')
    }
  }

  const handleBlockchain = async () => {
    const c = client.trim()
    const b = batchId.trim()
    const s = shipmentId.trim()
    if (!c || !b || !s) {
      toast.error('Completa Cliente, ID de Lote e ID de Envío antes de enviar a blockchain.')
      return
    }
    // prepare record
    const record = {
      client: c,
      batchId: b,
      shipmentId: s,
      slaughterDate: slaughterDate.trim() || undefined,
      guideId: guideId.trim() || undefined,
      timestamp: new Date().toISOString(),
    }
    // store locally as mock chain
    try {
      if (typeof window !== 'undefined' && localStorage) {
        const chain: any[] = JSON.parse(localStorage.getItem('chain') || '[]')
        chain.push(record)
        localStorage.setItem('chain', JSON.stringify(chain))
      }
      toast.success('🌐 Registro enviado a cadena local (mock).')
    } catch (err) {
      console.error('Error guardando en cadena local:', err)
      toast.error('Error guardando en cadena local.')
    }

    // generate QR code with record data
    try {
      const QRCode = await import('qrcode')
      const dataUrl = await QRCode.toDataURL(JSON.stringify(record), { width: 200 })
      setQrUrl(dataUrl)
      setQrVisible(true)
      setStepChained(true)
    } catch (qrErr) {
      console.error('QR generation failed', qrErr)
      toast.error('No se pudo generar el QR.')
    }
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/dist/boxicons.js" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" />

      <div className="min-h-screen bg-auth-bg font-sans text-slate-100 antialiased">
        <div className="flex h-full grow flex-col">
          <Header />

          <main className="flex-1 space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <i className="bx bx-plus-circle text-emerald-custom text-3xl"></i>
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                    Registrar Trazabilidad
                  </h1>
                </div>
                {productName && (
                  <p className="text-sm text-emerald-custom font-semibold">📦 Producto: {productName}</p>
                )}
                <p className="max-w-2xl text-sm text-slate-400">
                  Escanea la documentación y completa los datos técnicos para inmutabilidad en blockchain.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-2.5 text-sm font-bold text-slate-300 transition-all hover:bg-slate-800 sm:px-5"
              >
                <i className="bx bx-arrow-back text-lg"></i>
                Atrás
              </Link>
            </div>

            {/* Paso a Paso */}
            <section className="rounded-lg border border-slate-700 bg-gradient-to-r from-slate-900/60 to-slate-900/30 p-4 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <i className="bx bx-list-check text-emerald-custom text-2xl"></i>
                <h2 className="text-lg font-bold text-white">Proceso Paso a Paso</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className={`flex items-start gap-3 rounded-lg p-4 ${stepScanned ? 'border border-palette-accent/20 bg-palette-accent/5' : 'border border-slate-700 bg-slate-900/40'}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold flex-shrink-0">
                    {stepScanned ? <span className="material-symbols-outlined text-palette-accent">check</span> : '1'}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Escanear Documento</p>
                    <p className="text-xs text-slate-400 mt-1">PDF o imagen con OCR</p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 rounded-lg p-4 ${stepValidated ? 'border border-palette-accent/20 bg-palette-accent/5' : 'border border-slate-700 bg-slate-900/40'}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold flex-shrink-0">
                    {stepValidated ? <span className="material-symbols-outlined text-palette-accent">check</span> : '2'}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Validar Datos</p>
                    <p className="text-xs text-slate-400 mt-1">Verifica campos automáticos</p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 rounded-lg p-4 ${stepChained ? 'border border-palette-accent/20 bg-palette-accent/5' : 'border border-slate-700 bg-slate-900/40'}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold flex-shrink-0">
                    {stepChained ? <span className="material-symbols-outlined text-palette-accent">check</span> : '3'}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Enviar a Blockchain</p>
                    <p className="text-xs text-slate-400 mt-1">Inmutabilidad garantizada</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contenido Principal */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Columna Izquierda - Formulario */}
              <div className="space-y-6">
                <section className="space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="bx bx-form-detail text-emerald-custom text-2xl"></i>
                    <h3 className="text-lg font-bold text-white">Datos del Producto</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
                    {/* Cliente */}
                    <div className="md:col-span-2">
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                        <i className="bx bx-building text-emerald-custom text-lg"></i>
                        Cliente / Receptor
                      </label>
                      <div className="relative">
                        <input
                          list="client-list"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          placeholder="Seleccionar o escribir cliente corporativo"
                          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-custom focus:ring-2 focus:ring-emerald-custom transition"
                        />
                        <datalist id="client-list">
                          {clientOptions.filter((o) => o !== 'Seleccionar cliente corporativo').map((opt) => (
                            <option key={opt} value={opt} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {/* Tipo de Documento */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                        <i className="bx bx-receipt text-emerald-custom text-lg"></i>
                        Tipo de Documento
                      </label>
                      <select
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 focus:border-emerald-custom focus:ring-2 focus:ring-emerald-custom transition"
                      >
                        <option value="">Seleccionar tipo...</option>
                        <option value="Guía de Movimiento Animal">Guía de Movimiento Animal</option>
                        <option value="Acta de Certificación Sanitaria">Acta de Certificación Sanitaria</option>
                        <option value="Acta de Lavado y Desinfección">Acta de Lavado y Desinfección</option>
                      </select>
                    </div>

                    {/* ID de Envío */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                        <i className="bx bx-package text-emerald-custom text-lg"></i>
                        ID de Envío
                      </label>
                      <input
                        value={shipmentId}
                        onChange={(e) => setShipmentId(e.target.value)}
                        placeholder="SHP-2026-X011"
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-custom focus:ring-2 focus:ring-emerald-custom transition"
                      />
                    </div>

                    {/* ID de Lote */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                        <i className="bx bx-hash text-emerald-custom text-lg"></i>
                        ID de Lote
                      </label>
                      <input
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        placeholder="LOTE-2026-001"
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-custom focus:ring-2 focus:ring-emerald-custom transition"
                      />
                    </div>
                  </div>

                  {/* Fecha de Faena */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                      <i className="bx bx-calendar text-emerald-custom text-lg"></i>
                      Fecha de Faena
                    </label>
                    <input
                      type="date"
                      value={slaughterDate}
                      onChange={(e) => setSlaughterDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 focus:border-emerald-custom focus:ring-2 focus:ring-emerald-custom transition"
                    />
                  </div>

                  {/* Guide ID */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-200">
                      <i className="bx bx-id-card text-emerald-custom text-lg"></i>
                      ID de Guía Sanitaria
                    </label>
                    <input
                      value={guideId}
                      onChange={(e) => setGuideId(e.target.value)}
                      placeholder="Nro. de Guía"
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-custom focus:ring-2 focus:ring-emerald-custom transition"
                    />
                  </div>
                </section>
              </div>

              {/* Columna Derecha - Panel de Carga OCR */}
              <div className="flex h-full flex-col rounded-lg border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <i className="bx bx-scanner text-emerald-custom text-2xl"></i>
                  <h3 className="text-lg font-bold text-white">DOCUMENTACION OFICIAL</h3>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  📄 Sube un PDF o foto del documento. Nuestro OCR extraerá automáticamente los datos del formulario.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
                  onChange={onFileInputChange}
                  className="hidden"
                />

                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 p-6 sm:p-8 transition-all hover:border-emerald-custom/50 hover:bg-emerald-custom/5 group"
                >
                  {uploading ? (
                    <>
                      <i className="bx bx-loader-circle text-4xl text-emerald-custom animate-spin mb-3"></i>
                      <p className="text-sm font-bold text-slate-300">Escaneando con OCR…</p>
                      {uploadLabel && (
                        <p className="mt-2 text-xs text-slate-500 truncate max-w-full px-2">{uploadLabel}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <i className="bx bx-file text-4xl text-slate-400 transition-colors group-hover:text-emerald-custom mb-3"></i>
                      <p className="text-center text-sm font-bold text-slate-300">Arrastra o haz clic</p>
                      <p className="mt-1 text-xs text-slate-500">PDF o imagen (JPEG, PNG, WebP, GIF)</p>
                    </>
                  )}
                </div>

                {lastRawText ? (
                  <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowRawText((v) => !v)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        <i className="bx bx-text text-emerald-custom"></i>
                        Texto OCR detectado
                      </span>
                      <i className={`bx text-lg text-slate-400 transition-transform ${showRawText ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                    </button>
                    {showRawText ? (
                      <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words px-4 py-3 text-xs text-slate-400 bg-slate-900 border-t border-slate-700">
                        {lastRawText}
                      </pre>
                    ) : null}
                  </div>
                ) : null}

                {ipfsHash && (
                  <div className="mt-4 rounded-lg border border-emerald-custom/30 bg-emerald-custom/5 p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <i className="bx bx-link-chain text-emerald-custom text-lg flex-shrink-0 mt-0.5"></i>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-custom mb-1">Hash IPFS</p>
                        <p className="text-xs text-slate-300 font-mono break-all">{ipfsHash}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 rounded-lg border border-emerald-custom/30 bg-gradient-to-r from-emerald-custom/10 to-slate-900/40 p-4 sm:p-6 shadow-lg">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-slate-700 disabled:opacity-50 sm:w-auto"
              >
                <i className="bx bx-save text-lg"></i>
                Guardar Proceso
              </button>

              <button
                type="button"
                onClick={handleBlockchain}
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-custom px-4 py-3 text-sm font-black text-slate-900 shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all hover:brightness-110 disabled:opacity-50 sm:w-auto"
              >
                <i className="bx bx-link-chain text-lg"></i>
                ENVIAR A BLOCKCHAIN
              </button>
            </div>

            {/* Geolocalización y Rastreo */}
            <section className="rounded-lg border border-slate-700 bg-slate-900 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <i className="bx bx-map text-emerald-custom text-2xl"></i>
                <h3 className="text-lg font-bold text-white">Rastreo de Ubicación</h3>
              </div>

              {/* Mapa Google Maps */}
              <div className="mb-6 rounded-lg overflow-hidden border border-slate-700 bg-black p-0 h-96 sm:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212865.26098045654!2d-64.30938!3d-31.3994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432985f27d1bfb9%3A0x5f835c9c8e80da0!2sCórdoba%2C%20Argentina!5e0!3m2!1ses!2sar!4v1700000000000&style=feature:all%7Celement:labels%7Cvisibility:off%7Cfeature:water%7Ccolor:0x131617%7Cfeature:landscape%7Ccolor:0x1a1c1b%7Cfeature:road%7Ccolor:0x262627%7Cfeature:poi%7Ccolor:0x1a1c1b"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            </section>

            {/* Historial */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <i className="bx bx-history text-emerald-custom text-2xl"></i>
                <h2 className="text-xl font-bold text-white">Registros Recientes</h2>
              </div>

              {registrosLoading ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 px-6 py-12 sm:px-8">
                  <i className="bx bx-loader-circle text-4xl animate-spin text-slate-500 mb-4"></i>
                  <p className="text-sm font-medium text-slate-400">Cargando registros…</p>
                </div>
              ) : recentRegistros.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 px-6 py-12 text-center sm:px-8">
                  <i className="bx bx-inbox text-5xl text-slate-500 mb-4"></i>
                  <p className="mb-2 text-lg font-semibold text-white">Todavía no hay registros</p>
                  <p className="max-w-sm text-sm text-slate-400">
                    Los procesos que guardes o envíes a blockchain aparecerán aquí.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-custom/20 bg-emerald-custom/10 px-3 py-1 text-xs font-bold text-emerald-custom flex items-center gap-2">
                      <i className="bx bx-check-circle"></i>
                      {registrosTotal} proceso{registrosTotal !== 1 ? 's' : ''} activo{registrosTotal !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="overflow-hidden overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 bg-gradient-to-r from-emerald-custom to-emerald-custom/80 text-white">
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Imagen</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Cliente</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Shipment</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Lote</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Fecha</th>
                          <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Guía</th>
                          <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Estado</th>
                          <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider sm:px-6 sm:py-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {recentRegistros.map((row) => (
                          <tr key={row.id} className="transition-colors hover:bg-slate-800/30">
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                              <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 flex-shrink-0">
                                {row.hasImage && row.imageUrl ? (
                                  <img src={row.imageUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
                                    <i className="bx bx-image text-lg"></i>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-200 sm:px-6 sm:py-4 text-xs sm:text-sm">{row.client}</td>
                            <td className="px-4 py-3 font-mono text-slate-200 sm:px-6 sm:py-4 text-xs">{row.shipmentId}</td>
                            <td className="px-4 py-3 font-mono text-slate-200 sm:px-6 sm:py-4 text-xs">{row.batch}</td>
                            <td className="px-4 py-3 text-slate-200 sm:px-6 sm:py-4 text-xs sm:text-sm">{row.date}</td>
                            <td className="px-4 py-3 font-mono text-slate-200 sm:px-6 sm:py-4 text-xs">{row.guide}</td>
                            <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${row.status === 'Pendiente'
                                ? 'border border-slate-700 bg-slate-800 text-slate-500'
                                : 'border border-emerald-custom/30 bg-emerald-custom/10 text-emerald-custom'
                                }`}>
                                {row.status !== 'Pendiente' && <i className="bx bx-check-circle text-sm"></i>}
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleGenerateQr(row)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-500 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                                  title="Generar QR de este registro"
                                >
                                  <i className="bx bx-qr-scan text-sm"></i>
                                  Generar QR
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingRegistro(row)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-custom/50 bg-emerald-custom/10 px-3 py-1.5 text-xs font-bold text-emerald-custom transition hover:bg-emerald-custom/20"
                                >
                                  <i className="bx bx-edit-alt text-sm"></i>
                                  Actualizar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800 px-4 py-4 text-xs font-bold text-slate-400 sm:px-6 sm:py-6 md:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <p>© 2026 ChainSight Trazabilidad</p>
                <span className="h-4 w-px bg-slate-800 hidden sm:block" />
                <p className="flex items-center gap-1">
                  <i className="bx bxs-check-circle text-emerald-custom"></i>
                  NODE OPTIMIZADO
                </p>
              </div>
              <div className="flex gap-4 sm:gap-6">
                <Link href="#" className="hover:text-emerald-custom transition flex items-center gap-1">
                  <i className="bx bx-link text-sm"></i>
                  TÉRMINOS
                </Link>
                <Link href="#" className="hover:text-emerald-custom transition flex items-center gap-1">
                  <i className="bx bx-book text-sm"></i>
                  API
                </Link>
                <Link href="#" className="hover:text-emerald-custom transition flex items-center gap-1">
                  <i className="bx bx-support text-sm"></i>
                  SOPORTE
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>



      {/* QR Modal */}
      {
        qrVisible && qrUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative w-11/12 max-w-md rounded-lg bg-slate-900 p-6 shadow-xl">
              <button
                onClick={() => setQrVisible(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
              <h3 className="mb-4 text-lg font-bold text-white">QR de verificación</h3>
              <div className="flex justify-center">
                <img src={qrUrl} alt="QR de verificación del registro" className="h-48 w-48 rounded-lg border border-slate-700" />
              </div>
              <p className="mt-4 text-sm text-slate-300 break-words text-center">
                Al escanear este código se abrirá la página de verificación con los detalles del registro (cliente, lote, blockchain, etc.).
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <a
                  href={qrUrl}
                  download="qr-registro-nodo.png"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow transition hover:opacity-90"
                >
                  <i className="bx bx-download text-lg"></i>
                  Descargar
                </a>
                <button
                  type="button"
                  onClick={() => setQrVisible(false)}
                  className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Modal Actualizar registro */}
      {editingRegistro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setEditingRegistro(null)}
              className="absolute top-3 right-3 rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Cerrar"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
            <h3 className="mb-4 pr-8 text-lg font-bold text-white">Actualizar registro</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400">Cliente</label>
                <input
                  type="text"
                  value={editForm.client}
                  onChange={(e) => setEditForm((f) => ({ ...f, client: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-custom focus:outline-none"
                  placeholder="Cliente"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Shipment ID</label>
                  <input
                    type="text"
                    value={editForm.shipmentId}
                    onChange={(e) => setEditForm((f) => ({ ...f, shipmentId: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-custom focus:outline-none"
                    placeholder="Shipment"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Lote</label>
                  <input
                    type="text"
                    value={editForm.batchId}
                    onChange={(e) => setEditForm((f) => ({ ...f, batchId: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-custom focus:outline-none"
                    placeholder="Lote"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Fecha faena</label>
                  <input
                    type="date"
                    value={editForm.slaughterDate}
                    onChange={(e) => setEditForm((f) => ({ ...f, slaughterDate: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-custom focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Guía</label>
                  <input
                    type="text"
                    value={editForm.guideId}
                    onChange={(e) => setEditForm((f) => ({ ...f, guideId: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-custom focus:outline-none"
                    placeholder="Guía"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingRegistro(null)}
                className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleUpdateRegistro}
                disabled={updating}
                className="rounded-lg bg-emerald-custom px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-custom/90 disabled:opacity-50"
              >
                {updating ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
