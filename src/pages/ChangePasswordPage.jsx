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
      toast.success('Password updated successfully')
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Security" description="Update your account password using the secure backend endpoint already connected to this page." />
      <div className="max-w-3xl soft-card p-6 md:p-7">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            ['oldPassword', 'Current password'],
            ['newPassword', 'New password'],
            ['confirmPassword', 'Confirm new password'],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
              <input className="soft-input" type="password" value={form[field]} onChange={(e) => updateField(field, e.target.value)} required />
            </div>
          ))}
          <button className="soft-button-primary" disabled={loading}>
            {loading ? 'Updating password...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
