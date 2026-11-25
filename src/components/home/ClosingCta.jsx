import { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { gsap, useGSAP } from '../../motion/gsap.js'

export default function ClosingCta() {
  const ref = useRef(null)
  const { status } = useContext(AuthContext)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-closing-line] > span', {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 78%',
            once: true,
          },
        })

        gsap.from('[data-closing-copy]', {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 72%',
            once: true,
          },
        })
      }, ref)

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="border-t border-line bg-paper">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12 lg:py-32">
        <h2 className="text-[clamp(2.2rem,5.2vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.035em] lg:col-span-8">
          <span data-closing-line className="block overflow-hidden pb-[0.06em]">
            <span className="block">¿Buscas un piano</span>
          </span>
          <span data-closing-line className="block overflow-hidden pb-[0.06em]">
            <span className="block">concreto?</span>
          </span>
        </h2>

        <div data-closing-copy className="lg:col-span-4 lg:pb-2">
          {status === 'anonymous' && (
            <>
              <p className="max-w-[36ch] text-[15px] leading-7 text-ink-soft">
                Crea tu cuenta para guardar la selección que te interesa y recibir aviso cuando
                entre una pieza nueva en el catálogo.
              </p>
              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt active:translate-y-px"
              >
                Crear cuenta
                <span aria-hidden="true">→</span>
              </Link>
            </>
          )}
          {status === 'authenticated' && (
            <>
              <p className="max-w-[36ch] text-[15px] leading-7 text-ink-soft">
                Explora nuestra selección de pianos y compara los instrumentos disponibles para encontrar el que encaja contigo.
              </p>
              <a
                href="#productos"
                className="mt-7 inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt active:translate-y-px"
              >
                Ver el catálogo
                <span aria-hidden="true">→</span>
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
