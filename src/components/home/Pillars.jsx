import { useRef } from 'react'
import { gsap, useGSAP } from '../../motion/gsap.js'

const pillars = [
  {
    title: 'Selección',
    lead: 'Cada piano se escoge por su sonido, su estado y su carácter.',
    body: 'No hay catálogo automático: entran pocas piezas y entran porque aguantan una comparación cara a cara.',
  },
  {
    title: 'Revisión',
    lead: 'Mecánica, afinación y mueble, comprobados antes de publicar.',
    body: 'La ficha refleja lo que hay. Si una pieza tiene una historia que contar, se cuenta; si tiene una tara, también.',
  },
  {
    title: 'Entrega',
    lead: 'Transporte y puesta a punto coordinados de principio a fin.',
    body: 'El instrumento se instala donde va a sonar y se ajusta allí. Nadie debería estrenar un piano desafinado.',
  },
]

export default function Pillars() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-pillar]', {
          opacity: 0,
          y: 26,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '[data-pillar-list]',
            start: 'top 82%',
            once: true,
          },
        })

        gsap.from('[data-pillar-intro]', {
          opacity: 0,
          y: 20,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-pillar-list]',
            start: 'top 88%',
            once: true,
          },
        })
      }, ref)

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="pilares" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-32">
        <div className="lg:col-span-4">
          <div data-pillar-intro className="lg:sticky lg:top-28">
            <h2 className="max-w-[16ch] text-[clamp(1.9rem,3vw,2.9rem)] font-medium leading-[1.04] tracking-[-0.03em]">
              Tres cosas que no se ven en una fotografía.
            </h2>
            <p className="mt-6 max-w-[36ch] text-[15px] leading-7 text-ink-soft">
              Comprar un piano usado es una decisión de confianza. Esto es lo que hacemos
              para que la confianza no haya que ponerla a ciegas.
            </p>
          </div>
        </div>

        <ol
          data-pillar-list
          className="divide-y divide-line border-t border-line lg:col-span-8"
        >
          {pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              data-pillar
              className="grid gap-4 py-9 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-8 sm:py-11"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div>
                <h3 className="text-xl font-medium tracking-[-0.01em] sm:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-ink sm:max-w-[46ch]">
                  {pillar.lead}
                </p>
                <p className="mt-2 text-[14px] leading-6 text-ink-mute sm:max-w-[52ch]">
                  {pillar.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
