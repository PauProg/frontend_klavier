import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-[1440px] flex-col justify-center px-5 py-20 sm:px-8 lg:px-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">Error 404</p>
      <h1 className="mt-6 max-w-[16ch] text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.035em]">
        Esta página no existe.
      </h1>
      <p className="mt-6 max-w-[46ch] text-[15px] leading-7 text-ink-soft">
        Puede que el enlace esté mal escrito o que la página se haya movido. Vuelve al inicio
        para seguir explorando el catálogo.
      </p>

      <Link
        to="/"
        className="mt-9 inline-flex w-fit items-center gap-3 bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt active:translate-y-px"
      >
        Volver al inicio
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}
