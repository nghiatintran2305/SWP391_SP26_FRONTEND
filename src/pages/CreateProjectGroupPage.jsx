import { useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import { createProjectGroupApi } from '../services/api'

export default function CreateProjectGroupPage() {
  const [form, setForm] = useState({ groupName: '', jiraGroupName: '', GithubTeamName: '' })
  const [created, setCreated] = useState(null)

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await createProjectGroupApi(form)
      setCreated(data)
      toast.success('Tạo project group xong')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Create group fail')
    }
  }

  return (
    <div>
      <PageHeader title="Create project group" description="Bản BE hiện tại chỉ có endpoint create group nên màn này tập trung đúng flow đó." />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="soft-card p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {['groupName', 'jiraGroupName', 'GithubTeamName'].map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{field}</label>
                <input className="soft-input" value={form[field]} onChange={(e) => updateField(field, e.target.value)} required={field === 'groupName'} />
              </div>
            ))}
            <button className="soft-button-primary w-full">Create group</button>
          </form>
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Latest response</h2>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <pre className="m-0 whitespace-pre-wrap break-all font-sans">
              {created ? JSON.stringify(created, null, 2) : 'Tạo group xong thì response sẽ hiện ở đây. Nhớ copy id để qua màn Group members add member.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}