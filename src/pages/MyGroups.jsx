import { useEffect, useState } from "react";
import { getMyGroups } from "../features/projectGroup/projectGroup.api";

export default function MyGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyGroups()
      .then((res) => setGroups(res.data || []))
      .catch(() => setError("Cannot load groups"));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Groups</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <div key={g.id} className="rounded-2xl border p-6 bg-white">
            <h3 className="text-lg font-semibold">{g.groupName}</h3>
            <p className="text-sm text-slate-500">{g.semester}</p>
            {g.myRoleInGroup ? (
              <p className="mt-2 font-medium">Role: {g.myRoleInGroup}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
