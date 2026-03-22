
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  createProjectApi,
  deleteProjectApi,
  getAllProjectsApi,
  getLecturersApi,
  getMyGroupsApi,
  getMyProjectsApi,
  updateProjectStatusApi,
} from '../services/api'
import { getCurrentRoles, isAdmin } from '../utils/auth'

const statusOptions = ['CONFIGURED', 'ACTIVE', 'LOCKED', 'COMPLETED']
const emptyForm = { projectName: '', lecturerAccountId: '' }

export default function ProjectsPage() {
  const roles = getCurrentRoles()
  const admin = isAdmin()
  const canCreate = admin
  const [projects, setProjects] = useState([])
  const [lecturers, setLecturers] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = admin ? await getAllProjectsApi() : roles.includes('STUDENT') ? await getMyGroupsApi() : await getMyProjectsApi()
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không tải được project')
    } finally {
      setLoading(false)
    }
  }

  const loadLecturers = async () => {
    if (!admin) return
    try {
      const data = await getLecturersApi('')
      setLecturers(Array.isArray(data) ? data : [])
    } catch {
      setLecturers([])
    }
  }

  useEffect(() => {
    load()
    loadLecturers()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return projects
    return projects.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
  }, [projects, search])

  const createProject = async (e) => {
    e.preventDefault()
    try {
      await createProjectApi(form)
      toast.success('Tạo project thành công')
      setForm(emptyForm)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Tạo project thất bại')
    }
  }

  const updateStatus = async (projectId, status) => {
    try {
      await updateProjectStatusApi(projectId, status)
      toast.success('Cập nhật trạng thái thành công')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật trạng thái thất bại')
    }
  }

  const removeProject = async (projectId) => {
    if (!window.confirm('Xóa project này?')) return
    try {
      await deleteProjectApi(projectId)
      toast.success('Đã xóa project')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa project thất bại')
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Đồng bộ với BE: admin xem toàn bộ, lecturer/admin xem my-projects, student xem my-groups."
        action={<input className="soft-input w-full md:w-72" placeholder="Tìm project..." value={search} onChange={(e) => setSearch(e.target.value)} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="soft-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {['Project', 'Jira key', 'GitHub repo', 'Status', 'Actions'].map((label) => (
                    <th key={label} className="px-4 py-3 text-left font-semibold">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6" colSpan={5}>Loading...</td></tr>
                ) : filtered.length ? (
                  filtered.map((project) => (
                    <tr key={project.id} className="border-t border-slate-200 align-top">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{project.projectName || '-'}</div>
                        <div className="mt-1 text-xs text-slate-500 break-all">{project.id}</div>
                      </td>
                      <td className="px-4 py-3">{project.jiraProjectKey || '-'}</td>
                      <td className="px-4 py-3 break-all">{project.githubRepoName || '-'}</td>
                      <td className="px-4 py-3">
                        {admin ? (
                          <select className="soft-input min-w-36" value={project.status || ''} onChange={(e) => updateStatus(project.id, e.target.value)}>
                            {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                        ) : (project.status || '-')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/projects/${project.id}`} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Open</Link>
                          {admin ? <button onClick={() => removeProject(project.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button> : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="px-4 py-6 text-slate-500" colSpan={5}>Không có project</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Create project</h2>
          <p className="mt-1 text-sm text-slate-600">POST /api/v1/projects</p>
          {canCreate ? (
            <form className="mt-4 space-y-4" onSubmit={createProject}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Project name</label>
                <input className="soft-input" value={form.projectName} onChange={(e) => setForm((prev) => ({ ...prev, projectName: e.target.value }))} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Lecturer</label>
                <select className="soft-input" value={form.lecturerAccountId} onChange={(e) => setForm((prev) => ({ ...prev, lecturerAccountId: e.target.value }))} required>
                  <option value="">Chọn lecturer</option>
                  {lecturers.map((lecturer) => <option key={lecturer.id} value={lecturer.id}>{lecturer.fullName || lecturer.username} - {lecturer.email}</option>)}
                </select>
              </div>
              <button className="soft-button-primary w-full">Create project</button>
            </form>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Tài khoản hiện tại không có quyền tạo project. Bạn vẫn có thể mở workspace để xem member, task, Jira và GitHub theo API BE.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
