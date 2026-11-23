/**
 * Lee un token numérico de CSS. Se usa para que las medidas del movimiento
 * (profundidad de la onda, tiempos) no vivan duplicadas en JavaScript.
 */
export function readNumber(name, fallback) {
  if (typeof window === 'undefined') return fallback

  const raw = getComputedStyle(document.documentElement).getPropertyValue(name)
  const value = Number.parseFloat(raw)

  return Number.isFinite(value) ? value : fallback
}
