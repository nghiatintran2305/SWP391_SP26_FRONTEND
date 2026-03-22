// src/pages/Mapping
//checkmap
import { useEffect, useState } from "react";
import { getMyIdentity, updateMyIdentity } from "../features/identity/identity.api";

export default function IdentityMappingPage() {
  const [form, setForm] = useState({ githubEmail: "", jiraAccountId: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyIdentity()
      .then((res) => {
        const d = res.data || {};
        setForm({
          githubEmail: d.githubEmail || "",
          jiraAccountId: d.jiraAccountId || "",
        });
      })
      .catch(() => setError("Cannot load identity mapping"));
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await updateMyIdentity(form);
      alert("Saved");
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">Identity Mapping</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-slate-700">GitHub Email</label>
          <input
            className="w-full border rounded-xl p-3 mt-2"
            value={form.githubEmail}
            onChange={(e) => setForm({ ...form, githubEmail: e.target.value })}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Jira Account ID</label>
          <input
            className="w-full border rounded-xl p-3 mt-2"
            value={form.jiraAccountId}
            onChange={(e) => setForm({ ...form, jiraAccountId: e.target.value })}
            placeholder="jira-account-id"
          />
        </div>

        <button
          disabled={saving}
          onClick={save}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
