import { apiFetch, clearSession, refreshAccessToken } from './client.js'

let recoveryPromise = null

export async function login({ email, password }) {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return response?.data
}

export async function getCurrentUser() {
  const response = await apiFetch('/api/auth/me')
  return response?.data
}

export function recoverSession() {
  if (!recoveryPromise) {
    recoveryPromise = (async () => {
      try {
        await refreshAccessToken()
        const user = await getCurrentUser()
        if (!user) throw new Error('Respuesta de sesión incompleta.')
        return user
      } catch (error) {
        clearSession()
        throw error
      }
    })().finally(() => {
      recoveryPromise = null
    })
  }
  return recoveryPromise
}
