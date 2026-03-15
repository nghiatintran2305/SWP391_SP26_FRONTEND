import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { registerStudentApi } from '../services/api'

const initialForm = {
  username: '',
  password: '',
  email: '',
  fullName: '',
  phone: '',
  address: '',
}

export default function RegisterStudentPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerStudentApi(form)
      toast.success('Student account created successfully')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Registration
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Create a student account</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">Fill in the required details to register a new student profile in the system.</p>
        </div>

        <div className="soft-card p-6 md:p-8">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            {error ? <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

            {[
              ['username', 'Username', 'text'],
              ['email', 'Email', 'email'],
              ['password', 'Password', 'password'],
              ['fullName', 'Full Name', 'text'],
              ['phone', 'Phone', 'text'],
            ].map(([field, label, type]) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                <input
                  className="soft-input"
                  type={type}
                  value={form[field]}
                  onChange={(e) => updateField(field, e.target.value)}
                  required={['username', 'email', 'password'].includes(field)}
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
              <input className="soft-input" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
              <button className="soft-button-primary flex-1" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
              <Link to="/" className="soft-button-secondary flex-1 text-center">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
