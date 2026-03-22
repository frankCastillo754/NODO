/**
 * Utilidad para reintentar peticiones con backoff exponencial
 * Maneja errores 429 (rate limiting) de forma inteligente
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

/**
 * Retry con backoff exponencial
 * @param fn Función que retorna una Promise
 * @param options Opciones de configuración
 * @returns Promise con el resultado de la función
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    shouldRetry = (error: any) => {
      // No reintentar si es error 429 (rate limiting) o 401 (autenticación)
      if (error?.response?.status === 429 || error?.isRateLimitError) {
        return false; // No reintentar rate limiting
      }
      if (error?.response?.status === 401) {
        return false; // No reintentar errores de autenticación
      }
      // Reintentar otros errores (red, timeout, 500, etc.)
      return true;
    },
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Si no debemos reintentar, lanzar el error inmediatamente
      if (!shouldRetry(error)) {
        throw error;
      }

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        throw error;
      }

      // Esperar antes del siguiente intento con backoff exponencial
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Calcular el siguiente delay (backoff exponencial)
      delay = Math.min(delay * 2, maxDelay);
    }
  }

  // Esto no debería ejecutarse nunca, pero TypeScript lo requiere
  throw lastError;
}

/**
 * Helper para crear delays
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
