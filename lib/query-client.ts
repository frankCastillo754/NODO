import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // Sin cache - siempre considerar datos obsoletos
        gcTime: 0, // Sin cache - no mantener datos en memoria
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        // No reintentar si es error 429 (rate limit) o 401 (autenticación)
        retry: (failureCount, error: any) => {
          // No reintentar si es error 429 (rate limiting)
          if (error?.response?.status === 429 || error?.isRateLimitError) {
            return false;
          }
          // No reintentar si es error 401 (autenticación) - credenciales inválidas no se solucionan con reintentos
          if (error?.response?.status === 401) {
            return false;
          }
          // Para otros errores, reintentar máximo 1 vez
          return failureCount < 1;
        },
        networkMode: 'online', // Solo intentar cuando hay conexión a internet
        // Backoff exponencial para reintentos: 1s, 2s, 4s, 8s... máximo 30s
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Servidor: siempre generar un Query Client
    return makeQueryClient()
  } else {
    // Cliente: Solo genera el QueryClient si no tenemos uno
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
