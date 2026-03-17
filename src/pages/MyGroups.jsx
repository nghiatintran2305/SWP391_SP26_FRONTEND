import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { getMyWorkspaceProjectsApi } from '../services/api'

export default function MyGroupsPage() {
  const [groups, setGroups] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getMyWorkspaceProjectsApi()
      .then((res) => {
        setGroups(Array.isArray(res) ? res : [])
        setError('')
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load groups'))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader title="My groups" description="Projects that the current account is currently assigned to or managing." />
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {groups.length ? groups.map((g) => (
          <div key={g.id} className="soft-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">{g.projectName}</h3>
                <p className="mt-2 text-sm text-slate-500">Project status: {g.status || '-'}</p>
              </div>
              <span className="soft-badge border-slate-200 bg-slate-50 text-slate-700">{g.status || 'N/A'}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="metric-tile">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Jira key</div>
                <div className="mt-2 font-semibold text-slate-950">{g.jiraProjectKey || '-'}</div>
              </div>
              <div className="metric-tile">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">GitHub repository</div>
                <div className="mt-2 font-semibold text-slate-950 break-all">{g.githubRepoName || '-'}</div>
              </div>
            </div>
          </div>
        )) : (
          <div className="soft-card p-6 text-sm text-slate-500">No groups found for the current account.</div>
        )}
      </div>
    </div>
  )
}
