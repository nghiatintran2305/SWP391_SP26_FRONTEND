import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  GitCommitHorizontal,
  LayoutDashboard,
  Link2,
  ListChecks,
  LogOut,
  Shield,
  UserCircle2,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { storage } from '../utils/storage'
import { isAdmin } from '../utils/auth'

const linkBase = 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200'
const linkActive = 'bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)]'
const linkIdle = 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const admin = isAdmin()

  const handleLogout = () => {
    storage.clear()
    toast.success('Signed out successfully')
    navigate('/', { replace: true })
  }

  return (
    <div className="app-shell">
      <div className="app-grid">
        <aside className="soft-card flex h-fit flex-col p-5 xl:sticky xl:top-6">
          <Link to="/overview" className="mb-6 flex items-center gap-4 rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Project Portal</div>
              <h2 className="mt-1 text-xl font-bold">SWP391 Workspace</h2>
            </div>
          </Link>

          <nav className="space-y-2">
            <NavLink to="/overview" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <LayoutDashboard className="h-4 w-4" /> Overview
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <UserCircle2 className="h-4 w-4" /> Profile
            </NavLink>
            <NavLink to="/change-password" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <Shield className="h-4 w-4" /> Security
            </NavLink>
            <NavLink to="/integrations" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <Link2 className="h-4 w-4" /> Integrations
            </NavLink>
            <NavLink to="/my-groups" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <FolderKanban className="h-4 w-4" /> My Groups
            </NavLink>
            <NavLink to="/my-tasks" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <ListChecks className="h-4 w-4" /> My Tasks
            </NavLink>
            <NavLink to="/my-commits" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <GitCommitHorizontal className="h-4 w-4" /> My Commits
            </NavLink>

            {admin ? (
              <>
                <div className="px-3 pt-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Admin</div>
                <NavLink to="/admin/accounts" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                  <Users className="h-4 w-4" /> Accounts
                </NavLink>
                <NavLink to="/admin/project-groups" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                  <FolderKanban className="h-4 w-4" /> Projects
                </NavLink>
                <NavLink to="/admin/group-members" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                  <Users className="h-4 w-4" /> Members
                </NavLink>
              </>
            ) : null}
          </nav>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Keep your GitHub and Jira accounts linked to unlock project automation.
          </div>

          <button onClick={handleLogout} className="soft-button-secondary mt-6 w-full justify-center gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
