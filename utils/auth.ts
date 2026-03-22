/**
 * Utilidad para sesión: loginAt (cierre proactivo a las 12h) y clearSession.
 * Usar setSession() tras login/register; clearSession() en logout y al expirar.
 */

import { encryptedStorage } from '@/utils/encryptedStorage'

export const SESSION_DURATION_MS = 12 * 60 * 60 * 1000 // 12 horas
export const SESSION_CHECK_INTERVAL_MS = 60 * 1000 // 1 minuto

export interface StoredUser {
  id: string
  name: string
  email: string
  role: string
}

const LOGIN_AT_KEY = 'loginAt'

export function setLoginAt(): void {
  if (typeof window === 'undefined') return
  try {
    if (encryptedStorage) {
      encryptedStorage.setItem(LOGIN_AT_KEY, String(Date.now()))
    }
  } catch {
    // ignore
  }
}

/**
 * Guarda token y usuario tras login/register. Dispara 'auth-change' para actualizar UI.
 */
export function setSession(token: string, user: StoredUser): void {
  if (typeof window === 'undefined') return
  try {
    if (encryptedStorage) {
      encryptedStorage.setItem('token', token)
      encryptedStorage.setItem('user', JSON.stringify(user))
      setLoginAt()
    }
    window.dispatchEvent(new CustomEvent('auth-change'))
  } catch {
    // ignore
  }
}

/**
 * Devuelve el usuario guardado en storage o null.
 */
export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = encryptedStorage?.getItem('user')
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      parsed &&
      typeof parsed === 'object' &&
      'id' in parsed &&
      'name' in parsed &&
      typeof (parsed as StoredUser).name === 'string'
    ) {
      return parsed as StoredUser
    }
    return null
  } catch {
    return null
  }
}

/**
 * Limpia token, user y loginAt (encryptedStorage) y token/user (localStorage).
 * Llamar en logout explícito, en 401 y cuando expire la sesión por tiempo.
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return
  try {
    if (encryptedStorage) {
      encryptedStorage.removeItem('token')
      encryptedStorage.removeItem('user')
      encryptedStorage.removeItem(LOGIN_AT_KEY)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new CustomEvent('auth-change'))
  } catch {
    // ignore
  }
}

export function getLoginAt(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = encryptedStorage?.getItem(LOGIN_AT_KEY)
    if (!raw) return null
    const n = parseInt(raw, 10)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export function hasToken(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return !!encryptedStorage?.getItem('token')
  } catch {
    return false
  }
}

/**
 * true si hay token + loginAt y ya pasaron 12h desde login.
 * Usar antes de cada petición para no enviar token expirado.
 */
export function isSessionExpired(): boolean {
  if (!hasToken()) return false
  const loginAt = getLoginAt()
  if (loginAt == null) return false
  return Date.now() - loginAt >= SESSION_DURATION_MS
}
