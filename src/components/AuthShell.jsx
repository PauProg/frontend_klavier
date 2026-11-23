import { Link } from 'react-router-dom'
import AuthPanel from './AuthPanel.jsx'

export default function AuthShell({ title, description, children, footer }) {
  return (
    <section className="grid min-h-[calc(100svh-var(--header-height))] lg:grid-cols-[1.05fr_1fr]">
      <AuthPanel />

      <div className="flex justify-center px-5 py-14 sm:px-8 lg:items-center lg:px-12 lg:py-20">
        <div className="w-full max-w-[26rem]">
          <h1 className="text-[clamp(2rem,3.4vw,2.9rem)] font-medium leading-[1] tracking-[-0.035em]">
            {title}
          </h1>
          <p className="mt-4 max-w-[38ch] text-[14px] leading-6 text-ink-soft">
            {description}
          </p>

          <div className="mt-9">{children}</div>

          <div className="mt-8 border-t border-line pt-5 text-[13px] leading-6 text-ink-soft">
            {footer}
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute transition-colors duration-200 hover:text-ink"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
