import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterStudentPage from './pages/RegisterStudentPage'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import OverviewPage from './pages/OverviewPage'
import ProfilePage from './pages/ProfilePage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import IntegrationsPage from './pages/IntegrationsPage'
import AdminAccountsPage from './pages/AdminAccountsPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectWorkspacePage from './pages/ProjectWorkspacePage'
import MyTasksPage from './pages/MyTasks'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register-student" element={<RegisterStudentPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectWorkspacePage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/admin/accounts" element={<AdminAccountsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
