import { useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import { changePasswordApi } from '../services/api'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await changePasswordApi(form)
      toast.success('Đổi mật khẩu xong')
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đổi mật khẩu fail')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Change password" description="Map đúng endpoint PUT /api/v1/accounts/me/change-password" />
      <div className="max-w-2xl soft-card p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className="mb-2 block text-sm font-medium text-slate-700">{field}</label>
              <input className="soft-input" type="password" value={form[field]} onChange={(e) => updateField(field, e.target.value)} required />
            </div>
          ))}
          <button className="soft-button-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}