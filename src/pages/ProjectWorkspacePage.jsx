import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  addProjectMemberApi,
  assignTaskApi,
  createIssueApi,
  createTaskApi,
  deleteIssueApi,
  deleteTaskApi,
  getAllTeamCommitsApi,
  getLinkedStudentsApi,
  getProjectByIdApi,
  getProjectIssuesApi,
  getProjectMembersApi,
  getProjectProgressApi,
  getTasksByProjectApi,
  getTeamCommitSummaryApi,
  removeProjectMemberApi,
  updateIssueStatusApi,
  updateTaskStatusApi,
} from '../services/api'
import { getCurrentRoles } from '../utils/auth'

const taskStatusOptions = ['TODO', 'IN_PROGRESS', 'DONE']
const taskPriorityOptions = ['LOWEST', 'LOW', 'HIGH', 'HIGHEST']
const projectRoleOptions = ['LEADER', 'MEMBER']

const emptyMemberForm = { accountId: '', role: 'MEMBER' }
const emptyTaskForm = { taskName: '', description: '', status: 'TODO', priority: 'LOW', assignedToId: '', dueDate: '', isRequirement: false }
const emptyIssueForm = { summary: '', description: '', issueType: 'Task', priority: 'Medium', assigneeAccountId: '' }

const toLocalDateTime = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('vi-VN')
}

const toApiDateTime = (value) => (value ? `${value}:00` : null)

