import { useCallback, useEffect, useState } from 'react'
import {
  isMuted,
  loadSamples,
  playNote,
  releaseNote,
  setMuted,
  stopAll,
} from '../audio/piano.js'

/**
 * Puente entre el motor de audio (singleton de módulo) y React.
 * El motor no se recrea al montar: el doble montaje de StrictMode no duplica
 * contextos ni descargas.
 */
export default function usePiano() {
  const [status, setStatus] = useState('loading')
  const [muted, setMutedState] = useState(isMuted)

  useEffect(() => {
    let active = true

    loadSamples().then(({ loaded, total }) => {
      if (!active) return
      setStatus(loaded === 0 ? 'unavailable' : loaded < total ? 'partial' : 'ready')
    })

    const handleVisibility = () => {
      if (document.hidden) stopAll()
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      active = false
      document.removeEventListener('visibilitychange', handleVisibility)
      stopAll()
    }
  }, [])

  const toggleMute = useCallback(() => {
    const next = !isMuted()
    setMuted(next)
    setMutedState(next)
  }, [])

  return { status, muted, toggleMute, playNote, releaseNote }
}
