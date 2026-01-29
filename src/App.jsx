import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Lecturers from "./pages/admin/Lecturers";
import ProjectGroupCreate from "./pages/admin/ProjectGroupCreate";
import { isAuthed } from "./lib/auth";

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="lecturers" element={<Lecturers />} />
        <Route path="project-groups/create" element={<ProjectGroupCreate />} />
      </Route>
    </Routes>
  );
}
