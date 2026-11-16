import { Link } from 'react-router-dom'
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid.jsx'
import useProducts from '../hooks/useProducts.js'

const features = [
  {
    title: 'Selección experta',
    description: 'Pianos escogidos por su sonido, estado y carácter.',
  },
  {
    title: 'Revisión técnica',
    description: 'Cada pieza se comprueba antes de publicarse en el catálogo.',
  },
  {
    title: 'Entrega cuidada',
    description: 'Acompañamiento en la entrega y puesta a punto del instrumento.',
  },
]

export default function Home() {
  const { products, loading, error, reload } = useProducts()
  const featuredProducts = products.slice(0, 6)

  return (
    <>
      <section className="relative overflow-hidden bg-stone-900 text-stone-50">
        <div
          className="absolute inset-y-0 right-0 hidden w-1/2 opacity-10 lg:block"
          aria-hidden="true"
        >
          <div className="flex h-full">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={index}
                className="relative flex-1 border-l border-stone-50/40 first:border-l-0"
              >
                {index % 7 !== 2 && index % 7 !== 6 ? (
                  <span className="absolute left-0 top-0 h-2/3 w-full bg-stone-950" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-300">
            Pianos con historia
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            El piano que estabas buscando, con la historia que merece.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-stone-300 sm:text-lg">
            Una selección de pianos verticales y de cola para concierto, estudio y hogar.
            Instrumentos revisados, con información clara y acompañamiento cercano.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#productos"
              className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200"
            >
              Ver pianos destacados
            </a>
            <Link
              to="/register"
              className="rounded-full border border-stone-600 px-5 py-3 text-sm font-medium text-stone-100 transition hover:border-stone-400 hover:bg-stone-800"
            >
              Crear cuenta
            </Link>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-stone-700 pt-6 text-sm">
            <div>
              <dt className="text-stone-400">Selección</dt>
              <dd className="mt-1 font-medium text-stone-100">Piezas revisadas</dd>
            </div>
            <div>
              <dt className="text-stone-400">Catálogo</dt>
              <dd className="mt-1 font-medium text-stone-100">Verticales y cola</dd>
            </div>
            <div>
              <dt className="text-stone-400">Atención</dt>
              <dd className="mt-1 font-medium text-stone-100">Trato cercano</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {features.map((feature, index) => (
            <div key={feature.title} className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-100 text-xs font-semibold text-stone-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 className="text-sm font-semibold text-stone-950">{feature.title}</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="productos"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-20"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
              Catálogo
            </p>
            <h2 className="mt-2 font-serif text-3xl text-stone-950 sm:text-4xl">
              Pianos destacados
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
              Una muestra del catálogo actual. Cada piano incluye marca, modelo, año y
              precio para que puedas comparar con calma.
            </p>
          </div>
          <p className="text-sm text-stone-500">Hasta 6 piezas destacadas</p>
        </div>

        <div className="mt-8">
          {loading ? <ProductGridSkeleton /> : null}

          {!loading && error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8"
            >
              <p className="font-medium text-red-900">
                No se han podido cargar los productos.
              </p>
              <p className="mt-2 text-sm leading-6 text-red-700">{error.message}</p>
              <button
                type="button"
                onClick={reload}
                className="mt-5 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
              >
                Reintentar
              </button>
            </div>
          ) : null}

          {!loading && !error && featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="font-serif text-2xl text-stone-950">
                Todavía no hay pianos publicados.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
                Cuando el catálogo tenga productos, aparecerán aquí con su información y
                precio.
              </p>
            </div>
          ) : null}

          {!loading && !error && featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : null}
        </div>
      </section>

      <section className="border-t border-stone-200 bg-amber-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-stone-950 sm:text-3xl">
              ¿Buscas un piano concreto?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-700">
              Crea tu cuenta para guardar tus favoritos y recibir novedades del catálogo.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex w-fit rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
          >
            Crear cuenta
          </Link>
        </div>
      </section>
    </>
  )
}
