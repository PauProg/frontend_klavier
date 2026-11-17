import { Link } from 'react-router-dom'

export default function AuthShell({ title, description, children, footer }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
      <div className="hidden lg:block">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-stone-500">
          Klavier
        </p>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-stone-950">
          Un piano no se elige con prisa.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-stone-600">
          Crea tu cuenta para guardar los pianos que te interesan, comparar opciones y
          recibir novedades del catálogo.
        </p>

        <ul className="mt-8 space-y-3 text-sm text-stone-700">
          {[
            'Favoritos y comparaciones guardadas.',
            'Avisos cuando llegue una pieza nueva.',
            'Atención directa para resolver dudas.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-md justify-self-center rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-serif text-3xl text-stone-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>

        <div className="mt-6">{children}</div>

        <div className="mt-6 border-t border-stone-200 pt-5 text-sm text-stone-600">
          {footer}
        </div>

        <Link
          to="/"
          className="mt-5 inline-block text-xs font-medium text-stone-600 underline-offset-4 transition hover:text-stone-950 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </div>
    </section>
  )
}
