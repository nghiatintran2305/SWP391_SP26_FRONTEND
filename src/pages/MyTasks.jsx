import { useEffect, useState } from "react";
import { getMyJiraTasks } from "../features/jira/jira.api";

export default function MyTasksPage() {
  const [data, setData] = useState({ issues: [], mapped: true });
  const [error, setError] = useState("");

  useEffect(() => {
    getMyJiraTasks()
      .then((res) => setData(res.data || { issues: [], mapped: true }))
      .catch(() => setError("Cannot load tasks"));
  }, []);

  if (data && data.mapped === false) {
    return <div className="p-6">Your Jira account is not mapped.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Key</th>
              <th className="p-4">Summary</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data.issues || []).map((i) => (
              <tr key={i.issueKey || i.id} className="border-b">
                <td className="p-4">{i.issueKey}</td>
                <td className="p-4">{i.summary}</td>
                <td className="p-4">{i.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
