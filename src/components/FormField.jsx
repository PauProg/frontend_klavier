export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  error,
  hint,
  required = false,
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-ink-mute">
            *
          </span>
        ) : null}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={[
          'mt-2 h-11 w-full border-0 border-b bg-transparent px-0 text-[15px] text-ink transition-colors duration-200',
          error
            ? 'border-felt'
            : 'border-line-strong hover:border-ink-mute focus:border-ink',
        ].join(' ')}
      />

      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 font-mono text-[10px] text-ink-mute">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-baseline gap-2 text-[12px] leading-5 text-felt"
        >
          <span aria-hidden="true" className="font-mono">
            —
          </span>
          {error}
        </p>
      ) : null}
    </div>
  )
}
