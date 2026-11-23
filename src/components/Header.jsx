import { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ScrollTrigger, useGSAP } from '../motion/gsap.js'
import { AuthContext } from '../context/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  [
    'px-2 py-2 text-[11px] transition-colors duration-200 sm:px-3 sm:text-[13px]',
    isActive
      ? 'text-ink underline decoration-felt decoration-2 underline-offset-[6px]'
      : 'text-ink-soft hover:text-ink',
  ].join(' ')

const registerLinkClass = ({ isActive }) =>
  [
    'ml-1 bg-ink px-3 py-2 text-[11px] font-medium text-paper transition-colors duration-200 sm:px-4 sm:text-[13px]',
    isActive ? 'bg-felt' : 'hover:bg-felt',
  ].join(' ')

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { status } = useContext(AuthContext)

  useGSAP(() => {
    let last = false

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const next = self.scroll() > 8

        if (next !== last) {
          last = next
          setScrolled(next)
        }
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-40 h-[var(--header-height)] border-b border-transparent bg-paper/85 backdrop-blur-md transition-colors duration-300 data-[scrolled=true]:border-line"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          aria-label="Klavier, ir al inicio"
          className="flex shrink-0 items-baseline gap-2 py-2"
        >
          <span className="text-[19px] font-medium tracking-[-0.04em] text-ink">Klavier</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute sm:inline">
            Pianos
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="flex items-center">
          <NavLink to="/" end className={navLinkClass}>
            Inicio
          </NavLink>
          {status === 'anonymous' ? (
            <NavLink to="/login" className={navLinkClass}>
              Iniciar sesión
            </NavLink>
          ) : (
            <span className="px-2 py-2 text-[11px] text-ink-soft sm:px-3 sm:text-[13px]">
              {status === 'loading' ? 'Comprobando sesión…' : 'Sesión iniciada'}
            </span>
          )}
          <NavLink to="/register" className={registerLinkClass}>
            Crear cuenta
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
