import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import FormField from '../components/FormField.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'Escribe tu correo electrónico.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'El correo no tiene un formato válido.'
  }

  if (!values.password) {
    errors.password = 'Escribe tu contraseña.'
  }

  return errors
}

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setNotice('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setNotice('')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setNotice(
        'Formulario correcto. El inicio de sesión real estará disponible en la siguiente sesión.',
      )
    }, 600)
  }

  return (
    <AuthShell
      title="Iniciar sesión"
      description="Accede a tu cuenta para gestionar tus pianos favoritos."
      footer={
        <p>
          ¿Todavía no tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-stone-950 underline underline-offset-4"
          >
            Crear una cuenta
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          error={errors.email}
          required
        />

        <FormField
          id="password"
          label="Contraseña"
          type="password"
          value={values.password}
          onChange={handleChange}
          autoComplete="current-password"
          error={errors.password}
          required
        />

        {notice ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
          >
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Comprobando…' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  )
}
