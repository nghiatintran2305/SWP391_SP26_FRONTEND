// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginApi } from '../services/api'
import { parseRoles } from '../utils/auth'
import { storage } from '../utils/storage'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    password: '',
    loginType: storage.getLoginMode(),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginApi(form)
      const roles = parseRoles(data?.roles)
      storage.setToken(data?.token)
      storage.setRoles(roles)
      storage.setLoginMode(form.loginType)
      toast.success('Login okela')
      navigate('/overview', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Đăng nhập fail')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <LockKeyhole className="h-6 w-6 text-slate-700" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">SWP391 System</h1>
          <p className="mt-1 text-slate-600">Login bằng giao diện style cũ, map lại theo BE mới</p>
        </div>

        <div className="soft-card p-6">
          <div className="mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
            {['USER', 'ADMIN'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateField('loginType', mode)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${form.loginType === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
              <input className="soft-input" value={form.username} onChange={(e) => updateField('username', e.target.value)} placeholder="Nhập username" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input className="soft-input" type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Nhập password" required />
            </div>

            <button className="soft-button-primary w-full gap-2" disabled={loading}>
              <UserRound className="h-4 w-4" /> {loading ? 'Đang login...' : `Login as ${form.loginType}`}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Student chưa có tài khoản?{' '}
            <Link to="/register-student" className="font-semibold text-slate-900 hover:underline">
              Register ở đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}