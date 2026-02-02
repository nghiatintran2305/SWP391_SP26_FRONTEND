
import { useNavigate } from "react-router-dom";

function ActionCard({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border p-8 bg-white hover:shadow-lg transition cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard title="Create Lecturer" onClick={() => nav("/admin/lecturers")} />
        <ActionCard title="Create Project Group" onClick={() => nav("/admin/groups")} />
        <ActionCard title="Manage Integrations" onClick={() => nav("/admin/integrations")} />
        <ActionCard title="Identity Mapping" onClick={() => nav("/admin/identity-mapping")} />
      </div>
    </div>
  );
}
