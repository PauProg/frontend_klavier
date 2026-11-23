import { useEffect } from 'react'
import FeaturedProducts from '../components/home/FeaturedProducts.jsx'
import ClosingCta from '../components/home/ClosingCta.jsx'
import Hero from '../components/home/Hero.jsx'
import Manifesto from '../components/home/Manifesto.jsx'
import Pillars from '../components/home/Pillars.jsx'
import useProducts from '../hooks/useProducts.js'
import { ScrollTrigger } from '../motion/gsap.js'

export default function Home() {
  const { products, loading, error, reload } = useProducts()
  const featuredProducts = products.slice(0, 6)

  // Las tarjetas cambian de alto el layout cuando terminan de cargar:
  // sin este refresco, los triggers calculados antes del fetch quedan desfasados.
  useEffect(() => {
    if (!loading) {
      ScrollTrigger.refresh()
    }
  }, [loading])

  return (
    <>
      <Hero productCount={loading || error ? 0 : products.length} />
      <Manifesto />
      <Pillars />
      <FeaturedProducts
        products={featuredProducts}
        loading={loading}
        error={error}
        onRetry={reload}
      />
      <ClosingCta />
    </>
  )
}
