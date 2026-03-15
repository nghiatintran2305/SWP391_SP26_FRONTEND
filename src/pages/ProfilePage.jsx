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
      setError(err?.response?.data?.message || 'Không load được profile')
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
      toast.success('Update profile xong')
      loadProfile()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update fail')
    }
  }

  const onDelete = async () => {
    const ok = window.confirm('Xóa soft account này nha?')
    if (!ok) return
    try {
      await deleteMeApi()
      storage.clear()
      toast.success('Account đã bị soft delete')
      window.location.href = '/'
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete fail')
    }
  }

  return (
    <div>
      <PageHeader title="Profile" description="Xem và sửa thông tin account của chính bạn." />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading...</p>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              {[
                ['Username', profile?.username || '-'],
                ['Role', profile?.role || '-'],
                ['Email', profile?.email || '-'],
                ['Status', profile?.isActive ? 'Active' : 'Inactive'],
                ['Created', profile?.createdAt || '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-900 break-all">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Edit account</h2>
          {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSave}>
            {['email', 'fullName', 'phone'].map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium capitalize text-slate-700">{field}</label>
                <input className="soft-input" value={form[field]} onChange={(e) => updateField(field, e.target.value)} type={field === 'email' ? 'email' : 'text'} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
              <input className="soft-input" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
              <button className="soft-button-primary flex-1">Save changes</button>
              <button type="button" onClick={onDelete} className="soft-button flex-1 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100">Delete account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}