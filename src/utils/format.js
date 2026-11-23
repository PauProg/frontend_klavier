const integerFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const decimalFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(value) {
  const price = Number(value)

  if (!Number.isFinite(price)) {
    return 'Precio no disponible'
  }

  return Number.isInteger(price) ? integerFormatter.format(price) : decimalFormatter.format(price)
}

export function formatYear(value) {
  const year = Number(value)
  return Number.isInteger(year) ? String(year) : '—'
}
