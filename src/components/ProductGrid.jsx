import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product._id || product.id || `${product.name}-${index}`}
          product={product}
        />
      ))}
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Cargando productos"
      aria-busy="true"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white motion-reduce:animate-none"
        >
          <div className="aspect-[4/3] animate-pulse bg-stone-200 motion-reduce:animate-none" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200 motion-reduce:animate-none" />
            <div className="h-4 w-full animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  )
}
