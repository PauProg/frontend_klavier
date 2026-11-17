import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg text-stone-950">Klavier</p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-stone-600">
            Pianos seleccionados para concierto, estudio y hogar.
          </p>
        </div>

        <nav aria-label="Navegación del pie" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/" className="text-stone-600 transition hover:text-stone-950">
            Inicio
          </Link>
          <Link to="/login" className="text-stone-600 transition hover:text-stone-950">
            Iniciar sesión
          </Link>
          <Link to="/register" className="text-stone-600 transition hover:text-stone-950">
            Crear cuenta
          </Link>
        </nav>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {currentYear} Klavier.</p>
          <p>Pau Medina Vázquez</p>
        </div>
      </div>
    </footer>
  )
}
