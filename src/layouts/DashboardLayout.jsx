import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FolderKanban, Link2, LogOut, Shield, UserCircle2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { storage } from '../utils/storage'
import { isAdmin } from '../utils/auth'

const linkBase = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition'
const linkActive = 'bg-slate-900 text-white shadow-soft'
const linkIdle = 'text-slate-700 hover:bg-slate-100'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const admin = isAdmin()

  const handleLogout = () => {
    storage.clear()
    toast.success('Đăng xuất xong rồi')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="soft-card h-fit p-4">
          <Link to="/overview" className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Shield className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">SWP391 Portal</h2>
              <p className="text-xs text-slate-500"></p>
            </div>
          </Link>

          <nav className="space-y-2">
            <NavLink to="/overview" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <UserCircle2 className="h-4 w-4" /> Overview
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <Users className="h-4 w-4" /> Profile
            </NavLink>
            <NavLink to="/change-password" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <Shield className="h-4 w-4" /> Change password
            </NavLink>
            <NavLink to="/integrations" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
              <Link2 className="h-4 w-4" /> GitHub & Jira
            </NavLink>

            {admin ? (
              <>
                <div className="px-4 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin</div>
                <NavLink to="/admin/accounts" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                  <Users className="h-4 w-4" /> Accounts
                </NavLink>
                <NavLink to="/admin/project-groups" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                  <FolderKanban className="h-4 w-4" /> Project groups
                </NavLink>
                <NavLink to="/admin/group-members" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
                  <Users className="h-4 w-4" /> Group members
                </NavLink>
              </>
            ) : null}
          </nav>

          <button onClick={handleLogout} className="soft-button-secondary mt-6 w-full justify-center gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}