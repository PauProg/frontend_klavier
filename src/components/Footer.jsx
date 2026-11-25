import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const { status } = useContext(AuthContext)

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr] md:items-start lg:px-12">
        <div>
          <p className="text-lg font-medium tracking-[-0.03em] text-ink">Klavier</p>
          <p className="mt-3 max-w-[36ch] text-[14px] leading-6 text-ink-soft">
            Pianos seleccionados para concierto, estudio y hogar.
          </p>
        </div>

        <nav
          aria-label="Navegación del pie"
          className="flex flex-col gap-2 text-[14px] sm:flex-row sm:gap-8 md:justify-end"
        >
          <Link
            to="/"
            className="text-ink-soft transition-colors duration-200 hover:text-ink"
          >
            Inicio
          </Link>
          {status === 'anonymous' && (
            <>
              <Link
                to="/login"
                className="text-ink-soft transition-colors duration-200 hover:text-ink"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-ink-soft transition-colors duration-200 hover:text-ink"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© {currentYear} Klavier</p>
          <p>Pau Medina Vázquez</p>
        </div>
      </div>
    </footer>
  )
}
