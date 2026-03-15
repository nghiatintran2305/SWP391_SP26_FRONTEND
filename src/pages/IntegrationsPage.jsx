import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  getGithubAuthorizeUrlApi,
  getGithubMeApi,
  getJiraAuthorizeUrlApi,
  getJiraLinkApi,
  unlinkGithubApi,
  unlinkJiraApi,
} from '../services/api'

function IntegrationCard({ title, description, status, details, onConnect, onDisconnect }) {
  return (
    <div className="soft-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <span className={`soft-badge ${status === 'Linked' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>{status}</span>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <pre className="m-0 whitespace-pre-wrap break-all font-sans">{details}</pre>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button onClick={onConnect} className="soft-button-primary flex-1">Connect</button>
        <button onClick={onDisconnect} className="soft-button-secondary flex-1">Unlink</button>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  const [github, setGithub] = useState(null)
  const [jira, setJira] = useState(null)

  const load = async () => {
    try {
      const [githubRes, jiraRes] = await Promise.allSettled([getGithubMeApi(), getJiraLinkApi()])
      setGithub(githubRes.status === 'fulfilled' ? githubRes.value : null)
      setJira(jiraRes.status === 'fulfilled' ? jiraRes.value : null)
    } catch {
      // noop
    }
  }

  useEffect(() => {
    load()
  }, [])

  const connectGithub = async () => {
    try {
      const url = await getGithubAuthorizeUrlApi()
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không lấy được GitHub authorize URL')
    }
  }

  const connectJira = async () => {
    try {
      const url = await getJiraAuthorizeUrlApi()
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không lấy được Jira authorize URL')
    }
  }

  const disconnectGithub = async () => {
    try {
      await unlinkGithubApi()
      toast.success('Đã unlink GitHub')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unlink GitHub fail')
    }
  }

  const disconnectJira = async () => {
    try {
      await unlinkJiraApi()
      toast.success('Đã unlink Jira')
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unlink Jira fail')
    }
  }

  return (
    <div>
      <PageHeader title="Integrations" description="Trang link / unlink GitHub và Jira theo endpoint BE mới." />
      <div className="grid gap-6 xl:grid-cols-2">
        <IntegrationCard
          title="GitHub"
          description="GET /api/github/authorize-url, /api/github/me, DELETE /api/github/unlink"
          status={github ? 'Linked' : 'Not linked'}
          details={github ? JSON.stringify(github, null, 2) : 'Chưa có mapping GitHub cho user này.'}
          onConnect={connectGithub}
          onDisconnect={disconnectGithub}
        />
        <IntegrationCard
          title="Jira"
          description="GET /api/v1/jira/oauth/authorize, /api/v1/jira/link, DELETE /api/v1/jira/link"
          status={jira ? 'Linked' : 'Not linked'}
          details={jira ? JSON.stringify(jira, null, 2) : 'Chưa có mapping Jira cho user này.'}
          onConnect={connectJira}
          onDisconnect={disconnectJira}
        />
      </div>
    </div>
  )
}