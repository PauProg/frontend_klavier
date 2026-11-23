import { useRef } from 'react'
import { gsap, useGSAP } from '../../motion/gsap.js'

const manifesto =
  'Un piano no se elige con prisa. Se escucha, se mide y se prueba sentado delante. ' +
  'Nosotros ponemos la otra mitad: la revisión técnica, la historia de cada pieza y la ' +
  'certeza de que lo que entra en tu casa está a la altura.'

const manifestoWords = manifesto.split(' ')

export default function Manifesto() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const words = gsap.utils.toArray('[data-word]', ref.current)
      const mm = gsap.matchMedia()

      // El estado inicial solo existe si hay JS y si el usuario acepta movimiento:
      // sin una de las dos cosas, el texto se lee entero desde el principio.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(words, { opacity: 0.14 })

        gsap.to(words, {
          opacity: 1,
          ease: 'none',
          stagger: 0.5,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: '+=65%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        })
      }, ref)

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      className="flex min-h-[100svh] items-center border-t border-ink/20 bg-ink text-paper"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        <p className="max-w-[26ch] font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">
          El criterio
        </p>

        <p className="mt-8 max-w-[19ch] text-[clamp(1.75rem,4.4vw,3.9rem)] font-medium leading-[1.12] tracking-[-0.025em] sm:max-w-[26ch] lg:max-w-[30ch]">
          {manifestoWords.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span data-word className="inline-block">
                {word}
              </span>
              {index < manifestoWords.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
