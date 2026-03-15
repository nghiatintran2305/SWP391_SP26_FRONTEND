import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginApi } from '../services/api'
import { parseRoles } from '../utils/auth'
import { storage } from '../utils/storage'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginApi({ username: form.username, password: form.password })
      const roles = parseRoles(data?.roles)
      storage.setToken(data?.token)
      storage.setRoles(roles)
      const isAdmin = roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')
      storage.setLoginMode(isAdmin ? 'ADMIN' : 'USER')
      toast.success('Login successful')
      navigate('/overview', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1500px] overflow-hidden rounded-[32px] border border-white/60 bg-white/30 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur xl:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-10 text-white xl:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
              <ShieldCheck className="h-4 w-4" /> SWP391 Platform
            </div>
            <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight">Manage users, projects, tasks, and integrations in one workspace.</h1>
            <p className="mt-5 max-w-lg text-base text-slate-300">
              Clean dashboard, full account controls, GitHub and Jira linking, plus all admin tools in one consistent interface.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Accounts', 'Centralized user and role management.'],
              ['Projects', 'Track projects, members, and progress.'],
              ['Integrations', 'Connect GitHub and Jira with live status.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-2 text-sm text-slate-300">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10 xl:p-14">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <LockKeyhole className="h-6 w-6 text-slate-800" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace.</p>
            </div>

            <div className="soft-card p-6 md:p-7">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                ) : null}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
                  <input
                    className="soft-input"
                    value={form.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <input
                    className="soft-input"
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button className="soft-button-primary w-full gap-2" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                Need a student account?{' '}
                <Link to="/register-student" className="font-semibold text-slate-950 hover:underline">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
