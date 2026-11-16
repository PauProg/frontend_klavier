import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-2.5 py-2 text-xs transition sm:px-3 sm:text-sm',
    isActive
      ? 'bg-stone-200 text-stone-950'
      : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-950',
  ].join(' ')

const registerLinkClass = ({ isActive }) =>
  [
    'rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm',
    isActive
      ? 'bg-amber-400 text-stone-950'
      : 'bg-stone-900 text-stone-50 hover:bg-stone-700',
  ].join(' ')

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-offset-4"
          aria-label="Klavier, ir al inicio"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-stone-900 font-serif text-xl text-stone-50">
            K
          </span>
          <span>
            <span className="block font-serif text-xl leading-none text-stone-950">
              Klavier
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-stone-500">
              Pianos
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="flex w-full items-center justify-end gap-1 sm:w-auto"
        >
          <NavLink to="/" end className={navLinkClass}>
            Inicio
          </NavLink>
          <NavLink to="/login" className={navLinkClass}>
            Iniciar sesión
          </NavLink>
          <NavLink to="/register" className={registerLinkClass}>
            Crear cuenta
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
