'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/features/shared/Header'
import { api } from '@/lib'
import { toast } from 'react-toastify'
import { decodeQRFromImageFile, decodeQRFromCanvas } from '@/lib/decodeQR'

type VerifyResult = {
  code: string
  product?: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  recordId?: string
}

export default function VerifyProductPage() {
  const [mode, setMode] = useState<'choose' | 'camera' | 'upload'>('choose')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraError(null)
  }, [])

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudo acceder a la cámara'
      setCameraError(msg)
      toast.error(msg)
    }
  }, [])

  const captureAndScan = useCallback(async () => {
    const video = videoRef.current
    if (!video || !video.srcObject || video.readyState < 2) {
      toast.error('Espera a que la cámara esté lista.')
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      toast.error('No se pudo procesar la imagen capturada.')
      return
    }
    ctx.drawImage(video, 0, 0)
    setLoading(true)
    setResult(null)
    try {
      const code = await decodeQRFromCanvas(canvas)
      if (code?.trim()) {
        const trimmed = code.trim()
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          toast.success('✅ Código QR detectado. Redirigiendo…')
          window.location.href = trimmed
          return
        }
        setResult({ code: trimmed })
        toast.success('✅ Código QR leído.')
        setLoading(false)
        return
      }
    } catch {
      // Fallback: enviar al backend
    }
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error('No se pudo capturar la imagen.')
          setLoading(false)
          return
        }
        try {
          const formData = new FormData()
          formData.append('image', blob, 'capture.jpg')
          const response = await api.post('/verify-product/scan', formData, { timeout: 90000 })
          if (response?.data) {
            const resultData = response.data as VerifyResult
            const code = resultData.code?.trim() ?? ''
            if (code.startsWith('http://') || code.startsWith('https://')) {
              toast.success('✅ Código QR detectado. Redirigiendo…')
              window.location.href = code
              return
            }
            setResult(resultData)
            if (!resultData.product && !resultData.recordId) {
              toast.warning('⚠️ Código QR identificado, pero el producto no existe en nuestra base de datos.')
            } else {
              toast.success('✅ Producto verificado exitosamente.')
            }
          } else {
            toast.error('❌ No se obtuvieron resultados del escaneo.')
          }
        } catch (apiError: unknown) {
          console.error('Error al escanear:', apiError)

          if (apiError && typeof apiError === 'object' && 'response' in apiError) {
            const axiosError = apiError as { response?: { status?: number; data?: { message?: string } } }
            
            if (axiosError.response?.status === 400) {
              toast.error('❌ No se encontró un código QR claro en la captura o está ilegible. Intenta de nuevo.')
            } else if (axiosError.response?.status === 404) {
              toast.error('❌ Código QR no identificado. Asegúrate de que sea un QR válido.')
            } else if (axiosError.response?.status === 422) {
              toast.error('❌ La imagen capturada no contiene un código QR válido.')
            } else if (axiosError.response?.data?.message) {
              toast.error(`❌ ${axiosError.response.data.message}`)
            } else {
              toast.error('❌ Error al procesar la captura. Intenta de nuevo.')
            }
          } else if (apiError instanceof Error) {
            if (apiError.message.includes('timeout')) {
              toast.error('❌ La solicitud tardó demasiado. Intenta mantener el QR más estable.')
            } else if (apiError.message.includes('Request failed')) {
              toast.error('❌ Error de conexión. Verifica tu conexión a internet.')
            } else {
              toast.error(`❌ Error: ${apiError.message}`)
            }
          } else {
            toast.error('❌ Error desconocido al procesar la captura.')
          }
        } finally {
          setLoading(false)
        }
      },
      'image/jpeg',
      0.9
    )
  }, [])

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = e.target.files?.[0]
        if (!file) {
          return
        }

        // Validar que sea imagen
        if (!file.type.startsWith('image/')) {
          toast.error('Por favor selecciona un archivo de imagen válido.')
          e.target.value = ''
          return
        }

        // Validar tamaño máximo (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('La imagen es demasiado grande. Máximo 5MB.')
          e.target.value = ''
          return
        }

        setLoading(true)
        setResult(null)

        try {
          const code = await decodeQRFromImageFile(file)
          if (code?.trim()) {
            const trimmed = code.trim()
            if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
              toast.success('✅ Código QR detectado. Redirigiendo…')
              window.location.href = trimmed
              return
            }
            setResult({ code: trimmed })
            toast.success('✅ Código QR leído.')
          }
          setLoading(false)
          e.target.value = ''
          return
        } catch {
          // Fallback: enviar al backend
        }

        try {
          const formData = new FormData()
          formData.append('image', file)
          const response = await api.post('/verify-product/scan', formData, { timeout: 90000 })
          if (response?.data) {
            const resultData = response.data as VerifyResult
            const code = resultData.code?.trim() ?? ''
            if (code.startsWith('http://') || code.startsWith('https://')) {
              toast.success('✅ Código QR detectado. Redirigiendo…')
              window.location.href = code
              return
            }
            setResult(resultData)
            if (!resultData.product && !resultData.recordId) {
              toast.warning('⚠️ Código QR identificado, pero el producto no existe en nuestra base de datos.')
            } else {
              toast.success('✅ Producto verificado exitosamente.')
            }
          } else {
            toast.error('❌ No se obtuvieron resultados del escaneo.')
          }
        } catch (apiError: unknown) {
          if (apiError && typeof apiError === 'object' && 'response' in apiError) {
            const axiosError = apiError as { response?: { status?: number; data?: { message?: string } } }
            if (axiosError.response?.status === 400) {
              toast.error('❌ No se encontró un código QR en la imagen o está ilegible. Intenta con una imagen más clara.')
            } else if (axiosError.response?.data?.message) {
              toast.error(`❌ ${String(axiosError.response.data.message)}`)
            } else {
              toast.error('❌ Error al procesar la imagen. Intenta de nuevo.')
            }
          } else {
            toast.error('❌ Error al procesar la imagen. Intenta de nuevo.')
          }
        } finally {
          setLoading(false)
          e.target.value = ''
        }
      } catch {
        setLoading(false)
        e.target.value = ''
      }
    },
    []
  )

  const backToChoose = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraError(null)
    setMode('choose')
    setResult(null)
  }, [])

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#0B1F2D' }}>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:py-8">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-emerald-custom transition hover:text-emerald-hover"
        >
          ← Volver atrás
        </button>
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-white">
          Verificar Producto
        </h1>
        <p className="mb-6 text-sm sm:text-base text-slate-400 leading-relaxed">
          Escanea el código QR con la cámara o sube una imagen que lo contenga. Serás redirigido a la página de verificación con los detalles del registro.
        </p>
        <div className="mb-8 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 text-sm text-slate-300">
          <p className="font-semibold text-emerald-custom mb-2">📋 Pasos:</p>
          <ol className="space-y-1 text-xs sm:text-sm">
            <li>1. Elige entre escanear con cámara o subir imagen</li>
            <li>2. Apunta el código QR a la cámara o selecciona la foto con el QR</li>
            <li>3. Se abrirá automáticamente la página de detalles del registro</li>
          </ol>
        </div>

        {mode === 'choose' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setMode('camera')
                setResult(null)
                setTimeout(startCamera, 100)
              }}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 p-6 sm:p-8 text-white transition"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-custom/20 text-emerald-custom" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                </svg>
              </span>
              <span className="font-semibold text-base">Escanear con Cámara</span>
              <span className="text-center text-xs sm:text-sm text-slate-400 leading-relaxed">
                Usa tu cámara para escanear el código QR del producto
              </span>
            </button>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 p-6 sm:p-8 text-white transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setMode('upload')
                  handleFileSelect(e)
                }}
              />
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-custom/20 text-emerald-custom" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span className="font-semibold text-base">Subir Imagen</span>
              <span className="text-center text-xs sm:text-sm text-slate-400 leading-relaxed">
                Sube una imagen con el QR para ir a la página de detalles
              </span>
            </label>
          </div>
        )}

        {mode === 'camera' && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-slate-700/50 bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-video w-full object-cover"
              />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                  <p className="px-4 text-center text-sm">{cameraError}</p>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400">Mantén el código QR centrado y bien iluminado</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={captureAndScan}
                disabled={loading || !!cameraError}
                className="rounded-lg bg-emerald-custom px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-hover disabled:opacity-50"
              >
                {loading ? 'Leyendo…' : '📸 Capturar'}
              </button>
              <button
                type="button"
                onClick={backToChoose}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Elegir otro método
              </button>
            </div>
          </div>
        )}

        {mode === 'upload' && !result && !loading && (
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <label className="cursor-pointer rounded-lg bg-emerald-custom px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-hover">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              📁 Elegir otra
            </label>
            <button
              type="button"
              onClick={backToChoose}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Cambiar método
            </button>
          </div>
        )}

        {mode === 'upload' && loading && (
          <div className="text-center">
            <div className="inline-block rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-slate-300 font-medium">⏳ Procesando imagen…</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-4">
            <div className="rounded-lg border border-emerald-custom/30 bg-emerald-custom/10 p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-white text-center">✅ Verificación Exitosa</h2>
              <div className="flex justify-center">
                <Image
                  src="/validado_nodos.png"
                  alt="Validado por Nodos - Trazabilidad Inmutable"
                  width={320}
                  height={320}
                  className="max-w-full h-auto object-contain"
                />
              </div>
              {(result.product || result.recordId) && (
                <div className="mt-4 flex justify-center">
                  <Link
                    href={
                      result.product
                        ? `/verify-product/detalles?productId=${encodeURIComponent(result.product.id)}`
                        : `/verify-product/detalles?recordId=${encodeURIComponent(result.recordId!)}`
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 border border-emerald-custom/50 px-4 py-2.5 text-sm font-bold text-emerald-400 hover:bg-emerald-custom/20 transition-colors"
                  >
                    Más detalles
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {mode === 'camera' ? (
                <>
                  <button
                    type="button"
                    onClick={captureAndScan}
                    disabled={loading}
                    className="rounded-lg bg-emerald-custom px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-hover disabled:opacity-50"
                  >
                    📸 Escanear otro
                  </button>
                  <button type="button" onClick={backToChoose} className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                    Volver
                  </button>
                </>
              ) : (
                <>
                  <label className="cursor-pointer rounded-lg bg-emerald-custom px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-emerald-hover">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    📁 Otra imagen
                  </label>
                  <button type="button" onClick={backToChoose} className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                    Volver
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
