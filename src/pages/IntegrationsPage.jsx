import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'
import {
  getGithubAuthorizeUrlApi,
  getJiraAuthorizeUrlApi,
  getMyLinkStatusApi,
  handleGithubCallbackApi,
  handleJiraCallbackApi,
  unlinkGithubApi,
  unlinkJiraApi,
} from '../services/api'

function IntegrationCard({ title, description, linked, details, busy, onConnect, onDisconnect }) {
  return (
    <div className="soft-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <span
          className={`soft-badge ${
            linked
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}
        >
          {linked ? 'Linked' : 'Not linked'}
        </span>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <pre className="m-0 whitespace-pre-wrap break-all font-sans">{details}</pre>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          disabled={busy}
          onClick={onConnect}
          className="soft-button-primary flex-1 disabled:opacity-60"
        >
          {busy ? 'Processing...' : 'Connect'}
        </button>
        <button
          disabled={busy || !linked}
          onClick={onDisconnect}
          className="soft-button-secondary flex-1 disabled:opacity-60"
        >
          Disconnect
        </button>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  const [linkStatus, setLinkStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const callbackHandledRef = useRef(false)

  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const code = params.get('code')
  const state = params.get('state')

  const load = useCallback(async () => {
    try {
      const status = await getMyLinkStatusApi()
      setLinkStatus(status)
    } catch {
      setLinkStatus(null)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const runOAuthCallback = async () => {
      if (!code || !state) return
      if (callbackHandledRef.current) return

      callbackHandledRef.current = true
      setBusy(true)

      try {
        if (state === 'github') {
          await handleGithubCallbackApi(code)
          toast.success('GitHub connected successfully')
        } else if (state === 'jira') {
          await handleJiraCallbackApi(code)
          toast.success('Jira connected successfully')
        } else {
          toast.error('Invalid OAuth state')
          return
        }

        await load()
        navigate('/integrations', { replace: true })
      } catch (err) {
        toast.error(err?.response?.data?.message || 'OAuth callback failed')
        navigate('/integrations', { replace: true })
      } finally {
        setBusy(false)
      }
    }

    runOAuthCallback()
  }, [code, state, navigate, load])

  const connectGithub = async () => {
    try {
      const url = await getGithubAuthorizeUrlApi()
      window.location.href = url
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to get GitHub authorize URL')
    }
  }

  const connectJira = async () => {
    try {
      const url = await getJiraAuthorizeUrlApi()
      window.location.href = url
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to get Jira authorize URL')
    }
  }

  const disconnectGithub = async () => {
    try {
      setBusy(true)
      await unlinkGithubApi()
      await load()
      toast.success('GitHub disconnected')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to disconnect GitHub')
    } finally {
      setBusy(false)
    }
  }

  const disconnectJira = async () => {
    try {
      setBusy(true)
      await unlinkJiraApi()
      await load()
      toast.success('Jira disconnected')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to disconnect Jira')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect or disconnect your GitHub and Jira accounts. OAuth callbacks are handled automatically when the provider returns to this page."
      />

      <div className="grid gap-6 2xl:grid-cols-2">
        <IntegrationCard
          title="GitHub"
          description="Connect GitHub to sync identity and unlock repository-based features for your current account."
          linked={!!linkStatus?.githubLinked}
          busy={busy}
          details={
            linkStatus?.githubLinked
              ? JSON.stringify({ githubUsername: linkStatus.githubUsername }, null, 2)
              : 'No GitHub mapping has been created for this account yet.'
          }
          onConnect={connectGithub}
          onDisconnect={disconnectGithub}
        />

        <IntegrationCard
          title="Jira"
          description="Connect Jira to sync your linked Jira identity and enable project/task automation in the workspace."
          linked={!!linkStatus?.jiraLinked}
          busy={busy}
          details={
            linkStatus?.jiraLinked
              ? JSON.stringify({ jiraAccountId: linkStatus.jiraAccountId }, null, 2)
              : 'No Jira mapping has been created for this account yet.'
          }
          onConnect={connectJira}
          onDisconnect={disconnectJira}
        />
      </div>
    </div>
  )
}