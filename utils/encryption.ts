/**
 * Utilidad de encriptación síncrona para datos sensibles en localStorage
 * 
 * Implementación según PRD: SECURITY_MEASURES_PRD.md
 * 
 * Algoritmo: XOR + Base64 (síncrono)
 * Razón: Compatibilidad con sistemas de estado que requieren operaciones síncronas
 */

const ENCRYPTION_PREFIX = 'ENC:'
const ENCRYPTION_KEY = 'TimiEcommerce2024SecureKey'

/**
 * Genera una clave de encriptación basada en el dominio y una constante
 */
function getEncryptionKey(): string {
  if (typeof window === 'undefined') {
    return ENCRYPTION_KEY
  }
  
  // Combinar clave base con dominio para mayor seguridad
  const domain = window.location.hostname
  return `${ENCRYPTION_KEY}_${domain}`
}

/**
 * Encripta datos usando XOR + Base64
 * @param data Datos a encriptar (string)
 * @returns Datos encriptados con prefijo ENC:
 */
export function encrypt(data: string): string {
  if (!data) return data
  
  try {
    const key = getEncryptionKey()
    let encrypted = ''
    
    // Aplicar XOR cipher
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      encrypted += String.fromCharCode(charCode ^ keyChar)
    }
    
    // Codificar en Base64
    const base64 = btoa(encrypted)
    return `${ENCRYPTION_PREFIX}${base64}`
  } catch (error) {
    console.error('Error al encriptar datos:', error)
    return data // Retornar datos originales si falla la encriptación
  }
}

/**
 * Desencripta datos encriptados con XOR + Base64
 * @param encryptedData Datos encriptados (con prefijo ENC:)
 * @returns Datos desencriptados (string)
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return encryptedData
  
  // Si no tiene prefijo, asumir que no está encriptado
  if (!encryptedData.startsWith(ENCRYPTION_PREFIX)) {
    return encryptedData
  }
  
  try {
    // Remover prefijo
    const base64 = encryptedData.substring(ENCRYPTION_PREFIX.length)
    
    // Decodificar Base64
    const encrypted = atob(base64)
    
    const key = getEncryptionKey()
    let decrypted = ''
    
    // Aplicar XOR cipher inverso
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      decrypted += String.fromCharCode(charCode ^ keyChar)
    }
    
    return decrypted
  } catch (error) {
    console.error('Error al desencriptar datos:', error)
    return encryptedData // Retornar datos originales si falla la desencriptación
  }
}

/**
 * Verifica si un valor está encriptado
 */
export function isEncrypted(value: string): boolean {
  return value?.startsWith(ENCRYPTION_PREFIX) ?? false
}
