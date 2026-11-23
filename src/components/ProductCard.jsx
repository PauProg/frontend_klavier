import { useState } from 'react'
import Keyboard from './Keyboard.jsx'
import { formatPrice, formatYear } from '../utils/format.js'

function ProductImageFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-paper-deep"
      aria-hidden="true"
    >
      <div className="h-16 w-[58%] border border-line-strong">
        <Keyboard static octaves={2} className="h-full" />
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

  const availability = !available ? 'Sin stock' : stock <= 2 ? 'Últimas' : 'Disponible'

  const availabilityTone = !available
    ? 'bg-line-strong'
    : stock <= 2
      ? 'bg-felt'
      : 'bg-ink'

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={`${product.name || 'Piano'} ${brand} ${model}`.trim()}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ProductImageFallback />
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
        <p>
          {brand}
          {model ? ` · ${model}` : ''}
        </p>
        <p className="flex shrink-0 items-center gap-2 text-ink">
          <span aria-hidden="true" className={`block h-px w-3 ${availabilityTone}`} />
          {availability}
        </p>
      </div>

      <h3 className="mt-2 text-xl font-medium leading-snug tracking-[-0.015em]">
        {product.name || 'Piano'}
      </h3>

      {product.description ? (
        <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-ink-soft">
          {product.description}
        </p>
      ) : null}

      <div className="mt-auto flex items-baseline justify-between gap-4 pt-4">
        <p className="font-mono text-[15px] tabular-nums text-ink">
          {formatPrice(product.price)}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
          Año {year}
        </p>
      </div>
    </article>
  )
}
