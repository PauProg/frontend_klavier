import { apiFetch, clearSession, refreshAccessToken } from './client.js'

let recoveryPromise = null

export async function register({ name, surnames, birthDate, email, phone, nationality, password }) {
  const payload = {
    name: name.trim(),
    surnames: surnames.trim(),
    birthDate: birthDate.trim(),
    email: email.trim(),
    phone: phone.trim(),
    nationality: nationality.trim(),
    password,
  }
  const { status, body } = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { includeStatus: true })

  if (status !== 201 || body?.status !== 'success' || !body.data ||
      typeof body.data !== 'object' || Array.isArray(body.data)) {
    throw new Error('No se ha podido completar el registro. Inténtalo de nuevo.')
  }

  return body.data
}

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
