const TOKEN_KEY = 'swp391_token'
const ROLE_KEY = 'swp391_roles'
const LOGIN_MODE_KEY = 'swp391_login_mode'

export const storage = {
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },
  setRoles(roles) {
    localStorage.setItem(ROLE_KEY, JSON.stringify(roles || []))
  },
  getRoles() {
    try {
      return JSON.parse(localStorage.getItem(ROLE_KEY) || '[]')
    } catch {
      return []
    }
  },
  setLoginMode(mode) {
    localStorage.setItem(LOGIN_MODE_KEY, mode)
  },
  getLoginMode() {
    return localStorage.getItem(LOGIN_MODE_KEY) || 'USER'
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem(LOGIN_MODE_KEY)
  },
}