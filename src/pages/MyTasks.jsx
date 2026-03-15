import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { getMyTaskStatsApi, getMyTasksApi, updateTaskStatusApi } from '../services/api'

const statuses = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([getMyTasksApi(), getMyTaskStatsApi()])
      setTasks(Array.isArray(tasksRes) ? tasksRes : [])
      setStats(statsRes)
      setError('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load tasks')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (taskId, status) => {
    try {
      await updateTaskStatusApi(taskId, status)
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update task status')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My tasks" description="Review your assigned tasks, track completion, and update task statuses in place." />
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={stats?.totalAssignedTasks ?? 0} hint="All tasks assigned to you" />
        <StatCard label="Completed" value={stats?.completedTasks ?? 0} hint="Finished work" />
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length ? tasks.map((task) => {
                const taskStatuses = statuses.includes(task.status)
                  ? statuses
                  : [task.status, ...statuses.filter((s) => s !== task.status)]

                return (
                  <tr key={task.id}>
                    <td>{task.taskName}</td>
                    <td>{task.projectName}</td>
                    <td>{task.priority}</td>
                    <td>
                      <select
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                      >
                        {taskStatuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{task.dueDate || '-'}</td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={5}>No tasks assigned.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
