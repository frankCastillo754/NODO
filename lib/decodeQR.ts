/**
 * Decodifica un código QR desde una imagen (File o Blob) en el navegador.
 * Usa canvas + jsQR para no depender del backend.
 */
export async function decodeQRFromImageFile(file: File | Blob): Promise<string | null> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const data = imageToImageData(img)
    if (!data) return null
    const jsQR = (await import('jsqr')).default
    const result = jsQR(data.data, data.width, data.height)
    return result?.data ?? null
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Decodifica un código QR desde un canvas (ej. frame de vídeo o imagen dibujada).
 */
export async function decodeQRFromCanvas(canvas: HTMLCanvasElement): Promise<string | null> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  if (!imageData?.data) return null
  const jsQR = (await import('jsqr')).default
  const result = jsQR(imageData.data, imageData.width, imageData.height)
  return result?.data ?? null
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function imageToImageData(img: HTMLImageElement): { data: Uint8ClampedArray; width: number; height: number } | null {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  return {
    data: imageData.data,
    width: imageData.width,
    height: imageData.height,
  }
}
