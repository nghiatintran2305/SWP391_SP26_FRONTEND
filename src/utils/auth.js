import { jwtDecode } from 'jwt-decode'
import { storage } from './storage'

export function parseRoles(rawRoles) {
  if (Array.isArray(rawRoles)) return rawRoles
  if (typeof rawRoles === 'string') {
    return rawRoles
      .replace('[', '')
      .replace(']', '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function getDecodedToken() {
  const token = storage.getToken()
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export function getCurrentRoles() {
  const saved = storage.getRoles()
  if (saved.length) return saved
  const decoded = getDecodedToken()
  return parseRoles(decoded?.roles)
}

export function isAdmin() {
  const roles = getCurrentRoles()
  return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')
}