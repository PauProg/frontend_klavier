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
      <label htmlFor={id} className="block text-sm font-medium text-stone-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
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
          'mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-stone-300 focus:border-stone-500',
        ].join(' ')}
      />

      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone-500">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
