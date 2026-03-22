// src/pages/AdminAccount
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  createLecturerApi,
  deleteAccountApi,
  getAllAccountsApi,      //api
  getLecturersApi,
  getLinkedStudentsApi,
  getStudentsApi,
  updateAccountApi,
} from '../services/api'
//lectureInit
const lecturerInit = {
  username: '',
  password: '',
  email: '',
  fullName: '',
  phone: '',
  address: '',
}

export default function AdminAccountsPage() {
  const [tab, setTab] = useState('all')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [lecturerForm, setLecturerForm] = useState(lecturerInit)

  const loadData = async () => {
    setLoading(true)
    try {
      let data = []
      if (tab === 'all') data = await getAllAccountsApi()
      if (tab === 'students') data = await getStudentsApi(search)
      if (tab === 'lecturers') data = await getLecturersApi(search)
      if (tab === 'linked') data = await getLinkedStudentsApi()
      setRows(Array.isArray(data) ? data : data?.content || data?.data || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Load accounts fail')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tab])

  const filteredRows = useMemo(() => {
    if (!search || tab === 'students' || tab === 'lecturers') return rows
    return rows.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    )
  }, [rows, search, tab])

  const columns = useMemo(() => {
    const sample = filteredRows?.[0]
    return sample ? Object.keys(sample) : []
  }, [filteredRows])

  const toggleActive = async (row) => {
    try {
      await updateAccountApi(row.id, {
        email: row.email || '',
        fullName: row.fullName || '',
        phone: row.phone || '',
        address: row.address || '',
        isActive: !row.isActive,
      })
      toast.success('Update account ok')
      loadData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update account fail')
    }
  }

  const handleDelete = async (id) => {
    const ok = window.confirm(`Xóa account ${id}?`)
    if (!ok) return
    try {
      await deleteAccountApi(id)
      toast.success('Delete account ok')
      loadData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete account fail')
    }
  }

  const createLecturer = async (e) => {
    e.preventDefault()
    try {
      await createLecturerApi(lecturerForm)
      toast.success('Create lecturer ok')
      setLecturerForm(lecturerInit)
      if (tab === 'lecturers') loadData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Create lecturer fail')
    }
  }

  return (
    <div>
      <PageHeader title="Admin accounts" description="Quản lý account theo các endpoint admin hiện có trong BE." />

      <div className="mb-6 soft-card p-4">
        <div className="flex flex-wrap gap-2">
          {[
            ['all', 'All'],
            ['students', 'Students'],
            ['lecturers', 'Lecturers'],
            ['linked', 'Linked students'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input className="soft-input md:max-w-sm" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={loadData} className="soft-button-secondary md:w-auto">Reload</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="soft-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 text-left font-semibold">{col}</th>
                  ))}
                  {tab !== 'linked' ? <th className="px-4 py-3 text-left font-semibold">actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6 text-slate-500" colSpan={columns.length + 1}>Loading...</td></tr>
                ) : filteredRows.length ? (
                  filteredRows.map((row, index) => (
                    <tr key={row.id || index} className="border-t border-slate-200 align-top hover:bg-slate-50/70">
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-3 text-slate-700">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '-')}
                        </td>
                      ))}
                      {tab !== 'linked' ? (
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {row.id ? <button onClick={() => toggleActive(row)} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Toggle active</button> : null}
                            {row.id ? <button onClick={() => handleDelete(row.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button> : null}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <tr><td className="px-4 py-6 text-slate-500" colSpan={columns.length + 1}>No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Create lecturer</h2>
          <p className="mt-1 text-sm text-slate-600">Form này map vào POST /api/v1/accounts/lecturers</p>
          <form className="mt-4 space-y-4" onSubmit={createLecturer}>
            {Object.keys(lecturerInit).map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium capitalize text-slate-700">{field}</label>
                <input
                  className="soft-input"
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  required={['username', 'password', 'email'].includes(field)}
                  value={lecturerForm[field]}
                  onChange={(e) => setLecturerForm((prev) => ({ ...prev, [field]: e.target.value }))}
                />
              </div>
            ))}
            <button className="soft-button-primary w-full">Create lecturer</button>
          </form>
        </div>
      </div>
    </div>
  )
}