import { useRef } from 'react'
import Keyboard from '../Keyboard.jsx'
import usePiano from '../../hooks/usePiano.js'
import { gsap, useGSAP } from '../../motion/gsap.js'

export default function Hero({ productCount = 0 }) {
  const ref = useRef(null)
  const { status, muted, toggleMute, playNote, releaseNote } = usePiano()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })

        timeline
          .from(
            '.hero-line > span',
            { yPercent: 115, duration: 1.15, stagger: 0.09 },
            0.05,
          )
          .from('.hero-rule', { scaleX: 0, duration: 1.3, ease: 'power2.inOut' }, 0.15)
          .from('.hero-rise', { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, 0.45)
      }, ref)

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative flex min-h-[calc(100svh-var(--header-height))] flex-col">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-center px-5 pb-6 pt-14 sm:px-8 sm:pb-10 sm:pt-20 lg:px-12 lg:pb-10 lg:pt-24">
        <div className="w-full">
          <p className="hero-rise font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
            Klavier — Pianos de concierto
          </p>

          <h1 className="mt-7 text-[clamp(2.9rem,8.4vw,7.4rem)] font-medium leading-[0.92] tracking-[-0.035em]">
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block">Pianos elegidos</span>
            </span>
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block pl-[9vw] lg:pl-[18vw]">uno a uno.</span>
            </span>
          </h1>

          <div className="hero-rule mt-10 h-px w-full origin-left bg-line" />

          <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <p className="hero-rise max-w-[44ch] text-[15px] leading-7 text-ink-soft sm:text-base">
              Verticales y de cola revisados por técnicos. Precio a la vista y acompañamiento
              hasta que el piano suena en tu casa.
            </p>

            <div className="hero-rise flex flex-wrap items-center gap-3">
              <a
                href="#productos"
                className="inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt active:translate-y-px"
              >
                Ver el catálogo
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href="#pilares"
                className="inline-flex items-center px-6 py-4 text-sm font-medium text-ink transition-colors duration-200 hover:text-felt active:translate-y-px"
              >
                Cómo trabajamos
              </a>
            </div>
          </div>

          {productCount > 0 ? (
            <p className="hero-rise mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
              {productCount} {productCount === 1 ? 'pieza' : 'piezas'} en catálogo
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 pb-3 sm:px-8 lg:px-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
          {status === 'ready' || status === 'partial'
            ? 'Toca el teclado'
            : status === 'loading'
              ? 'Cargando sonido…'
              : 'Sonido no disponible'}
        </p>

        {status === 'unavailable' ? null : (
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={!muted}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute transition-colors duration-200 hover:text-ink"
          >
            <span
              aria-hidden="true"
              className={[
                'block h-px w-4 transition-colors duration-200',
                muted ? 'bg-line-strong' : 'bg-felt',
              ].join(' ')}
            />
            {muted ? 'Activar sonido' : 'Silenciar'}
          </button>
        )}
      </div>

      <Keyboard
        animated
        playable
        onPlay={playNote}
        onRelease={releaseNote}
        className="h-[128px] shrink-0 sm:h-[164px] lg:h-[204px]"
      />
    </section>
  )
}
