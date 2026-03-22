/**
 * Utilidades para strings y URLs (rutas de imágenes, etc.).
 */

export function getImagePath(image: string | null | undefined): string | null {
  if (!image || image.trim() === '') {
    return null
  }

  const normalizedImage = image.trim()

  const cloudinaryPatterns = [
    'https://res.cloudinary.com',
    'http://res.cloudinary.com',
  ]

  if (
    cloudinaryPatterns.some((pattern) => normalizedImage.startsWith(pattern))
  ) {
    return normalizedImage
  }

  if (
    normalizedImage.startsWith('http://') ||
    normalizedImage.startsWith('https://')
  ) {
    return normalizedImage
  }

  const apiUrl =
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  return `${apiUrl}/img/${normalizedImage}`
}
