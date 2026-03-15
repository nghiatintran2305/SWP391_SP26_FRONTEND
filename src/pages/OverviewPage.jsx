import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { getGithubMeApi, getJiraLinkApi, getMeApi } from '../services/api'
import { getCurrentRoles, isAdmin } from '../utils/auth'

export default function OverviewPage() {
  const [me, setMe] = useState(null)
  const [github, setGithub] = useState(null)
  const [jira, setJira] = useState(null)

  useEffect(() => {
    getMeApi().then(setMe).catch(() => null)
    getGithubMeApi().then(setGithub).catch(() => setGithub(null))
    getJiraLinkApi().then(setJira).catch(() => setJira(null))
  }, [])

  const roles = getCurrentRoles()

  return (
    <div>
      <PageHeader title="Overview" description="Tổng quan account hiện tại và trạng thái các kết nối." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Username" value={me?.username || '...'} hint="Username accounts" />
        <StatCard label="Role" value={roles.join(', ') || 'N/A'} hint={isAdmin() ? 'Admin mode đang mở' : 'User mode đang mở'} />
        <StatCard label="GitHub" value={github ? 'Linked' : 'Not linked'} hint="GitHub Integration" />
        <StatCard label="Jira" value={jira ? 'Linked' : 'Not linked'} hint="Jira Integration" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Account snapshot</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ['Full name', me?.fullName || '-'],
              ['Email', me?.email || '-'],
              ['Phone', me?.phone || '-'],
              ['Address', me?.address || '-'],
              ['Status', me?.active || me?.isActive ? 'Active' : 'Inactive'],
              ['Account ID', me?.id || '-'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-medium text-slate-900 break-all">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-card p-6">
          <h2 className="text-lg font-semibold text-slate-900">BE coverage note</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>...</p>
          </div>
        </div>
      </div>
    </div>
  )
}