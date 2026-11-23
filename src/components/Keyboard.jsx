import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { gsap, useGSAP } from '../motion/gsap.js'
import { readNumber } from '../motion/tokens.js'
import {
  COMPUTER_KEY_OFFSETS,
  LAST_MIDI,
  SEMITONES_PER_OCTAVE,
  WHITE_KEYS_PER_OCTAVE,
  WHITE_PITCH_CLASSES,
  noteAriaLabel,
} from '../utils/notes.js'

const WHITE_SURFACE = 'border-r border-ink/20 bg-paper data-[pressed=true]:bg-paper-deep'
const BLACK_SURFACE = 'bg-ink'

// En pantallas estrechas caben menos octavas sin que las teclas queden
// impracticables. La nota más aguda siempre es la misma: el teclado crece
// hacia los graves, no hacia la derecha.
function resolveOctaves(maxOctaves, width) {
  if (width >= 1024) return maxOctaves
  if (width >= 640) return Math.min(3, maxOctaves)
  return Math.min(2, maxOctaves)
}

const subscribeWidth = (callback) => {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}
const noopSubscribe = () => () => {}
const getWidth = () => window.innerWidth
const getZero = () => 0

function useResponsiveOctaves(maxOctaves, enabled) {
  const width = useSyncExternalStore(
    enabled ? subscribeWidth : noopSubscribe,
    enabled ? getWidth : getZero,
    getZero,
  )

  return enabled ? resolveOctaves(maxOctaves, width) : maxOctaves
}

/**
 * Teclado dibujado con CSS: es el motivo gráfico de Klavier.
 *
 * - `animated`: las teclas se hunden en oleada según el scroll.
 * - `playable`: cada tecla es un botón real que dispara `onPlay` / `onRelease`.
 *
 * El scroll mueve el contenedor de cada tecla; la pulsación mueve la superficie
 * de dentro. Son dos elementos distintos a propósito: GSAP y las transiciones
 * CSS nunca tocan el mismo nodo.
 */
