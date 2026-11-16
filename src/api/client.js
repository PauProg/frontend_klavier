const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options

  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      ...rest,
      headers: {
        Accept: 'application/json',
        ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
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
    return null
  }

  return response.json()
}

export { API_URL }
