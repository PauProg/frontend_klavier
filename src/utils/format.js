const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatPrice(value) {
  const price = Number(value)
  return Number.isFinite(price) ? priceFormatter.format(price) : 'Precio no disponible'
}

export function formatYear(value) {
  const year = Number(value)
  return Number.isInteger(year) ? String(year) : '—'
}
