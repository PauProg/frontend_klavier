import {
  FIRST_MIDI,
  LAST_MIDI,
  SAMPLE_ROOTS,
  nearestSampleRoot,
  sampleUrlFor,
} from '../utils/notes.js'

const MAX_VOICES = 12
const MASTER_GAIN = 0.9
const VOICE_GAIN = 0.3
const ATTACK_SECONDS = 0.006
const RELEASE_SECONDS = 0.35
const STEAL_SECONDS = 0.06

let liveContext = null
let master = null
let buffers = new Map()
let loadPromise = null
let muted = false
const voices = new Map()

/**
 * Descarga y descodifica las muestras con un OfflineAudioContext: no está
 * sujeto a la política de autoplay, así que se puede preparar el sonido antes
 * de que el usuario toque nada y sin avisos en consola.
 */
export function loadSamples() {
  if (loadPromise) return loadPromise

  const decoder = new OfflineAudioContext(1, 1, 44100)

  loadPromise = Promise.allSettled(
    SAMPLE_ROOTS.map(async (root) => {
      const url = sampleUrlFor(root)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`No se pudo cargar ${url} (${response.status})`)
      }

      const data = await response.arrayBuffer()
      buffers.set(root, await decoder.decodeAudioData(data))
    }),
  ).then((results) => {
    results
      .filter((result) => result.status === 'rejected')
      .forEach((result) => console.warn('[piano]', result.reason?.message ?? result.reason))

    return { loaded: buffers.size, total: SAMPLE_ROOTS.length }
  })

  return loadPromise
}

function ensureLiveContext() {
  if (liveContext) return liveContext
  if (typeof window === 'undefined' || !window.AudioContext) return null

  liveContext = new window.AudioContext()

  master = liveContext.createGain()
  master.gain.value = muted ? 0 : MASTER_GAIN

  const limiter = liveContext.createDynamicsCompressor()
  limiter.threshold.value = -14
  limiter.knee.value = 24
  limiter.ratio.value = 8
  limiter.attack.value = 0.004
  limiter.release.value = 0.25

  master.connect(limiter)
  limiter.connect(liveContext.destination)

  return liveContext
}

function nearestLoadedRoot(midi) {
  let best = null
  let bestDistance = Infinity

  buffers.forEach((_, root) => {
    const distance = Math.abs(midi - root)
    if (distance < bestDistance) {
      best = root
      bestDistance = distance
    }
  })

  return best
}

// Las notas graves del piano son más rotundas que las agudas a igual pico:
// se compensa ligeramente para que el teclado suene equilibrado.
function levelFor(midi) {
  const position = (midi - FIRST_MIDI) / (LAST_MIDI - FIRST_MIDI)
  return VOICE_GAIN * (0.8 + 0.4 * position)
}

function stopVoice(midi, releaseSeconds) {
  const voice = voices.get(midi)
  if (!voice) return

  voices.delete(midi)

  const now = liveContext.currentTime
  voice.gain.gain.cancelScheduledValues(now)
  voice.gain.gain.setTargetAtTime(0, now, Math.max(releaseSeconds / 3, 0.01))
  voice.source.stop(now + releaseSeconds + 0.05)
}

function enforcePolyphony() {
  while (voices.size > MAX_VOICES) {
    stopVoice(voices.keys().next().value, STEAL_SECONDS)
  }
}

export function playNote(midi) {
  if (muted) return false

  const context = ensureLiveContext()
  if (!context) return false

  if (context.state !== 'running') {
    context.resume().catch(() => {})
  }

  const root = nearestLoadedRoot(midi)
  if (root == null) return false

  // Repetir la misma tecla corta la anterior en vez de solaparla.
  stopVoice(midi, STEAL_SECONDS)

  const now = context.currentTime
  const source = context.createBufferSource()
  source.buffer = buffers.get(root)
  source.playbackRate.value = 2 ** ((midi - root) / 12)

  const gain = context.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(levelFor(midi), now + ATTACK_SECONDS)

  source.connect(gain)
  gain.connect(master)
  source.start(now)

  const voice = { midi, source, gain }
  voices.set(midi, voice)

  source.onended = () => {
    if (voices.get(midi) === voice) voices.delete(midi)
    gain.disconnect()
  }

  enforcePolyphony()

  return true
}

export function releaseNote(midi) {
  stopVoice(midi, RELEASE_SECONDS)
}

export function stopAll() {
  Array.from(voices.keys()).forEach((midi) => stopVoice(midi, 0.1))
}

export function setMuted(next) {
  muted = next
  if (next) stopAll()

  if (master && liveContext) {
    const now = liveContext.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setTargetAtTime(next ? 0 : MASTER_GAIN, now, 0.02)
  }
}

export function isMuted() {
  return muted
}

export function isReady() {
  return buffers.size > 0
}

if (import.meta.env.DEV) {
  // Solo en desarrollo: permite comprobar desde la consola o desde una prueba
  // automatizada qué suena y con qué velocidad se reproduce cada muestra.
  window.__piano = {
    playNote,
    releaseNote,
    stopAll,
    status: () => ({
      samples: buffers.size,
      total: SAMPLE_ROOTS.length,
      muted,
      state: liveContext ? liveContext.state : 'sin contexto',
      voices: Array.from(voices.values()).map((voice) => ({
        midi: voice.midi,
        rate: Number(voice.source.playbackRate.value.toFixed(4)),
      })),
    }),
    rootFor: nearestSampleRoot,
  }
}
