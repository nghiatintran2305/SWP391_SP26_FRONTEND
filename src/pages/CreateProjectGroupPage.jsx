import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  createProjectApi,
  deleteProjectApi,
  getAllProjectsApi,
  getLecturersApi,
  updateProjectStatusApi,
} from '../services/api'

const initialForm = { projectName: '', lecturerAccountId: '' }
const statuses = ['PENDING', 'CONFIGURED', 'ACTIVE', 'LOCKED', 'ARCHIVED']

export default function CreateProjectGroupPage() {
  const [form, setForm] = useState(initialForm)
  const [created, setCreated] = useState(null)
  const [lecturers, setLecturers] = useState([])
  const [projects, setProjects] = useState([])

  const load = async () => {
    try {
      const [lecturersRes, projectsRes] = await Promise.all([getLecturersApi(), getAllProjectsApi()])
      setLecturers(Array.isArray(lecturersRes) ? lecturersRes : [])
      setProjects(Array.isArray(projectsRes) ? projectsRes : [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to load projects')
    }
  }

  useEffect(() => { load() }, [])

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await createProjectApi(form)
      setCreated(data)
      setForm(initialForm)
      await load()
      toast.success('Project created successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to create project')
    }
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm(`Delete project ${projectId}?`)) return
    try {
      await deleteProjectApi(projectId)
      await load()
      toast.success('Project deleted successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to delete project')
    }
  }

  const handleStatusChange = async (projectId, status) => {
    try {
      await updateProjectStatusApi(projectId, status)
      await load()
      toast.success('Project status updated successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to update project status')
    }
  }

  return (
    <div>
      <PageHeader title="Projects" description="Create projects, assign lecturers, update project lifecycle states, and remove projects from the same workspace." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="soft-card p-6 md:p-7">
          <h2 className="section-title">Create project</h2>
          <p className="section-description">Create a project using the backend contract already wired into this frontend.</p>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Project name</label>
              <input className="soft-input" value={form.projectName} onChange={(e) => updateField('projectName', e.target.value)} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Lecturer</label>
              <select className="soft-select" value={form.lecturerAccountId} onChange={(e) => updateField('lecturerAccountId', e.target.value)} required>
                <option value="">Select a lecturer</option>
                {lecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>{lecturer.fullName || lecturer.username} - {lecturer.email}</option>
                ))}
              </select>
            </div>
            <button className="soft-button-primary w-full">Create project</button>
          </form>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Latest response</div>
            <pre className="m-0 whitespace-pre-wrap break-all font-sans">{created ? JSON.stringify(created, null, 2) : 'The latest created project payload will appear here.'}</pre>
          </div>
        </div>

        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Jira key</th>
                  <th>GitHub repo</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length ? projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.projectName}</td>
                    <td>{project.jiraProjectKey || '-'}</td>
                    <td>{project.githubRepoName || '-'}</td>
                    <td>
                      <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={project.status || ''} onChange={(e) => handleStatusChange(project.id, e.target.value)}>
                        {(project.status && !statuses.includes(project.status) ? [project.status, ...statuses] : statuses).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(project.id)} className="soft-button-danger px-3 py-2 text-xs">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5}>No projects available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
