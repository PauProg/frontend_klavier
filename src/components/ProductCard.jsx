import { useState } from 'react'
import { formatPrice, formatYear } from '../utils/format.js'

function ProductImageFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-stone-900 p-6"
      aria-hidden="true"
    >
      <div className="flex h-2/3 w-3/4 items-end justify-center gap-1 rounded-lg bg-stone-50 p-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <span
            key={index}
            className="relative h-full flex-1 rounded-sm border border-stone-300 bg-white"
          >
            {[1, 2, 4, 5].includes(index) ? (
              <span className="mx-auto block h-1/2 w-full bg-stone-900" />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false)

  const image = Array.isArray(product.images) ? product.images.find(Boolean) : null
  const brand = product.brand || 'Klavier'
  const model = product.model || ''
  const year = formatYear(product.manufacturingYear)
  const stock = Number(product.currentStock)
  const available = Number.isFinite(stock) && stock > 0

  const availability = !available
    ? 'Sin stock'
    : stock <= 2
      ? 'Últimas unidades'
      : 'Disponible'

  const availabilityClass = !available
    ? 'bg-stone-200 text-stone-600'
    : stock <= 2
      ? 'bg-amber-100 text-amber-900'
      : 'bg-emerald-100 text-emerald-800'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={`${brand} ${model}`.trim()}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ProductImageFallback />
        )}

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${availabilityClass}`}
        >
          {availability}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
          {brand}
          {model ? ` · ${model}` : ''}
        </p>

        <h3 className="mt-2 font-serif text-xl leading-snug text-stone-950">
          {product.name || 'Piano'}
        </h3>

        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <p className="text-lg font-semibold text-stone-950">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-stone-500">Año {year}</p>
        </div>
      </div>
    </article>
  )
}
