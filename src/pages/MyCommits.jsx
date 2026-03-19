import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { getMyCommitStatsApi, getMyLinkStatusApi, getMyWorkspaceProjectsApi, githubReposRes } from '../services/api'

export default function MyCommitsPage() {
  const [groups, setGroups] = useState([])
  const [githubRepos, setGithubRepos] = useState([])
  const [linkStatus, setLinkStatus] = useState(null)
  const [selectedRepo, setSelectedRepo] = useState('')
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getMyWorkspaceProjectsApi(), getMyLinkStatusApi()])
      .then(([groupsRes, linkRes]) => {
        const groupList = Array.isArray(groupsRes) ? groupsRes : []
        const repoList = Array.isArray(githubReposRes) ? githubReposRes : []
        setGroups(groupList)
        setGithubRepos(repoList)
        setLinkStatus(linkRes)
        const firstRepo = groupList.find((g) => g.githubRepoName)?.githubRepoName || ''
        setSelectedRepo(firstRepo)
        setError('')
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load commit prerequisites'))
  }, [])

  useEffect(() => {
    if (!selectedRepo || !linkStatus?.githubUsername) return
    getMyCommitStatsApi(selectedRepo, linkStatus.githubUsername)
      .then((res) => {
        setStats(res)
        setError('')
      })
      .catch((err) => setError(err?.response?.data?.message || 'Unable to load commit stats'))
  }, [selectedRepo, linkStatus])

  const repoOptions = useMemo(() => {
    const projectOptions = groups
      .filter((g) => g.githubRepoName)
      .map((g) => ({
        value: g.githubRepoName,
        label: `${g.projectName} - ${g.githubRepoName}`,
      }))

    const githubOptions = githubRepos.map((repo) => ({
      value: repo.fullName || repo.name,
      label: `${repo.fullName || repo.name}${repo.privateRepo ? ' (private)' : ''}`,
    }))

    const dedup = new Map()
    ;[...projectOptions, ...githubOptions].forEach((item) => {
      if (item?.value && !dedup.has(item.value)) dedup.set(item.value, item)
    })
    return Array.from(dedup.values())
  }, [groups, githubRepos])

  return (
    <div className="space-y-6">
      <PageHeader title="My commits" description="View GitHub commit metrics for the signed-in account across linked and accessible repositories." />
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="soft-card p-6 md:p-7 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Repository</label>
          <select className="soft-select" value={selectedRepo} onChange={(e) => setSelectedRepo(e.target.value)}>
            <option value="">Select a repository</option>
            {repoOptions.map((repo) => <option key={repo.value} value={repo.value}>{repo.label}</option>)}
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
