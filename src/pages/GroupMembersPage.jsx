import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  addProjectMemberApi,
  getAllProjectsApi,
  getLinkedStudentsApi,
  getProjectMembersApi,
  removeProjectMemberApi,
} from '../services/api'

export default function GroupMembersPage() {
  const [projects, setProjects] = useState([])
  const [students, setStudents] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ accountId: '', role: 'MEMBER' })

  const loadBase = async () => {
    try {
      const [projectsRes, studentsRes] = await Promise.all([getAllProjectsApi(), getLinkedStudentsApi()])
      const projectList = Array.isArray(projectsRes) ? projectsRes : []
      setProjects(projectList)
      setStudents(Array.isArray(studentsRes) ? studentsRes : [])
      if (!selectedProjectId && projectList[0]?.id) setSelectedProjectId(projectList[0].id)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to load base data')
    }
  }

  const loadMembers = async (projectId) => {
    if (!projectId) return setMembers([])
    try {
      const data = await getProjectMembersApi(projectId)
      setMembers(Array.isArray(data) ? data : [])
    } catch (err) {
      setMembers([])
      toast.error(err?.response?.data?.message || 'Unable to load project members')
    }
  }

  useEffect(() => { loadBase() }, [])
  useEffect(() => { loadMembers(selectedProjectId) }, [selectedProjectId])

  const addMember = async (e) => {
    e.preventDefault()
    try {
      await addProjectMemberApi(selectedProjectId, form)
      setForm({ accountId: '', role: 'MEMBER' })
      await loadMembers(selectedProjectId)
      toast.success('Member added successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to add member')
    }
  }

  const removeMember = async (accountId) => {
    try {
      await removeProjectMemberApi(selectedProjectId, accountId)
      await loadMembers(selectedProjectId)
      toast.success('Member removed successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to remove member')
    }
  }

  return (
    <div>
      <PageHeader title="Project members" description="Select a project, review the current roster, and manage linked student membership with live backend data." />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="soft-card p-6 md:p-7">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Project</label>
            <select className="soft-select" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
              <option value="">Select a project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
            </select>
          </div>

          <form className="mt-6 space-y-4" onSubmit={addMember}>
            <h2 className="section-title">Add member</h2>
            <select className="soft-select" value={form.accountId} onChange={(e) => setForm((prev) => ({ ...prev, accountId: e.target.value }))} required>
              <option value="">Select a linked student</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.fullName || student.username} - GH:{student.githubLinked ? 'Y' : 'N'} / Jira:{student.jiraLinked ? 'Y' : 'N'}</option>)}
            </select>
            <select className="soft-select" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="LEADER">LEADER</option>
              <option value="MEMBER">MEMBER</option>
              <option value="LECTURER">LECTURER</option>
            </select>
            <button className="soft-button-primary w-full" disabled={!selectedProjectId}>Add member</button>
          </form>
        </div>

        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length ? members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.username}</td>
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                    <td>{String(member.active ?? member.isActive ?? '')}</td>
                    <td><button onClick={() => removeMember(member.id)} className="soft-button-danger px-3 py-2 text-xs">Remove</button></td>
                  </tr>
                )) : (
                  <tr><td colSpan={5}>No members found for the selected project.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
