import ProductGrid, { ProductGridSkeleton } from '../ProductGrid.jsx'

export default function FeaturedProducts({ products, loading, error, onRetry }) {
  return (
    <section id="productos" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-5 border-b border-line pb-8">
          <div>
            <h2 className="text-[clamp(1.9rem,3.6vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              Pianos disponibles
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-ink-soft">
              Una muestra del catálogo. Cada ficha incluye marca, modelo, año y precio para
              que puedas comparar sin llamar a nadie.
            </p>
          </div>
        </div>

        <div className="mt-12">
          {loading ? <ProductGridSkeleton /> : null}

          {!loading && error ? (
            <div
              role="alert"
              className="border-l-2 border-felt bg-paper-deep/50 px-6 py-7 sm:px-8"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-felt">
                Error de conexión
              </p>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-7 text-ink">
                No se ha podido cargar el catálogo. Comprueba que la API está en marcha y
                vuelve a intentarlo.
              </p>
              <p className="mt-2 text-[13px] leading-6 text-ink-mute">{error.message}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-6 inline-flex items-center gap-3 bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt active:translate-y-px"
              >
                Reintentar
              </button>
            </div>
          ) : null}

          {!loading && !error && products.length === 0 ? (
            <div className="border border-dashed border-line-strong px-6 py-16 text-center">
              <p className="text-2xl font-medium tracking-[-0.02em]">
                Todavía no hay pianos publicados.
              </p>
              <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-7 text-ink-soft">
                Cuando el catálogo tenga piezas, aparecerán aquí con su información y su
                precio.
              </p>
            </div>
          ) : null}

          {!loading && !error && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : null}
        </div>
      </div>
    </section>
  )
}
