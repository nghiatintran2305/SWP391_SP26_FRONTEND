import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIntegrationConfigApi, syncIntegrationApi } from "../services/api.service";
import { logout } from "../utils/auth";
import { useCurrentUser } from "../hooks/useCurrentUser";
//home
export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser: me } = useCurrentUser();

  const [groupId, setGroupId] = useState("");
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    // optional auto-load if user types later
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const loadConfig = async () => {
    if (!groupId) {
      setError("Please enter groupId to load integration config.");
      return;
    }
    setError("");
    setSyncResult(null);
    setLoading(true);
    try {
      const res = await getIntegrationConfigApi(groupId);
      setConfig(res);
    } catch (err) {
      console.error(err);
      setConfig(null);
      setError(err?.response?.data?.message || err?.message || "Failed to load config.");
    } finally {
      setLoading(false);
    }
  };

  const runSync = async (type) => {
    if (!groupId) {
      setError("Please enter groupId first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await syncIntegrationApi(groupId, { type });
      setSyncResult(res);
      await loadConfig();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Sync failed.");
    } finally {
      setLoading(false);
    }
  };
//topbar
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Home</h1>
            <p className="text-sm text-slate-600">
              Welcome, <span className="font-semibold">{me?.fullName || me?.username || "User"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
              type="button"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">Integration config</div>
              <div className="text-xs text-slate-500">
                Nhập <span className="font-semibold">groupId</span> để xem cấu hình tích hợp Jira/GitHub và chạy sync.
              </div>
            </div>
            <div className="flex gap-2">
              <input
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="groupId"
                className="w-full md:w-72 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              />
              <button
                onClick={loadConfig}
                disabled={loading}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60"
                type="button"
              >
                Load
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          ) : null}

          {config ? (
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Jira</div>
                <div className="mt-2 text-sm text-slate-700 space-y-1">
                  <div><span className="text-slate-500">Base URL:</span> {config.jiraBaseUrl}</div>
                  <div><span className="text-slate-500">Project key:</span> {config.jiraProjectKey}</div>
                  <div><span className="text-slate-500">Board id:</span> {config.jiraBoardId || "-"}</div>
                  <div><span className="text-slate-500">Token:</span> {config.jiraAccessTokenMasked || "-"}</div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">GitHub</div>
                <div className="mt-2 text-sm text-slate-700 space-y-1">
                  <div><span className="text-slate-500">Owner:</span> {config.githubOwner}</div>
                  <div><span className="text-slate-500">Repo:</span> {config.githubRepo}</div>
                  <div><span className="text-slate-500">Token:</span> {config.githubTokenMasked || "-"}</div>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => runSync("JIRA")}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-60"
                  type="button"
                >
                  Sync Jira
                </button>
                <button
                  onClick={() => runSync("GITHUB")}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-60"
                  type="button"
                >
                  Sync GitHub
                </button>
                <button
                  onClick={() => runSync("FULL")}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60"
                  type="button"
                >
                  Full sync
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-600">
              {loading ? "Loading..." : "No config loaded."}
            </div>
          )}

          {syncResult ? (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <div className="text-sm font-semibold text-emerald-900">Sync result</div>
              <div className="mt-2 text-sm text-emerald-900/90 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><span className="font-semibold">Status:</span> {syncResult.status}</div>
                <div><span className="font-semibold">Type:</span> {syncResult.type}</div>
                <div><span className="font-semibold">Jira issues:</span> {syncResult.jiraIssueCount}</div>
                <div><span className="font-semibold">GitHub commits:</span> {syncResult.githubCommitCount}</div>
              </div>
              {syncResult.message ? (
                <div className="mt-2 text-sm text-emerald-900/80">{syncResult.message}</div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="text-center text-xs text-slate-500 py-4">
          © {new Date().getFullYear()} SWP391
        </div>
      </div>
    </div>
  );
}