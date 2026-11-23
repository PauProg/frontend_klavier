import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest, recoverSession } from '../api/auth.js'
import { clearSession, setAccessToken, subscribeSession } from '../api/client.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')
  const established = useRef(false)
  const mounted = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    mounted.current = true
    let active = true
    const unsubscribe = subscribeSession(() => {
      if (!active) return
      const wasEstablished = established.current
      established.current = false
      setUser(null)
      setStatus('anonymous')
      if (wasEstablished) navigate('/login', { replace: true })
    })

    recoverSession().then((currentUser) => {
      if (!active) return
      established.current = true
      setUser(currentUser)
      setStatus('authenticated')
    }).catch(() => {
      if (active) setStatus('anonymous')
    })

    return () => {
      active = false
      mounted.current = false
      unsubscribe()
    }
  }, [navigate])

  const login = useCallback(async (credentials, isActive = () => true) => {
    const data = await loginRequest(credentials)
    if (!data?.accessToken || !data?.user) {
      clearSession()
      throw new Error('Respuesta de sesión incompleta.')
    }
    if (mounted.current && isActive()) {
      setAccessToken(data.accessToken)
      established.current = true
      setUser(data.user)
      setStatus('authenticated')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, login }}>
      {children}
    </AuthContext.Provider>
  )
}
