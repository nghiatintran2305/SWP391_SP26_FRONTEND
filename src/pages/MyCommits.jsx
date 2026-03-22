// src/pages/commit.jsx

import { useEffect, useState } from "react";
import { getMyCommits } from "../features/github/github.api";

export default function MyCommitsPage() {
  const [data, setData] = useState({ commits: [], mapped: true });
  const [error, setError] = useState("");

  useEffect(() => {
    getMyCommits()
      .then((res) => setData(res.data || { commits: [], mapped: true }))
      .catch(() => setError("Cannot load commits"));
  }, []);

  if (data && data.mapped === false) {
    return <div className="p-6">Your GitHub account is not mapped.</div>;
  }
//commit
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Commits</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="space-y-4">
        {(data.commits || []).map((c) => (
          <div key={c.sha || c.id} className="rounded-2xl border p-5 bg-white">
            <p className="font-mono text-sm text-slate-500">{(c.sha || "").slice(0, 7)}</p>
            <p className="mt-1 text-slate-800">{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
