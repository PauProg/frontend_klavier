import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell.jsx'
import FormField from '../components/FormField.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

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
  const { login, status } = useContext(AuthContext)
  const navigate = useNavigate()
  const pending = useRef(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setNotice('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (pending.current || status === 'loading') return

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setNotice('Revisa los campos indicados e inténtalo de nuevo.')
      event.currentTarget.elements[nextErrors.email ? 'email' : 'password']?.focus()
      return
    }

    pending.current = true
    setSubmitting(true)
    setNotice('')
    const credentials = { email: values.email.trim(), password: values.password }
    try {
      await login(credentials, () => mounted.current)
      if (mounted.current) navigate('/', { replace: true })
    } catch (error) {
      if (mounted.current) {
        if (error.status === 401 || error.status === 403) {
          setNotice('No se ha podido iniciar sesión con esos datos.')
        } else if ([400, 409, 422].includes(error.status)) {
          setNotice('Revisa los datos e inténtalo de nuevo.')
        } else {
          setNotice('No se ha podido iniciar sesión. Inténtalo de nuevo.')
        }
      }
    } finally {
      pending.current = false
      if (mounted.current) {
        setValues((current) => ({ ...current, password: '' }))
        setSubmitting(false)
      }
    }
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
            className="text-ink underline decoration-felt decoration-1 underline-offset-4 transition-colors duration-200 hover:text-felt"
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
            className="border-l-2 border-ink bg-paper-deep/60 px-4 py-3 text-[13px] leading-6 text-ink"
          >
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting || status === 'loading'}
          className="w-full bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt disabled:cursor-not-allowed disabled:bg-ink-mute"
        >
          {submitting ? 'Comprobando…' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  )
}