export default function ProjectWorkspacePage() {
  const { projectId } = useParams()
  const roles = getCurrentRoles()
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [issues, setIssues] = useState([])
  const [progress, setProgress] = useState(null)
  const [commitSummary, setCommitSummary] = useState([])
  const [linkedStudents, setLinkedStudents] = useState([])
  const [memberForm, setMemberForm] = useState(emptyMemberForm)
  const [taskForm, setTaskForm] = useState(emptyTaskForm)
  const [issueForm, setIssueForm] = useState(emptyIssueForm)
  const [loading, setLoading] = useState(false)

  const canManageMembers = roles.some((role) => ['ADMIN', 'LECTURER'].includes(role))
  const canManageTasks = roles.some((role) => ['ADMIN', 'LECTURER', 'LEADER'].includes(role))

  const load = async () => {
    setLoading(true)
    try {
      const projectData = await getProjectByIdApi(projectId)
      setProject(projectData)

      const [memberRes, taskRes, progressRes] = await Promise.allSettled([
        getProjectMembersApi(projectId),
        getTasksByProjectApi(projectId),
        getProjectProgressApi(projectId),
      ])

      setMembers(memberRes.status === 'fulfilled' ? memberRes.value : [])
      setTasks(taskRes.status === 'fulfilled' ? taskRes.value : [])
      setProgress(progressRes.status === 'fulfilled' ? progressRes.value : null)

      if (canManageMembers) {
        const linked = await getLinkedStudentsApi().catch(() => [])
        setLinkedStudents(Array.isArray(linked) ? linked : [])
      }

      if (projectData?.jiraProjectKey) {
        const jiraData = await getProjectIssuesApi(projectData.jiraProjectKey).catch(() => [])
        setIssues(Array.isArray(jiraData) ? jiraData : [])
      } else {
        setIssues([])
      }

      if (projectData?.githubRepoName) {
        const commitData = await getTeamCommitSummaryApi(projectId, projectData.githubRepoName).catch(async () => {
          const fallback = await getAllTeamCommitsApi(projectId, projectData.githubRepoName).catch(() => [])
          return fallback
        })
        setCommitSummary(Array.isArray(commitData) ? commitData : [])
      } else {
        setCommitSummary([])
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không tải được workspace project')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [projectId])

  const availableStudents = useMemo(
    () => linkedStudents.filter((student) => !members.some((member) => member.id === student.id)),
    [linkedStudents, members]
  )

  const addMember = async (e) => {
    e.preventDefault()
    try {
      await addProjectMemberApi(projectId, memberForm)
      toast.success('Đã thêm member')
      setMemberForm(emptyMemberForm)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Thêm member thất bại')
    }
  }

  const removeMember = async (accountId) => {
    if (!window.confirm('Xóa member khỏi project?')) return
    try {
      await removeProjectMemberApi(projectId, accountId)
      toast.success('Đã xóa member')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa member thất bại')
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    try {
      await createTaskApi(projectId, {
        ...taskForm,
        dueDate: toApiDateTime(taskForm.dueDate),
      })
      toast.success('Tạo task thành công')
      setTaskForm(emptyTaskForm)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Tạo task thất bại')
    }
  }

  const assignTask = async (taskId, userId) => {
    if (!userId) return
    try {
      await assignTaskApi(taskId, userId)
      toast.success('Assign task thành công')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Assign task thất bại')
    }
  }

  const updateTaskStatus = async (taskId, status) => {
    try {
      await updateTaskStatusApi(taskId, status)
      toast.success('Cập nhật trạng thái task thành công')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật trạng thái task thất bại')
    }
  }

  const removeTask = async (taskId) => {
    if (!window.confirm('Xóa task này?')) return
    try {
      await deleteTaskApi(taskId)
      toast.success('Đã xóa task')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa task thất bại')
    }
  }

  const createIssue = async (e) => {
    e.preventDefault()
    if (!project?.jiraProjectKey) {
      toast.error('Project chưa có jiraProjectKey')
      return
    }
    try {
      await createIssueApi(project.jiraProjectKey, issueForm)
      toast.success('Tạo Jira issue thành công')
      setIssueForm(emptyIssueForm)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Tạo Jira issue thất bại')
    }
  }

  const updateIssueStatus = async (issueKey, status) => {
    try {
      await updateIssueStatusApi(issueKey, status)
      toast.success('Cập nhật trạng thái Jira issue thành công')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật trạng thái Jira issue thất bại')
    }
  }

  const removeIssue = async (issueKey) => {
    if (!project?.jiraProjectKey || !window.confirm('Xóa issue này?')) return
    try {
      await deleteIssueApi(project.jiraProjectKey, issueKey)
      toast.success('Đã xóa issue')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa issue thất bại')
    }
  }

  return (
    <div>
      <PageHeader title={project?.projectName || 'Project workspace'} description="FE map theo API member, task, Jira issue và GitHub commit summary từ BE." />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="soft-card p-5"><div className="text-sm text-slate-500">Project ID</div><div className="mt-2 break-all font-semibold">{project?.id || '-'}</div></div>
        <div className="soft-card p-5"><div className="text-sm text-slate-500">Status</div><div className="mt-2 font-semibold">{project?.status || '-'}</div></div>
        <div className="soft-card p-5"><div className="text-sm text-slate-500">Jira key</div><div className="mt-2 font-semibold">{project?.jiraProjectKey || '-'}</div></div>
        <div className="soft-card p-5"><div className="text-sm text-slate-500">GitHub repo</div><div className="mt-2 break-all font-semibold">{project?.githubRepoName || '-'}</div></div>
      </div>

      {progress ? (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {Object.entries(progress).map(([key, value]) => (
            <div key={key} className="soft-card p-5">
              <div className="text-sm capitalize text-slate-500">{key}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{String(value)}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="soft-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Members</h2>
            {loading ? <span className="text-sm text-slate-400">Loading...</span> : null}
          </div>
          <div className="mt-4 space-y-3">
            {members.map((member) => (
              <div key={member.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{member.fullName || member.username}</div>
                    <div className="mt-1 text-sm text-slate-500">{member.email || '-'} • {member.role || '-'}</div>
                  </div>
                  {canManageMembers ? <button onClick={() => removeMember(member.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Remove</button> : null}
                </div>
              </div>
            ))}
            {!members.length ? <div className="text-sm text-slate-500">Chưa có member nào.</div> : null}
          </div>

          {canManageMembers ? (
            <form className="mt-5 space-y-4" onSubmit={addMember}>
              <select className="soft-input" value={memberForm.accountId} onChange={(e) => setMemberForm((prev) => ({ ...prev, accountId: e.target.value }))} required>
                <option value="">Chọn linked student</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>{student.fullName || student.username} - GitHub:{student.githubLinked ? 'Y' : 'N'} Jira:{student.jiraLinked ? 'Y' : 'N'}</option>
                ))}
              </select>
              <select className="soft-input" value={memberForm.role} onChange={(e) => setMemberForm((prev) => ({ ...prev, role: e.target.value }))}>
                {projectRoleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <button className="soft-button-primary w-full">Add member</button>
            </form>
          ) : null}
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{task.taskName}</div>
                    <div className="mt-1 text-sm text-slate-500">{task.description || 'No description'}</div>
                    <div className="mt-2 text-xs text-slate-500">Assigned: {task.assignedToName || task.assignedToUsername || '-'} • Due: {toLocalDateTime(task.dueDate) || '-'}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select className="soft-input min-w-36" value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)}>
                      {taskStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    {canManageTasks ? <button onClick={() => removeTask(task.id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button> : null}
                  </div>
                </div>
                {canManageTasks ? (
                  <div className="mt-3">
                    <select className="soft-input" value={task.assignedToId || ''} onChange={(e) => assignTask(task.id, e.target.value)}>
                      <option value="">Assign to member</option>
                      {members.map((member) => <option key={member.id} value={member.id}>{member.fullName || member.username}</option>)}
                    </select>
                  </div>
                ) : null}
              </div>
            ))}
            {!tasks.length ? <div className="text-sm text-slate-500">Chưa có task nào.</div> : null}
          </div>

          {canManageTasks ? (
            <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={createTask}>
              <input className="soft-input" placeholder="Task name" value={taskForm.taskName} onChange={(e) => setTaskForm((prev) => ({ ...prev, taskName: e.target.value }))} required />
              <input className="soft-input" type="datetime-local" value={taskForm.dueDate} onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
              <textarea className="soft-input md:col-span-2 min-h-24" placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))} />
              <select className="soft-input" value={taskForm.status} onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))}>{taskStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <select className="soft-input" value={taskForm.priority} onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}>{taskPriorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
              <select className="soft-input" value={taskForm.assignedToId} onChange={(e) => setTaskForm((prev) => ({ ...prev, assignedToId: e.target.value }))}>
                <option value="">Assign later</option>
                {members.map((member) => <option key={member.id} value={member.id}>{member.fullName || member.username}</option>)}
              </select>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={taskForm.isRequirement} onChange={(e) => setTaskForm((prev) => ({ ...prev, isRequirement: e.target.checked }))} />
                Requirement task
              </label>
              <button className="soft-button-primary md:col-span-2">Create task</button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Jira issues</h2>
          <div className="mt-4 space-y-3">
            {issues.map((issue) => (
              <div key={issue.id || issue.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{issue.key} - {issue.summary}</div>
                    <div className="mt-1 text-sm text-slate-500">{issue.issueType || '-'} • {issue.priority || '-'} • {issue.assigneeDisplayName || 'Unassigned'}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select className="soft-input min-w-36" value={issue.status || 'TODO'} onChange={(e) => updateIssueStatus(issue.key, e.target.value)}>
                      {taskStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    {canManageTasks ? <button onClick={() => removeIssue(issue.key)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button> : null}
                  </div>
                </div>
              </div>
            ))}
            {!issues.length ? <div className="text-sm text-slate-500">Chưa có Jira issue hoặc project chưa cấu hình Jira.</div> : null}
          </div>

          {canManageTasks ? (
            <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={createIssue}>
              <input className="soft-input md:col-span-2" placeholder="Summary" value={issueForm.summary} onChange={(e) => setIssueForm((prev) => ({ ...prev, summary: e.target.value }))} required />
              <textarea className="soft-input md:col-span-2 min-h-24" placeholder="Description" value={issueForm.description} onChange={(e) => setIssueForm((prev) => ({ ...prev, description: e.target.value }))} />
              <input className="soft-input" placeholder="Issue type" value={issueForm.issueType} onChange={(e) => setIssueForm((prev) => ({ ...prev, issueType: e.target.value }))} />
              <input className="soft-input" placeholder="Priority" value={issueForm.priority} onChange={(e) => setIssueForm((prev) => ({ ...prev, priority: e.target.value }))} />
              <input className="soft-input md:col-span-2" placeholder="Assignee account id (Jira)" value={issueForm.assigneeAccountId} onChange={(e) => setIssueForm((prev) => ({ ...prev, assigneeAccountId: e.target.value }))} />
              <button className="soft-button-primary md:col-span-2">Create issue</button>
            </form>
          ) : null}
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">GitHub commits</h2>
          <div className="mt-4 space-y-3">
            {commitSummary.map((item, index) => (
              <div key={item.username || item.authorName || item.githubUsername || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">{item.username || item.authorName || item.githubUsername || 'Unknown user'}</div>
                <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-600 font-sans">{JSON.stringify(item, null, 2)}</pre>
              </div>
            ))}
            {!commitSummary.length ? <div className="text-sm text-slate-500">Chưa có commit summary hoặc project chưa cấu hình GitHub repo.</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
