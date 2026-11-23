import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api/auth.js'
import AuthShell from '../components/AuthShell.jsx'
import FormField from '../components/FormField.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9]{9}$/

const initialValues = {
  name: '',
  surnames: '',
  birthDate: '',
  email: '',
  phone: '',
  nationality: '',
  password: '',
}

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Escribe tu nombre (mínimo 2 caracteres).'
  }

  if (values.surnames.trim().length < 2) {
    errors.surnames = 'Escribe tus apellidos (mínimo 2 caracteres).'
  }

  if (!values.birthDate) {
    errors.birthDate = 'Indica tu fecha de nacimiento.'
  } else {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(values.birthDate)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const hundredYearsAgo = new Date(today)
    hundredYearsAgo.setFullYear(today.getFullYear() - 100)
    const [year, month, day] = match ? match.slice(1).map(Number) : [0, 0, 0]
    const birthDate = new Date(0)
    birthDate.setHours(0, 0, 0, 0)
    birthDate.setFullYear(year, month - 1, day)

    if (!match || birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day ||
        birthDate > today || birthDate < hundredYearsAgo) {
      errors.birthDate = 'La fecha de nacimiento no es válida.'
    }
  }

  if (!values.email.trim()) {
    errors.email = 'Escribe tu correo electrónico.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'El correo no tiene un formato válido.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Escribe tu teléfono.'
  } else if (!phonePattern.test(values.phone.trim())) {
    errors.phone = 'El teléfono debe tener 9 dígitos.'
  }

  if (values.nationality.trim().length < 2) {
    errors.nationality = 'Indica tu nacionalidad.'
  }

  if (values.password.length < 12) {
    errors.password = 'La contraseña debe tener al menos 12 caracteres.'
  }

  return errors
}

export default function Register() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const submittingRef = useRef(false)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setNotice('')
    setSuccess(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submittingRef.current) return

    const snapshot = { ...values }
    const nextErrors = validate(snapshot)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setNotice('Revisa los campos indicados antes de continuar.')
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    setNotice('Creando cuenta…')
    try {
      await register(snapshot)
      if (!mountedRef.current) return
      setValues(initialValues)
      setSuccess(true)
      setNotice('Cuenta creada. Ya puedes iniciar sesión.')
    } catch (error) {
      if (!mountedRef.current) return
      setNotice([400, 401, 403, 409, 422].includes(error.status)
        ? 'No se ha podido crear la cuenta con esos datos. Revisa el formulario e inténtalo de nuevo.'
        : 'No se ha podido completar el registro. Inténtalo de nuevo.')
    } finally {
      submittingRef.current = false
      if (mountedRef.current) {
        setValues((current) => ({ ...current, password: '' }))
        setSubmitting(false)
      }
    }
  }

  return (
    <AuthShell
      title="Crear cuenta"
      description="Rellena tus datos para preparar tu cuenta de Klavier."
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-ink underline decoration-felt decoration-1 underline-offset-4 transition-colors duration-200 hover:text-felt"
          >
            Iniciar sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="name"
            label="Nombre"
            value={values.name}
            onChange={handleChange}
            autoComplete="given-name"
            error={errors.name}
            required
          />

          <FormField
            id="surnames"
            label="Apellidos"
            value={values.surnames}
            onChange={handleChange}
            autoComplete="family-name"
            error={errors.surnames}
            required
          />
        </div>

        <FormField
          id="birthDate"
          label="Fecha de nacimiento"
          type="date"
          value={values.birthDate}
          onChange={handleChange}
          autoComplete="bday"
          error={errors.birthDate}
          required
        />

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

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="phone"
            label="Teléfono"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            autoComplete="tel"
            hint="9 dígitos, sin espacios."
            error={errors.phone}
            required
          />

          <FormField
            id="nationality"
            label="Nacionalidad"
            value={values.nationality}
            onChange={handleChange}
            autoComplete="country-name"
            error={errors.nationality}
            required
          />
        </div>

        <FormField
          id="password"
          label="Contraseña"
          type="password"
          value={values.password}
          onChange={handleChange}
          autoComplete="new-password"
          hint="Mínimo 12 caracteres."
          error={errors.password}
          required
        />

        <p
          role="status"
          className={notice ? 'border-l-2 border-ink bg-paper-deep/60 px-4 py-3 text-[13px] leading-6 text-ink' : ''}
        >
          {notice}
          {success ? (
            <> <Link to="/login" className="underline decoration-felt decoration-1 underline-offset-4">Iniciar sesión</Link></>
          ) : null}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt disabled:cursor-not-allowed disabled:bg-ink-mute"
        >
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthShell>
  )
}
