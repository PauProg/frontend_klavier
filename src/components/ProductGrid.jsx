import { useRef } from 'react'
import ProductCard from './ProductCard.jsx'
import { gsap, useGSAP } from '../motion/gsap.js'

const gridClass = 'grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'

export default function ProductGrid({ products }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(gsap.utils.toArray('[data-product]', ref.current), {
          opacity: 0,
          y: 28,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            once: true,
          },
        })
      }, ref)

      return () => mm.revert()
    },
    { scope: ref, dependencies: [products] },
  )

  return (
    <ul ref={ref} className={gridClass}>
      {products.map((product, index) => (
        <li
          key={product._id || product.id || `${product.name}-${index}`}
          data-product
          className="h-full"
        >
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className={gridClass} aria-label="Cargando productos" aria-busy="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="motion-reduce:animate-none">
          <div className="aspect-[4/3] animate-pulse bg-paper-deep motion-reduce:animate-none" />
          <div className="mt-4 space-y-3">
            <div className="h-2.5 w-1/3 animate-pulse bg-paper-deep motion-reduce:animate-none" />
            <div className="h-5 w-3/4 animate-pulse bg-paper-deep motion-reduce:animate-none" />
            <div className="h-2.5 w-1/4 animate-pulse bg-paper-deep motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  )
}
