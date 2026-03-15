import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import { getMyTaskStatsApi, getMyTasksApi, updateTaskStatusApi } from '../services/api'

const taskStatusOptions = ['TODO', 'IN_PROGRESS', 'DONE']

const toLocalDateTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('vi-VN')
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [taskData, statsData] = await Promise.allSettled([getMyTasksApi(), getMyTaskStatsApi()])
      setTasks(taskData.status === 'fulfilled' ? taskData.value : [])
      setStats(statsData.status === 'fulfilled' ? statsData.value : null)
    } catch {
      toast.error('Không tải được task của bạn')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (taskId, status) => {
    try {
      await updateTaskStatusApi(taskId, status)
      toast.success('Đã cập nhật trạng thái task')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật trạng thái thất bại')
    }
  }

  return (
    <div>
      <PageHeader title="My tasks" description="Dùng /api/v1/users/me/tasks và /api/v1/users/me/stats/tasks đúng với BE." />

      {stats ? (
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="soft-card p-5">
              <div className="text-sm capitalize text-slate-500">{key}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{String(value)}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {['Task', 'Project', 'Priority', 'Status', 'Due date', 'Assignee'].map((label) => (
                  <th key={label} className="px-4 py-3 text-left font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6" colSpan={6}>Loading...</td></tr>
              ) : tasks.length ? (
                tasks.map((task) => (
                  <tr key={task.id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{task.taskName}</div>
                      <div className="mt-1 text-xs text-slate-500">{task.description || 'No description'}</div>
                    </td>
                    <td className="px-4 py-3">{task.projectName || '-'}</td>
                    <td className="px-4 py-3">{task.priority || '-'}</td>
                    <td className="px-4 py-3">
                      <select className="soft-input min-w-36" value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)}>
                        {taskStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">{toLocalDateTime(task.dueDate)}</td>
                    <td className="px-4 py-3">{task.assignedToName || task.assignedToUsername || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-4 py-6 text-slate-500" colSpan={6}>Bạn chưa có task nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
