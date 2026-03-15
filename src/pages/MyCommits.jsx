import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { getMyCommitStatsApi, getMyGroupsApi, getMyLinkStatusApi } from '../services/api'

export default function MyCommitsPage() {
  const [groups, setGroups] = useState([])
  const [linkStatus, setLinkStatus] = useState(null)
  const [selectedRepo, setSelectedRepo] = useState('')
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getMyGroupsApi(), getMyLinkStatusApi()])
      .then(([groupsRes, linkRes]) => {
        const groupList = Array.isArray(groupsRes) ? groupsRes : []
        setGroups(groupList)
        setLinkStatus(linkRes)
        const firstRepo = groupList.find((g) => g.githubRepoName)?.githubRepoName || ''
        setSelectedRepo(firstRepo)
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load commit prerequisites'))
  }, [])

  useEffect(() => {
    if (!selectedRepo || !linkStatus?.githubUsername) return
    getMyCommitStatsApi(selectedRepo, linkStatus.githubUsername)
      .then(setStats)
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load commit stats'))
  }, [selectedRepo, linkStatus])

  return (
    <div className="space-y-6">
      <PageHeader title="My commits" description="View GitHub commit metrics for the signed-in account across linked project repositories." />
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="soft-card p-6 md:p-7 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Repository</label>
          <select className="soft-select" value={selectedRepo} onChange={(e) => setSelectedRepo(e.target.value)}>
            <option value="">Select a repository</option>
            {groups.filter((g) => g.githubRepoName).map((g) => <option key={g.id} value={g.githubRepoName}>{g.projectName} - {g.githubRepoName}</option>)}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Username" value={stats?.username || linkStatus?.githubUsername || '-'} hint="Linked GitHub identity" />
          <StatCard label="Repository" value={stats?.repoName || selectedRepo || '-'} hint="Selected repository" />
          <StatCard label="Commits" value={stats?.totalCommits ?? 0} hint="Total commits found" />
          <StatCard label="Code changes" value={`+${stats?.additions ?? 0} / -${stats?.deletions ?? 0}`} hint="Additions and deletions" />
        </div>
      </div>
    </div>
  )
}
