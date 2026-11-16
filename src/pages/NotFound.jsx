import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-serif text-7xl text-stone-300">404</p>
      <h1 className="mt-4 font-serif text-3xl text-stone-950 sm:text-4xl">
        Esta página no existe
      </h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
        Puede que el enlace esté mal escrito o que la página se haya movido. Vuelve al
        inicio para seguir explorando el catálogo.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
