/**
 * Roles de usuario. Debe coincidir con el enum UserRole del backend.
 * Usar para guards, UI condicional y validaciones.
 */
export const UserRole = {
  ADMIN: 'admin',
  CLIENT: 'client',
  COMPANY: 'company',
} as const

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]

export const ROLES_LIST: UserRoleType[] = [
  UserRole.ADMIN,
  UserRole.CLIENT,
  UserRole.COMPANY,
]

export function isUserRole(value: string): value is UserRoleType {
  return ROLES_LIST.includes(value as UserRoleType)
}
