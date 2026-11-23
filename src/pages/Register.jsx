import { useState } from 'react'
import { Link } from 'react-router-dom'
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
    const birthDate = new Date(values.birthDate)
    const now = new Date()
    const hundredYearsAgo = new Date()
    hundredYearsAgo.setFullYear(now.getFullYear() - 100)

    if (birthDate > now || birthDate < hundredYearsAgo) {
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
        'Formulario correcto. El registro real estará disponible en la siguiente sesión.',
      )
    }, 600)
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
          disabled={submitting}
          className="w-full bg-ink px-6 py-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-felt disabled:cursor-not-allowed disabled:bg-ink-mute"
        >
          {submitting ? 'Comprobando…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthShell>
  )
}
