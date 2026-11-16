import { useEffect, useState } from 'react'
import { getProducts } from '../api/products.js'

export default function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProducts({ signal: controller.signal })
        if (active) {
          setProducts(data)
        }
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return
        }

        if (active) {
          setError(requestError)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
      controller.abort()
    }
  }, [reloadKey])

  return {
    products,
    loading,
    error,
    reload: () => setReloadKey((key) => key + 1),
  }
}
