import { Outlet, Link, useNavigate } from "react-router-dom";
import { logout } from "../../lib/auth";

export default function AdminLayout() {
  const nav = useNavigate();

  function doLogout() {
    logout();
    nav("/login");
  }

  return (
    <div className="admin">
      <aside className="sidebar">
        <h3>ADMIN</h3>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/lecturers">Lecturers</Link>
        <Link to="/admin/project-groups/create">Create Group</Link>
        <button onClick={doLogout}>Logout</button>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
