import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  createLecturerApi,
  deleteAccountApi,
  getAllAccountsApi,
  getLecturersApi,
  getLinkedStudentsApi,
  getStudentsApi,
  updateAccountApi,
} from '../services/api'

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
      toast.error(err?.response?.data?.message || 'Unable to load accounts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tab])

  const filteredRows = useMemo(() => {
    if (!search || tab === 'students' || tab === 'lecturers') return rows
    return rows.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
  }, [rows, search, tab])

  const columns = useMemo(() => {
    const sample = filteredRows?.[0]
    return sample ? Object.keys(sample) : []
  }, [filteredRows])

  const toggleActive = async (row) => {
    try {
      await updateAccountApi(row.id, { ...row, isActive: !row.isActive })
      toast.success('Account updated successfully')
      loadData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to update account')
    }
  }

  const handleDelete = async (id) => {
    const ok = window.confirm(`Delete account ${id}?`)
    if (!ok) return
    try {
      await deleteAccountApi(id)
      toast.success('Account deleted successfully')
      loadData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to delete account')
    }
  }

  const createLecturer = async (e) => {
    e.preventDefault()
    try {
      await createLecturerApi(lecturerForm)
      toast.success('Lecturer account created successfully')
      setLecturerForm(lecturerInit)
      if (tab === 'lecturers') loadData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to create lecturer account')
    }
  }

  return (
    <div>
      <PageHeader title="Account management" description="Browse all accounts, filter by type, update activity status, or create lecturer accounts from one admin screen." />

      <div className="soft-card p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {[
            ['all', 'All accounts'],
            ['students', 'Students'],
            ['lecturers', 'Lecturers'],
            ['linked', 'Linked students'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${tab === key ? 'bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input className="soft-input md:max-w-md" placeholder="Search accounts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button onClick={loadData} className="soft-button-secondary md:w-auto">Refresh</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  {tab !== 'linked' ? <th>Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={columns.length + 1}>Loading...</td></tr>
                ) : filteredRows.length ? (
                  filteredRows.map((row) => (
                    <tr key={row.id}>
                      {columns.map((col) => (
                        <td key={`${row.id}-${col}`}>{typeof row[col] === 'object' && row[col] !== null ? JSON.stringify(row[col]) : String(row[col] ?? '')}</td>
                      ))}
                      {tab !== 'linked' ? (
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => toggleActive(row)} className="soft-button-secondary px-3 py-2 text-xs">
                              {row.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDelete(row.id)} className="soft-button-danger px-3 py-2 text-xs">
                              Delete
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={columns.length + 1}>No data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="soft-card p-6 md:p-7">
          <h2 className="section-title">Create lecturer</h2>
          <p className="section-description">Register a lecturer account using the existing backend endpoint.</p>
          <form className="mt-5 space-y-4" onSubmit={createLecturer}>
            {[
              ['username', 'Username'],
              ['password', 'Password'],
              ['email', 'Email'],
              ['fullName', 'Full Name'],
              ['phone', 'Phone'],
              ['address', 'Address'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                <input
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  className="soft-input"
                  value={lecturerForm[field]}
                  onChange={(e) => setLecturerForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  required={['username', 'password', 'email'].includes(field)}
                />
              </div>
            ))}
            <button className="soft-button-primary w-full">Create lecturer account</button>
          </form>
        </div>
      </div>
    </div>
  )
}
