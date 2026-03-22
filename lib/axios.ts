import axios from "axios";
import { encryptedStorage } from "@/utils/encryptedStorage";
import { clearSession, isSessionExpired } from "@/utils/auth";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    timeout: 30000 // 30 segundos - evita que las peticiones se queden colgadas indefinidamente
});

api.interceptors.request.use(
    (config) => {
        if (typeof window === 'undefined') return config;

        const requestUrl = config.url || '';
        const isAuthFlow = requestUrl.includes('/auth/');
        if (isAuthFlow) return config;

        // Verificar expiración antes de cada petición: no enviar token expirado
        if (isSessionExpired()) {
            clearSession();
            window.dispatchEvent(new CustomEvent('auth-error', { detail: { message: 'Tu sesión ha expirado (12h). Por favor, inicia sesión nuevamente.' } }));
            return Promise.reject(new Error('Session expired'));
        }

        if (encryptedStorage) {
            const token = encryptedStorage.getItem('token');
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const requestUrl: string = error.config?.url || '';
        const isAuthFlowRequest =
            requestUrl.includes('/auth/') ||
            requestUrl.endsWith('/auth/login') ||
            requestUrl.endsWith('/auth/login-complete');
        const isLoginRequest =
            requestUrl.endsWith('/auth/login') || requestUrl === '/auth/login';

        // Log detallado solo en desarrollo (omitir 401 para reducir ruido cuando la sesión expiró)
        if (process.env.NODE_ENV === 'development' && error.response?.status !== 401) {
            console.error('Error detallado:', error);
        }

        // Manejo de errores de red y timeout
        // Estos errores ocurren cuando no hay respuesta del servidor
        if (!error.response) {
            const errorCode = error.code || '';
            const isTimeout = errorCode === 'ECONNABORTED' || error.message?.includes('timeout');
            const isNetworkError = 
                errorCode === 'ERR_NETWORK' || 
                errorCode === 'ECONNREFUSED' || 
                errorCode === 'ETIMEDOUT' ||
                error.message?.includes('Network Error') ||
                error.message?.includes('Failed to fetch');
            
            if (isTimeout || isNetworkError) {
                // Crear error amigable para el usuario
                const networkError = new Error(
                    isTimeout 
                        ? 'La solicitud tardó demasiado. Por favor, verifica tu conexión e intenta nuevamente.'
                        : 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.'
                );
                (networkError as any).response = {
                    status: 0,
                    data: {
                        message: isTimeout 
                            ? 'La solicitud tardó demasiado. Por favor, verifica tu conexión e intenta nuevamente.'
                            : 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.'
                    }
                };
                (networkError as any).isNetworkError = true;
                return Promise.reject(networkError);
            }
        }
        
        // Manejo de error 429 (Too Many Requests - Rate Limiting)
        // NO reintentar automáticamente cuando hay rate limiting
        if (error.response?.status === 429) {
            const rateLimitError = new Error(
                'Demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente.'
            );
            (rateLimitError as any).response = {
                status: 429,
                data: {
                    message: 'Demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente.'
                }
            };
            (rateLimitError as any).isRateLimitError = true;
            // Marcar para que no se reintente automáticamente
            (rateLimitError as any).config = { ...error.config, __retryCount: Infinity };
            return Promise.reject(rateLimitError);
        }
        
        // Si el token es inválido o expiró, limpiar la autenticación
        // (pero NO hacerlo en el flujo de login/registro/verificación 2FA)
        if (error.response?.status === 401 && !isAuthFlowRequest) {
            if (typeof window !== 'undefined') {
                let message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
                
                // Solo mostrar mensaje específico si es sobre cuenta bloqueada (ya es genérico)
                const errorMessage = error.response?.data?.message || '';
                if (errorMessage.includes('bloqueado') || errorMessage.includes('blocked') || errorMessage.includes('⛔️')) {
                    message = 'Tu cuenta ha sido bloqueada. Contacta con el administrador.';
                }
                
                clearSession();
                
                // Disparar evento personalizado
                window.dispatchEvent(new CustomEvent('auth-error', { 
                    detail: { 
                        message 
                    } 
                }));
            }
        }
        
        if (process.env.NODE_ENV === 'production') {
            // Caso especial: credenciales inválidas en login
            if (error.response?.status === 401 && isLoginRequest) {
                const serverMessage: string = error.response?.data?.message || '';
                const isBlocked =
                    serverMessage.includes('bloqueado') ||
                    serverMessage.includes('blocked') ||
                    serverMessage.includes('⛔️');
                const finalMessage = isBlocked
                    ? 'Tu cuenta ha sido bloqueada. Contacta con el administrador.'
                    : 'Correo o Contraseña Incorrectos';

                const invalidCredentialsError = new Error(finalMessage);
                (invalidCredentialsError as any).response = {
                    status: 401,
                    data: {
                        message: finalMessage
                    }
                };
                return Promise.reject(invalidCredentialsError);
            }

            // Los errores 400 (Bad Request) son errores de validación del cliente
            // y deben mostrarse al usuario para que pueda corregir su acción
            if (error.response?.status === 400) {
                // Mantener el mensaje original del servidor para errores de validación
                return Promise.reject(error);
            }

            // Para otros errores (500, etc.), crear un error genérico sin exponer detalles
            const genericError = new Error('Ocurrió un error al procesar la solicitud');
            (genericError as any).response = {
                status: error.response?.status || 500,
                data: {
                    message: 'Ocurrió un error al procesar la solicitud. Por favor, intenta nuevamente.'
                }
            };
            return Promise.reject(genericError);
        }
        
        return Promise.reject(error);
    }
);

export default api;
