import React from "react";
import { useNavigate } from "react-router-dom";

function ActionCard({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl border p-6 bg-white hover:shadow-lg cursor-pointer transition"
    >
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">
        User Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="My Groups"
          desc="View all groups you are participating in"
          onClick={() => navigate("/groups")}
        />
        <ActionCard
          title="My Tasks"
          desc="View tasks assigned to you"
          onClick={() => navigate("/tasks")}
        />
        <ActionCard
          title="My Commits"
          desc="View your GitHub commit statistics"
          onClick={() => navigate("/commits")}
        />
      </div>
    </div>
  );
}
