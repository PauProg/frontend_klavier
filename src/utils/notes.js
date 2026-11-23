// Modelo del teclado. No son valores de diseño: son teoría musical y la
// correspondencia con los ficheros de muestra, así que viven en JS a propósito.

export const FIRST_MIDI = 36 // Do2
export const LAST_MIDI = 83 // Si5
export const SEMITONES_PER_OCTAVE = 12
export const WHITE_KEYS_PER_OCTAVE = 7

// Semitonos que sí son tecla blanca dentro de una octava.
export const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11])

const LETTER_BY_PITCH_CLASS = [
  'Do',
  'Do',
  'Re',
  'Re',
  'Mi',
  'Fa',
  'Fa',
  'Sol',
  'Sol',
  'La',
  'La',
  'Si',
]

const IS_SHARP = [false, true, false, true, false, false, true, false, true, false, true, false]

const FILE_PITCH_CLASS = ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b']

// Una muestra cada tres semitonos, de Do2 a La5. El resto se obtiene con
// playbackRate, con un desvío máximo de ±1,5 semitonos.
export const SAMPLE_ROOTS = [36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81]

// Teclado del ordenador: una octava cromática a partir de la octava activa.
export const COMPUTER_KEY_OFFSETS = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
}

export function octaveOf(midi) {
  return Math.floor(midi / SEMITONES_PER_OCTAVE) - 1
}

export function noteLabel(midi) {
  const pitchClass = midi % SEMITONES_PER_OCTAVE
  return `${LETTER_BY_PITCH_CLASS[pitchClass]}${IS_SHARP[pitchClass] ? '♯' : ''}${octaveOf(midi)}`
}

export function noteAriaLabel(midi) {
  const pitchClass = midi % SEMITONES_PER_OCTAVE
  return `${LETTER_BY_PITCH_CLASS[pitchClass]}${IS_SHARP[pitchClass] ? ' sostenido' : ''} ${octaveOf(midi)}`
}

export function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / SEMITONES_PER_OCTAVE)
}

export function sampleUrlFor(midi) {
  const pitchClass = midi % SEMITONES_PER_OCTAVE
  return `/audio/piano/${FILE_PITCH_CLASS[pitchClass]}${octaveOf(midi)}.m4a`
}

export function nearestSampleRoot(midi) {
  let best = SAMPLE_ROOTS[0]
  let bestDistance = Math.abs(midi - best)

  SAMPLE_ROOTS.forEach((root) => {
    const distance = Math.abs(midi - root)
    if (distance < bestDistance) {
      best = root
      bestDistance = distance
    }
  })

  return best
}
