const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let accessToken = null
let refreshPromise = null
const sessionListeners = new Set()
const authPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/auth/logout']

export function setAccessToken(token) {
  accessToken = token
}

export function clearSession() {
  accessToken = null
  sessionListeners.forEach((listener) => listener())
}

export function subscribeSession(listener) {
  sessionListeners.add(listener)
  return () => sessionListeners.delete(listener)
}

export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = apiFetch('/api/auth/refresh', { method: 'POST' })
      .then((response) => {
        const token = response?.data?.accessToken
        if (!token) throw new Error('Respuesta de sesión incompleta.')
        setAccessToken(token)
        return token
      })
      .catch((error) => {
        clearSession()
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

function waitForRefresh(promise, signal) {
  if (!signal) return promise
  if (signal.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'))

  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException('Aborted', 'AbortError'))
    signal.addEventListener('abort', abort, { once: true })
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort))
  })
}

export async function apiFetch(path, options = {}, { includeStatus = false } = {}) {
  const { headers, ...rest } = options
  const isAuth = authPaths.includes(path.split('?')[0])
  const requestToken = accessToken

  async function request(token) {
    try {
      return await fetch(`${API_URL}${path}`, {
        credentials: 'include',
        ...rest,
        headers: {
          Accept: 'application/json',
          ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
          ...(!isAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error
      }

      throw new Error(
        'No se ha podido conectar con la API. Comprueba que el backend esté arrancado.',
        { cause: error },
      )
    }
  }

  let response = await request(requestToken)
  if (response.status === 401 && !isAuth) {
    if (rest.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    const token = accessToken && accessToken !== requestToken
      ? accessToken
      : await waitForRefresh(refreshAccessToken(), rest.signal)
    if (rest.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    response = await request(token)
    if (response.status === 401) clearSession()
  }

  if (!response.ok) {
    let message = 'No se ha podido completar la petición.'

    try {
      const body = await response.json()
      if (body?.message) {
        message = body.message
      }
    } catch {
      // La respuesta de error no era JSON; se mantiene el mensaje genérico.
    }

    const error = new Error(message)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return includeStatus ? { status: response.status, body: null } : null
  }

  const body = await response.json()
  return includeStatus ? { status: response.status, body } : body
}

export { API_URL }
