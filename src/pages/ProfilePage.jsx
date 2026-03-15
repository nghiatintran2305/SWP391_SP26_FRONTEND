import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import { deleteMeApi, getMeApi, updateMeApi } from '../services/api'
import { storage } from '../utils/storage'

const emptyForm = { email: '', fullName: '', phone: '', address: '' }

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await getMeApi()
      setProfile(data)
      setForm({
        email: data?.email || '',
        fullName: data?.fullName || '',
        phone: data?.phone || '',
        address: data?.address || '',
      })
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const onSave = async (e) => {
    e.preventDefault()
    try {
      await updateMeApi(form)
      toast.success('Profile updated successfully')
      loadProfile()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to update profile')
    }
  }

  const onDelete = async () => {
    const ok = window.confirm('Delete this account?')
    if (!ok) return
    try {
      await deleteMeApi()
      storage.clear()
      toast.success('Account deleted successfully')
      window.location.href = '/'
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to delete account')
    }
  }

  return (
    <div>
      <PageHeader title="Profile" description="Review your account details and update your personal information from one place." />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="soft-card p-6 md:p-7">
          <h2 className="section-title">Account summary</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading profile...</p>
          ) : (
            <div className="mt-5 space-y-3 text-sm">
              {[
                ['Username', profile?.username || '-'],
                ['Role', profile?.role || '-'],
                ['Email', profile?.email || '-'],
                ['Status', profile?.isActive ? 'Active' : 'Inactive'],
                ['Created', profile?.createdAt || '-'],
              ].map(([label, value]) => (
                <div key={label} className="metric-tile flex items-start justify-between gap-4">
                  <span className="text-slate-500">{label}</span>
                  <span className="break-all text-right font-semibold text-slate-950">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="soft-card p-6 md:p-7">
          <h2 className="section-title">Edit profile</h2>
          <p className="section-description">Update the information that is stored for your current account.</p>
          {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={onSave}>
            {[
              ['email', 'Email'],
              ['fullName', 'Full Name'],
              ['phone', 'Phone'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                <input className="soft-input" value={form[field]} onChange={(e) => updateField(field, e.target.value)} type={field === 'email' ? 'email' : 'text'} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
              <input className="soft-input" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
              <button className="soft-button-primary flex-1">Save changes</button>
              <button type="button" onClick={onDelete} className="soft-button-danger flex-1">Delete account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
