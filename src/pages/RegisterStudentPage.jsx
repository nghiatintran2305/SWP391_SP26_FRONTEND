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
      toast.success('Tạo student thành công')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Tạo tài khoản fail')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Student Registration</h1>
          <p className="mt-1 text-slate-600">Form này đang bám đúng endpoint /api/v1/accounts/register/student</p>
        </div>

        <div className="soft-card p-6">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            {error ? <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

            {['username', 'email', 'password', 'fullName', 'phone'].map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium capitalize text-slate-700">{field}</label>
                <input
                  className="soft-input"
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
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
                {loading ? 'Đang tạo...' : 'Create student'}
              </button>
              <Link to="/" className="soft-button-secondary flex-1 text-center">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}