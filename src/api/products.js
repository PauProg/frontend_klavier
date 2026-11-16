import { apiFetch } from './client.js'

export async function getProducts({ signal } = {}) {
  const body = await apiFetch('/api/products', { signal })
  return Array.isArray(body?.data) ? body.data : []
}
