import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { storage } from '../utils/storage'

export default function ProtectedRoute() {
  const location = useLocation()
  const token = storage.getToken()

  if (!token) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}