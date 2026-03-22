/**
 * Storage wrapper encriptado compatible con la API Storage del navegador
 * 
 * Implementación según PRD: SECURITY_MEASURES_PRD.md
 * 
 * Intercepta getItem(), setItem(), removeItem() para encriptar/desencriptar transparentemente
 */

import { encrypt, decrypt, isEncrypted } from './encryption'

interface CacheEntry {
  value: string
  timestamp: number
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
const cache = new Map<string, CacheEntry>()

/**
 * Limpia el cache expirado
 */
function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}

/**
 * Obtiene un valor del cache si es válido
 */
function getCachedValue(key: string): string | null {
  cleanExpiredCache()
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.value
  }
  return null
}

/**
 * Guarda un valor en el cache
 */
function setCachedValue(key: string, value: string) {
  cache.set(key, {
    value,
    timestamp: Date.now()
  })
}

/**
 * Crea un storage encriptado que implementa la interfaz Storage
 */
export function createEncryptedStorage(baseStorage: Storage = localStorage): Storage {
  return {
    get length() {
      return baseStorage.length
    },

    key(index: number): string | null {
      return baseStorage.key(index)
    },

    getItem(key: string): string | null {
      try {
        // Verificar cache primero
        const cached = getCachedValue(key)
        if (cached !== null) {
          return cached
        }

        // Leer de storage
        const stored = baseStorage.getItem(key)
        if (!stored) {
          return null
        }

        // Detectar si está encriptado
        if (isEncrypted(stored)) {
          // Desencriptar
          const decrypted = decrypt(stored)
          setCachedValue(key, decrypted)
          return decrypted
        } else {
          // Migrar automáticamente: encriptar y guardar
          // Solo para claves sensibles
          if (isSensitiveKey(key)) {
            const encrypted = encrypt(stored)
            baseStorage.setItem(key, encrypted)
            setCachedValue(key, stored)
            return stored
          }
          
          // No es sensible, devolver sin encriptar
          return stored
        }
      } catch (error) {
        console.error(`Error al leer clave ${key} del storage encriptado:`, error)
        return null
      }
    },

    setItem(key: string, value: string): void {
      try {
        // Limpiar cache
        cache.delete(key)

        // Solo encriptar si es una clave sensible
        if (isSensitiveKey(key)) {
          const encrypted = encrypt(value)
          baseStorage.setItem(key, encrypted)
        } else {
          baseStorage.setItem(key, value)
        }

        // Actualizar cache con valor desencriptado
        setCachedValue(key, value)
      } catch (error) {
        console.error(`Error al guardar clave ${key} en storage encriptado:`, error)
      }
    },

    removeItem(key: string): void {
      cache.delete(key)
      baseStorage.removeItem(key)
    },

    clear(): void {
      cache.clear()
      baseStorage.clear()
    }
  }
}

/**
 * Determina si una clave contiene datos sensibles que deben encriptarse
 */
function isSensitiveKey(key: string): boolean {
  const sensitiveKeys = [
    'token',
    'user',
    'auth',
    'loginAt',
    'cart',
    'contents',
    'coupon',
    'favorites'
  ]
  
  return sensitiveKeys.some(sensitive => 
    key.toLowerCase().includes(sensitive.toLowerCase())
  )
}

/**
 * Inicializa el storage encriptado y migra datos antiguos
 */
export function initializeEncryptedStorage(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Migrar datos antiguos sin encriptar
    const keysToMigrate: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      
      if (isSensitiveKey(key)) {
        const value = localStorage.getItem(key)
        if (value && !isEncrypted(value)) {
          keysToMigrate.push(key)
        }
      }
    }

    // Migrar cada clave
    keysToMigrate.forEach(key => {
      const value = localStorage.getItem(key)
      if (value) {
        const encrypted = encrypt(value)
        localStorage.setItem(key, encrypted)
        console.log(`[Security] Migrado dato sensible: ${key}`)
      }
    })

    // Limpiar datos legacy sin encriptar (solo si están encriptados ahora)
    const legacyKeys = ['token', 'user', 'cart', 'contents', 'coupon']
    legacyKeys.forEach(key => {
      const value = localStorage.getItem(key)
      if (value && !isEncrypted(value)) {
        // Si hay una versión encriptada, eliminar la sin encriptar
        const encryptedKey = `encrypted_${key}`
        if (localStorage.getItem(encryptedKey)) {
          localStorage.removeItem(key)
          console.log(`[Security] Limpiado dato legacy sin encriptar: ${key}`)
        }
      }
    })
  } catch (error) {
    console.error('Error al inicializar storage encriptado:', error)
  }
}

/**
 * Limpia datos antiguos sin encriptar (llamar en login/logout)
 */
export function cleanupUnencryptedData(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const sensitiveKeys = ['token', 'user', 'cart', 'contents', 'coupon', 'favorites']
    
    sensitiveKeys.forEach(key => {
      const value = localStorage.getItem(key)
      if (value && !isEncrypted(value)) {
        localStorage.removeItem(key)
        console.log(`[Security] Limpiado dato sin encriptar: ${key}`)
      }
    })
  } catch (error) {
    console.error('Error al limpiar datos sin encriptar:', error)
  }
}

// Instancia global del storage encriptado
export const encryptedStorage = typeof window !== 'undefined' 
  ? createEncryptedStorage(localStorage)
  : null
