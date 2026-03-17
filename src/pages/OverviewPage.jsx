import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { getMeApi, getMyLinkStatusApi, getMyTaskStatsApi, getMyWorkspaceProjectsApi } from '../services/api'
import { getCurrentRoles, isAdmin } from '../utils/auth'

export default function OverviewPage() {
  const [me, setMe] = useState(null)
  const [linkStatus, setLinkStatus] = useState(null)
  const [myGroups, setMyGroups] = useState([])
  const [taskStats, setTaskStats] = useState(null)

  useEffect(() => {
    getMeApi().then(setMe).catch(() => null)
    getMyLinkStatusApi().then(setLinkStatus).catch(() => setLinkStatus(null))
    getMyWorkspaceProjectsApi().then((data) => setMyGroups(Array.isArray(data) ? data : [])).catch(() => setMyGroups([]))
    getMyTaskStatsApi().then(setTaskStats).catch(() => setTaskStats(null))
  }, [])

  const roles = getCurrentRoles()

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Quick access to your account profile, current integration status, assigned work, and project activity."
      />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <StatCard label="Username" value={me?.username || '...'} hint="Signed-in account" />
        <StatCard label="Role" value={roles.join(', ') || 'N/A'} hint={isAdmin() ? 'Admin workspace enabled' : 'Standard user workspace'} />
        <StatCard label="GitHub" value={linkStatus?.githubLinked ? 'Linked' : 'Not linked'} hint={linkStatus?.githubUsername || 'Connect your GitHub account'} />
        <StatCard label="Jira" value={linkStatus?.jiraLinked ? 'Linked' : 'Not linked'} hint={linkStatus?.jiraAccountId || 'Connect your Jira account'} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="soft-card p-6 md:p-7">
          <h2 className="section-title">Account snapshot</h2>
          <p className="section-description">A consolidated view of your identity, account status, and personal workspace metrics.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ['Full Name', me?.fullName || '-'],
              ['Email', me?.email || '-'],
              ['Phone', me?.phone || '-'],
              ['Address', me?.address || '-'],
              ['Status', me?.active || me?.isActive ? 'Active' : 'Inactive'],
              ['Account ID', me?.id || '-'],
              ['My Groups', String(myGroups?.length || 0)],
              ['Assigned Tasks', String(taskStats?.totalAssignedTasks ?? 0)],
            ].map(([label, value]) => (
              <div key={label} className="metric-tile">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-3 break-all text-base font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="soft-card p-6 md:p-7">
            <h2 className="section-title">Integration summary</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">GitHub account</p>
                    <p className="mt-1 text-sm text-slate-500">{linkStatus?.githubUsername || 'No GitHub identity linked yet.'}</p>
                  </div>
                  <span className={`soft-badge ${linkStatus?.githubLinked ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                    {linkStatus?.githubLinked ? 'Linked' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Jira account</p>
                    <p className="mt-1 text-sm text-slate-500">{linkStatus?.jiraAccountId || 'No Jira identity linked yet.'}</p>
                  </div>
                  <span className={`soft-badge ${linkStatus?.jiraLinked ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                    {linkStatus?.jiraLinked ? 'Linked' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="soft-card p-6 md:p-7">
            <h2 className="section-title">Workload summary</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="metric-tile">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Total tasks</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{taskStats?.totalAssignedTasks ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Completed tasks</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{taskStats?.completedTasks ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
