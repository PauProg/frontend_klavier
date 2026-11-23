import Keyboard from './Keyboard.jsx'

const points = [
  'Guarda los pianos que te interesan.',
  'Compáralos con calma cuando quieras.',
  'Recibe aviso cuando entre una pieza nueva.',
]

export default function AuthPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:flex-col lg:justify-between">
      <div className="px-12 py-14 xl:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/60">
          Klavier
        </p>

        <p className="mt-12 max-w-[13ch] text-[clamp(2.2rem,3.2vw,3.4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
          Un piano no se elige con prisa.
        </p>

        <p className="mt-6 max-w-[38ch] text-[14px] leading-7 text-paper/70">
          Crea tu cuenta para guardar tu selección, comparar opciones y enterarte antes que
          nadie de lo que entra en el catálogo.
        </p>

        <ol className="mt-10 max-w-[38ch] border-t border-paper/15">
          {points.map((point, index) => (
            <li
              key={point}
              className="flex items-baseline gap-4 border-b border-paper/15 py-3.5 text-[14px] leading-6 text-paper/85"
            >
              <span aria-hidden="true" className="font-mono text-[10px] text-paper/55">
                {String(index + 1).padStart(2, '0')}
              </span>
              {point}
            </li>
          ))}
        </ol>
      </div>

      <Keyboard static tone="ink" className="h-[168px] shrink-0" />
    </aside>
  )
}