export default function Keyboard({
  animated = false,
  playable = false,
  tone = 'paper',
  octaves = 4,
  className = '',
  onPlay,
  onRelease,
}) {
  const ref = useRef(null)
  const buttons = useRef(new Map())
  const pointerNotes = useRef(new Map())
  const heldNotes = useRef(new Map())
  const focusedByPointer = useRef(true)
  const [focusIndex, setFocusIndex] = useState(0)
  const [computerOctave, setComputerOctave] = useState(4)

  const visibleOctaves = useResponsiveOctaves(octaves, playable)
  const whiteKeys = visibleOctaves * WHITE_KEYS_PER_OCTAVE
  const lastMidi = LAST_MIDI
  const firstMidi = lastMidi + 1 - visibleOctaves * SEMITONES_PER_OCTAVE

  const keys = useMemo(() => {
    const total = visibleOctaves * SEMITONES_PER_OCTAVE
    const list = []
    let whiteIndex = -1

    for (let offset = 0; offset < total; offset += 1) {
      const midi = firstMidi + offset
      const isBlack = !WHITE_PITCH_CLASSES.has(midi % SEMITONES_PER_OCTAVE)

      if (!isBlack) whiteIndex += 1

      list.push({
        index: offset,
        midi,
        isBlack,
        edge: whiteIndex + 1,
        label: noteAriaLabel(midi),
      })
    }

    return list
  }, [firstMidi, visibleOctaves])

  // Si el viewport cambia de octavas, el índice de foco puede quedar fuera.
  const activeIndex = Math.min(focusIndex, keys.length - 1)

  useGSAP(
    () => {
      if (!animated) return undefined

      const waveDepth = readNumber('--key-wave-depth', 14)
      const waveDepthBlack = readNumber('--key-wave-depth-black', 9)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const white = gsap.utils.toArray('[data-key="white"]', ref.current)
        const black = gsap.utils.toArray('[data-key="black"]', ref.current)

        const timeline = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.4,
          },
        })

        timeline
          .to(white, { y: waveDepth, duration: 0.3, stagger: { each: 0.02 } }, 0)
          .to(white, { y: 0, duration: 0.5, stagger: { each: 0.02 } }, 0.4)
          .to(black, { y: waveDepthBlack, duration: 0.3, stagger: { each: 0.02 } }, 0.06)
          .to(black, { y: 0, duration: 0.5, stagger: { each: 0.02 } }, 0.46)
      }, ref)

      return () => mm.revert()
    },
    { scope: ref, dependencies: [animated] },
  )

  const setPressed = useCallback((midi, pressed) => {
    const element = buttons.current.get(midi)
    if (element) element.dataset.pressed = pressed ? 'true' : 'false'
  }, [])

  const press = useCallback(
    (midi) => {
      setPressed(midi, true)
      onPlay?.(midi)
    },
    [onPlay, setPressed],
  )

  const release = useCallback(
    (midi) => {
      setPressed(midi, false)
      onRelease?.(midi)
    },
    [onRelease, setPressed],
  )

  const releaseEverything = useCallback(() => {
    pointerNotes.current.forEach((midi) => release(midi))
    pointerNotes.current.clear()
    heldNotes.current.forEach((midi) => release(midi))
    heldNotes.current.clear()
  }, [release])

  const focusKeyAt = useCallback(
    (index) => {
      const clamped = Math.min(Math.max(index, 0), keys.length - 1)
      buttons.current.get(keys[clamped].midi)?.focus()
    },
    [keys],
  )

  const handlePointerDown = useCallback(
    (event, midi) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return

      event.preventDefault()
      pointerNotes.current.set(event.pointerId, midi)
      press(midi)
      buttons.current.get(midi)?.focus({ preventScroll: true })
    },
    [press],
  )

  // Con un puntero pulsado, entrar en otra tecla toca esa: es el glissando.
  const handlePointerEnter = useCallback(
    (event, midi) => {
      if (!pointerNotes.current.has(event.pointerId)) return

      const current = pointerNotes.current.get(event.pointerId)
      if (current === midi) return

      release(current)
      pointerNotes.current.set(event.pointerId, midi)
      press(midi)
    },
    [press, release],
  )

  const handlePointerLeave = useCallback(
    (event) => {
      const midi = pointerNotes.current.get(event.pointerId)
      if (midi == null) return

      pointerNotes.current.delete(event.pointerId)
      release(midi)
    },
    [release],
  )

  const handleKeyDown = useCallback(
    (event, index, midi) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          focusKeyAt(index + 1)
          return
        case 'ArrowLeft':
          event.preventDefault()
          focusKeyAt(index - 1)
          return
        case 'ArrowUp':
          event.preventDefault()
          focusKeyAt(index + SEMITONES_PER_OCTAVE)
          return
        case 'ArrowDown':
          event.preventDefault()
          focusKeyAt(index - SEMITONES_PER_OCTAVE)
          return
        case 'Home':
          event.preventDefault()
          focusKeyAt(0)
          return
        case 'End':
          event.preventDefault()
          focusKeyAt(keys.length - 1)
          return
        case ' ':
        case 'Enter':
          event.preventDefault()
          if (!event.repeat) {
            heldNotes.current.set(`key-${midi}`, midi)
            press(midi)
          }
          return
        default:
          break
      }

      const letter = event.key.toLowerCase()

      if (letter === 'z' || letter === 'x') {
        event.preventDefault()
        setComputerOctave((octave) =>
          Math.min(5, Math.max(2, octave + (letter === 'x' ? 1 : -1))),
        )
        return
      }

      const offset = COMPUTER_KEY_OFFSETS[letter]
      if (offset == null) return

      event.preventDefault()
      if (event.repeat) return

      const playedMidi = (computerOctave + 1) * SEMITONES_PER_OCTAVE + offset
      if (playedMidi < firstMidi || playedMidi > lastMidi) return

      heldNotes.current.set(letter, playedMidi)
      press(playedMidi)
    },
    [computerOctave, firstMidi, focusKeyAt, keys.length, lastMidi, press],
  )

  const handleKeyUp = useCallback(
    (event, midi) => {
      const buttonKey = `key-${midi}`

      if (heldNotes.current.has(buttonKey)) {
        heldNotes.current.delete(buttonKey)
        release(midi)
        return
      }

      const letter = event.key.toLowerCase()
      const playedMidi = heldNotes.current.get(letter)
      if (playedMidi == null) return

      heldNotes.current.delete(letter)
      release(playedMidi)
    },
    [release],
  )

  useEffect(() => {
    if (!playable) return undefined

    // Modalidad del último input: decide si el foco merece anillo.
    const markPointer = () => {
      focusedByPointer.current = true
    }
    const markKeyboard = () => {
      focusedByPointer.current = false
    }

    window.addEventListener('pointerdown', markPointer, true)
    window.addEventListener('keydown', markKeyboard, true)

    return () => {
      window.removeEventListener('pointerdown', markPointer, true)
      window.removeEventListener('keydown', markKeyboard, true)
    }
  }, [playable])

  useEffect(() => {
    if (!playable) return undefined

    const stopPointer = (event) => {
      const midi = pointerNotes.current.get(event.pointerId)
      if (midi == null) return

      pointerNotes.current.delete(event.pointerId)
      release(midi)
    }

    window.addEventListener('pointerup', stopPointer)
    window.addEventListener('pointercancel', stopPointer)

    return () => {
      window.removeEventListener('pointerup', stopPointer)
      window.removeEventListener('pointercancel', stopPointer)
    }
  }, [playable, release])

  const registerButton = useCallback((midi, element) => {
    if (element) buttons.current.set(midi, element)
    else buttons.current.delete(midi)
  }, [])

  const isInk = tone === 'ink'
  const WhiteKeys = playable ? 'button' : 'div'
  const BlackKeys = playable ? 'button' : 'div'

  const surfaceProps = (key) =>
    playable
      ? {
          type: 'button',
          'aria-label': key.label,
          tabIndex: key.index === activeIndex ? 0 : -1,
          onPointerDown: (event) => handlePointerDown(event, key.midi),
          onPointerEnter: (event) => handlePointerEnter(event, key.midi),
          onKeyDown: (event) => handleKeyDown(event, key.index, key.midi),
          onKeyUp: (event) => handleKeyUp(event, key.midi),
          onFocus: (event) => {
            setFocusIndex(key.index)
            event.currentTarget.dataset.focusRing = focusedByPointer.current ? 'false' : 'true'
          },
          onBlur: (event) => {
            delete event.currentTarget.dataset.focusRing
          },
        }
      : {}

  return (
    <div
      ref={ref}
      aria-hidden={playable ? undefined : 'true'}
      role={playable ? 'group' : undefined}
      aria-label={playable ? `Teclado de piano de ${visibleOctaves} octavas` : undefined}
      className={[
        'relative w-full overflow-hidden',
        animated ? 'border-t' : '',
        isInk ? 'border-paper/20 bg-ink' : 'border-line bg-paper-deep',
        playable ? 'touch-none select-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--white-count': whiteKeys }}
      onPointerLeave={playable ? handlePointerLeave : undefined}
      onBlur={
        playable
          ? (event) => {
              if (!ref.current?.contains(event.relatedTarget)) releaseEverything()
            }
          : undefined
      }
      onContextMenu={playable ? (event) => event.preventDefault() : undefined}
    >
      <div className={['relative h-full w-full', animated ? 'keyboard-track' : ''].join(' ')}>
        <div className="flex h-full w-full">
          {keys
            .filter((key) => !key.isBlack)
            .map((key) => (
              <div key={key.midi} data-key="white" className="relative h-full flex-1">
                <WhiteKeys
                  {...surfaceProps(key)}
                  ref={(element) => registerButton(key.midi, element)}
                  data-key-surface
                  data-midi={key.midi}
                  data-pressed="false"
                  className={['relative block h-full w-full', WHITE_SURFACE].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      'pointer-events-none absolute inset-x-0 bottom-0 h-5',
                      isInk
                        ? 'bg-gradient-to-t from-ink/15 to-transparent'
                        : 'bg-gradient-to-t from-ink/8 to-transparent',
                    ].join(' ')}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-ink/10 to-transparent"
                  />
                </WhiteKeys>
              </div>
            ))}
        </div>

        <div className="pointer-events-none absolute inset-0">
          {keys
            .filter((key) => key.isBlack)
            .map((key) => (
              <div
                key={key.midi}
                data-key="black"
                className="key-black absolute top-0"
                style={{ '--edge': key.edge }}
              >
                <BlackKeys
                  {...surfaceProps(key)}
                  ref={(element) => registerButton(key.midi, element)}
                  data-key-surface
                  data-midi={key.midi}
                  data-pressed="false"
                  className={[
                    'relative block h-full w-full',
                    playable ? 'pointer-events-auto' : '',
                    BLACK_SURFACE,
                    isInk ? 'ring-1 ring-paper/25' : 'shadow-[var(--key-shadow)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
