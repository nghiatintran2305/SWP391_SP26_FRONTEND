import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminDeleteAccountApi,
  adminUpdateAccountApi,
  createIntegrationConfigApi,
  createLecturerApi,
  createProjectGroupApi,
  getAllAccountsApi,
  getIntegrationConfigApi,
  getLecturersApi,
  getStudentsApi,
  syncIntegrationApi,
  updateIntegrationConfigApi,
  getIdentityMappingApi,
  upsertIdentityMappingApi,
} from "../services/api.service";
import { logout } from "../utils/auth";
import { storage } from "../utils/storage";

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
      type="button"
    >
      <span className={["h-2 w-2 rounded-full", active ? "bg-white" : "bg-slate-300"].join(" ")} />
      {label}
    </button>
  );
}

function Field({ label, hint, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
      <input
        {...props}
        className={[
          "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition",
          props.disabled ? "opacity-70" : "",
        ].join(" ")}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        {...props}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
      >
        {children}
      </select>
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
            type="button"
          >
            Close
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Pill({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneMap[tone] || toneMap.slate}`}>{children}</span>
  );
}

function normalizeList(list) {
  return Array.isArray(list) ? list : list ? [list] : [];
}

export default function AdminPage() {
  const navigate = useNavigate();

  const userName = storage.get("userName") || "Admin";
  const userEmail = storage.get("userEmail") || "admin";

  const [section, setSection] = useState("Overview");
  const [errorTop, setErrorTop] = useState("");

  // ===== Overview stats =====
  const [stats, setStats] = useState({ total: 0, lecturers: 0, students: 0, active: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  // ===== Accounts =====
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsQuery, setAccountsQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editPayload, setEditPayload] = useState({ email: "", fullName: "", phone: "", address: "", isActive: true });
  const [editSaving, setEditSaving] = useState(false);
  const [createLectOpen, setCreateLectOpen] = useState(false);
  const [createLectPayload, setCreateLectPayload] = useState({ username: "", password: "", email: "", fullName: "", phone: "", address: "" });
  const [createLectSaving, setCreateLectSaving] = useState(false);

  // ===== Project Groups =====
  const [lecturers, setLecturers] = useState([]);
  const [groupForm, setGroupForm] = useState({ groupName: "", semester: "Spring 2026", lecturerId: "" });
  const [groupSaving, setGroupSaving] = useState(false);
  const [groupResult, setGroupResult] = useState(null);

  // ===== Integrations =====
  const [intGroupId, setIntGroupId] = useState("");
  const [intConfig, setIntConfig] = useState(null);
  const [intForm, setIntForm] = useState({
    groupId: "",
    jiraBaseUrl: "",
    jiraProjectKey: "",
    jiraBoardId: "",
    jiraAccessToken: "",
    githubOwner: "",
    githubRepo: "",
    githubToken: "",
  });
  const [intLoading, setIntLoading] = useState(false);
  const [intMessage, setIntMessage] = useState("");
  const [syncResult, setSyncResult] = useState(null);

  // ===== Identity Mappings =====
  const [mapAccountId, setMapAccountId] = useState("");
  const [mapForm, setMapForm] = useState({ accountId: "", jiraAccountId: "", jiraEmail: "", githubUsername: "", githubEmail: "" });
  const [mapLoading, setMapLoading] = useState(false);
  const [mapMessage, setMapMessage] = useState("");
  const [mapData, setMapData] = useState(null);

  // ===== Auth guard =====
  useEffect(() => {
    const t = storage.get("loginType");
    if (t !== "ADMIN") {
      // backend already blocks, but keep FE safe
      navigate("/home", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOverview = async () => {
    setLoadingStats(true);
    setErrorTop("");
    try {
      const [all, lects, studs] = await Promise.all([
        getAllAccountsApi(),
        getLecturersApi(""),
        getStudentsApi(""),
      ]);
      const allList = normalizeList(all);
      const activeCount = allList.filter((a) => a?.isActive).length;
      setStats({
        total: allList.length,
        lecturers: normalizeList(lects).length,
        students: normalizeList(studs).length,
        active: activeCount,
      });
    } catch (err) {
      console.error(err);
      setErrorTop(err?.response?.data?.message || err?.message || "Failed to load overview.");
    } finally {
      setLoadingStats(false);
    }
  };

  const loadAccounts = async () => {
    setAccountsLoading(true);
    setErrorTop("");
    try {
      const list = await getAllAccountsApi();
      setAccounts(normalizeList(list));
    } catch (err) {
      console.error(err);
      setErrorTop(err?.response?.data?.message || err?.message || "Failed to load accounts.");
    } finally {
      setAccountsLoading(false);
    }
  };

  const loadLecturers = async () => {
    try {
      const list = await getLecturersApi("");
      setLecturers(normalizeList(list));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOverview();
    loadAccounts();
    loadLecturers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAccounts = useMemo(() => {
    const q = (accountsQuery || "").trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter((a) => {
      const s = `${a.username || ""} ${a.email || ""} ${a.fullName || ""} ${a.role || ""}`.toLowerCase();
      return s.includes(q);
    });
  }, [accounts, accountsQuery]);

  const openEdit = (a) => {
    setSelectedAccount(a);
    setEditPayload({
      email: a?.email || "",
      fullName: a?.fullName || "",
      phone: a?.phone || "",
      address: a?.address || "",
      isActive: !!a?.isActive,
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!selectedAccount?.id) return;
    setEditSaving(true);
    setErrorTop("");
    try {
      const updated = await adminUpdateAccountApi(selectedAccount.id, editPayload);
      setAccounts((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setSelectedAccount(null);
      await loadOverview();
    } catch (err) {
      console.error(err);
      setErrorTop(err?.response?.data?.message || err?.message || "Update failed.");
    } finally {
      setEditSaving(false);
    }
  };

  const deleteAccount = async (id) => {
    const ok = window.confirm("Delete this account? (soft delete)");
    if (!ok) return;
    setErrorTop("");
    try {
      await adminDeleteAccountApi(id);
      setAccounts((prev) => prev.filter((x) => x.id !== id));
      await loadOverview();
    } catch (err) {
      console.error(err);
      setErrorTop(err?.response?.data?.message || err?.message || "Delete failed.");
    }
  };

  const createLecturer = async (e) => {
    e.preventDefault();
    setCreateLectSaving(true);
    setErrorTop("");
    try {
      const created = await createLecturerApi(createLectPayload);
      setCreateLectOpen(false);
      setCreateLectPayload({ username: "", password: "", email: "", fullName: "", phone: "", address: "" });
      setAccounts((prev) => [created, ...prev]);
      await loadLecturers();
      await loadOverview();
    } catch (err) {
      console.error(err);
      setErrorTop(err?.response?.data?.message || err?.message || "Create lecturer failed.");
    } finally {
      setCreateLectSaving(false);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    setGroupSaving(true);
    setErrorTop("");
    setGroupResult(null);
    try {
      const res = await createProjectGroupApi(groupForm);
      setGroupResult(res);
      setGroupForm((p) => ({ ...p, groupName: "" }));
    } catch (err) {
      console.error(err);
      setErrorTop(err?.response?.data?.message || err?.message || "Create group failed.");
    } finally {
      setGroupSaving(false);
    }
  };

  const loadIntegrationConfig = async () => {
    if (!intGroupId) {
      setIntMessage("Please enter groupId.");
      return;
    }
    setIntLoading(true);
    setIntMessage("");
    setSyncResult(null);
    try {
      const cfg = await getIntegrationConfigApi(intGroupId);
      setIntConfig(cfg);
      setIntForm((p) => ({
        ...p,
        groupId: cfg.groupId || intGroupId,
        jiraBaseUrl: cfg.jiraBaseUrl || "",
        jiraProjectKey: cfg.jiraProjectKey || "",
        jiraBoardId: cfg.jiraBoardId || "",
        jiraAccessToken: "",
        githubOwner: cfg.githubOwner || "",
        githubRepo: cfg.githubRepo || "",
        githubToken: "",
      }));
    } catch (err) {
      console.error(err);
      setIntConfig(null);
      setIntForm((p) => ({ ...p, groupId: intGroupId }));
      setIntMessage(err?.response?.data?.message || err?.message || "Config not found. You can create a new one below.");
    } finally {
      setIntLoading(false);
    }
  };

  const saveIntegrationConfig = async (e) => {
    e.preventDefault();
    if (!intForm.groupId) {
      setIntMessage("groupId is required.");
      return;
    }
    setIntLoading(true);
    setIntMessage("");
    try {
      let res;
      if (intConfig?.groupId) {
        res = await updateIntegrationConfigApi(intForm.groupId, intForm);
      } else {
        res = await createIntegrationConfigApi(intForm);
      }
      setIntConfig(res);
      setIntGroupId(res.groupId);
      setIntMessage("Saved integration config.");
      // clear tokens after save
      setIntForm((p) => ({ ...p, jiraAccessToken: "", githubToken: "" }));
    } catch (err) {
      console.error(err);
      setIntMessage(err?.response?.data?.message || err?.message || "Save failed.");
    } finally {
      setIntLoading(false);
    }
  };

  const runSync = async (type) => {
    if (!intGroupId) {
      setIntMessage("Please enter groupId.");
      return;
    }
    setIntLoading(true);
    setIntMessage("");
    try {
      const res = await syncIntegrationApi(intGroupId, { type });
      setSyncResult(res);
      await loadIntegrationConfig();
    } catch (err) {
      console.error(err);
      setIntMessage(err?.response?.data?.message || err?.message || "Sync failed.");
    } finally {
      setIntLoading(false);
    }
  };

  const loadMapping = async () => {
    if (!mapAccountId) {
      setMapMessage("Please enter accountId.");
      return;
    }
    setMapLoading(true);
    setMapMessage("");
    try {
      const res = await getIdentityMappingApi(mapAccountId);
      setMapData(res);
      setMapForm({
        accountId: res.accountId || mapAccountId,
        jiraAccountId: res.jiraAccountId || "",
        jiraEmail: res.jiraEmail || "",
        githubUsername: res.githubUsername || "",
        githubEmail: res.githubEmail || "",
      });
    } catch (err) {
      console.error(err);
      setMapData(null);
      setMapForm({ accountId: mapAccountId, jiraAccountId: "", jiraEmail: "", githubUsername: "", githubEmail: "" });
      setMapMessage(err?.response?.data?.message || err?.message || "Mapping not found. You can create one below.");
    } finally {
      setMapLoading(false);
    }
  };

  const saveMapping = async (e) => {
    e.preventDefault();
    if (!mapForm.accountId) {
      setMapMessage("accountId is required.");
      return;
    }
    setMapLoading(true);
    setMapMessage("");
    try {
      const res = await upsertIdentityMappingApi(mapForm);
      setMapData(res);
      setMapMessage("Saved mapping.");
    } catch (err) {
      console.error(err);
      setMapMessage(err?.response?.data?.message || err?.message || "Save mapping failed.");
    } finally {
      setMapLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const statsCards = useMemo(() => {
    return [
      { title: "Total accounts", value: loadingStats ? "..." : String(stats.total), sub: "All roles" },
      { title: "Lecturers", value: loadingStats ? "..." : String(stats.lecturers), sub: "Role LECTURER" },
      { title: "Students", value: loadingStats ? "..." : String(stats.students), sub: "Role STUDENT" },
      { title: "Active", value: loadingStats ? "..." : String(stats.active), sub: "isActive = true" },
    ];
  }, [loadingStats, stats]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex grow flex-col gap-y-5 border-r border-slate-200 bg-white px-4 py-5">
            {/* Brand */}
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-800" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 6.5V17.5L12 22L21 17.5V6.5L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M12 22V12.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M21 6.5L12 12.2L3 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">SWP391 Admin</div>
                <div className="text-xs text-slate-500">Dashboard</div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2">
              <NavItem label="Overview" active={section === "Overview"} onClick={() => setSection("Overview")} />
              <NavItem label="Accounts" active={section === "Accounts"} onClick={() => setSection("Accounts")} />
              <NavItem label="Project Groups" active={section === "Project Groups"} onClick={() => setSection("Project Groups")} />
              <NavItem label="Integrations" active={section === "Integrations"} onClick={() => setSection("Integrations")} />
              <NavItem label="Identity Mappings" active={section === "Identity Mappings"} onClick={() => setSection("Identity Mappings")} />
            </nav>

            {/* Footer */}
            <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Signed in as</div>
              <div className="mt-1 text-sm font-semibold text-slate-900 truncate">{userName}</div>
              <div className="text-xs text-slate-600 truncate">{userEmail}</div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                  type="button"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:pl-64">
          {/* Topbar */}
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{section}</h1>
                <p className="text-sm text-slate-600">
                  Welcome back, <span className="font-semibold">{userName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-slate-500">Role</div>
                  <div className="text-sm font-semibold text-slate-900">ADMIN</div>
                </div>
                <button
                  onClick={() => navigate("/profile")}
                  className="md:hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                  type="button"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="md:hidden rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
            {errorTop ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700 font-medium">{errorTop}</p>
              </div>
            ) : null}

            {section === "Overview" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsCards.map((s) => (
                    <StatCard key={s.title} title={s.title} value={s.value} sub={s.sub} />
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-slate-900">Quick actions</h2>
                      <button
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                        type="button"
                        onClick={() => {
                          loadOverview();
                          loadAccounts();
                          loadLecturers();
                        }}
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition"
                        onClick={() => {
                          setSection("Accounts");
                          setCreateLectOpen(true);
                        }}
                      >
                        <div className="text-sm font-semibold text-slate-900">Create lecturer</div>
                        <div className="text-xs text-slate-500">POST /api/v1/accounts/lecturers</div>
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition"
                        onClick={() => setSection("Project Groups")}
                      >
                        <div className="text-sm font-semibold text-slate-900">Create project group</div>
                        <div className="text-xs text-slate-500">POST /api/v1/project-groups</div>
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition"
                        onClick={() => setSection("Integrations")}
                      >
                        <div className="text-sm font-semibold text-slate-900">Manage integrations</div>
                        <div className="text-xs text-slate-500">Configs & sync jobs</div>
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition"
                        onClick={() => setSection("Identity Mappings")}
                      >
                        <div className="text-sm font-semibold text-slate-900">Identity mapping</div>
                        <div className="text-xs text-slate-500">Jira/GitHub identity for accounts</div>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900">Notes</h2>
                    <div className="mt-3 text-sm text-slate-700 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                        <p>
                          Token JWT của BE hiện chỉ chứa <span className="font-semibold">sub</span> và <span className="font-semibold">roles</span>.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                        <p>
                          Các màn hình bên dưới đã map đúng các endpoint hiện có trong BE (Account / ProjectGroup / Integrations / IdentityMapping).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {section === "Accounts" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Accounts</h2>
                    <p className="text-sm text-slate-600">Manage users (ADMIN only)</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={accountsQuery}
                      onChange={(e) => setAccountsQuery(e.target.value)}
                      placeholder="Search username/email/name/role"
                      className="w-full sm:w-72 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                    />
                    <button
                      onClick={loadAccounts}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                      type="button"
                    >
                      {accountsLoading ? "Loading..." : "Refresh"}
                    </button>
                    <button
                      onClick={() => setCreateLectOpen(true)}
                      className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                      type="button"
                    >
                      Create lecturer
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="py-3 pr-3">Username</th>
                        <th className="py-3 pr-3">Full name</th>
                        <th className="py-3 pr-3">Email</th>
                        <th className="py-3 pr-3">Role</th>
                        <th className="py-3 pr-3">Status</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAccounts.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="py-3 pr-3 font-semibold text-slate-900">{a.username}</td>
                          <td className="py-3 pr-3 text-slate-800">{a.fullName || "-"}</td>
                          <td className="py-3 pr-3 text-slate-800">{a.email || "-"}</td>
                          <td className="py-3 pr-3">
                            <Pill>{a.role || "-"}</Pill>
                          </td>
                          <td className="py-3 pr-3">
                            {a.isActive ? <Pill tone="green">Active</Pill> : <Pill tone="amber">Inactive</Pill>}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => openEdit(a)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 transition"
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteAccount(a.id)}
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAccounts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500">
                            {accountsLoading ? "Loading..." : "No accounts"}
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {section === "Project Groups" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Create project group</h2>
                    <p className="text-sm text-slate-600">POST /api/v1/project-groups (ADMIN)</p>
                  </div>
                  <button
                    onClick={loadLecturers}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                    type="button"
                  >
                    Reload lecturers
                  </button>
                </div>

                <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={createGroup}>
                  <Field
                    label="Group name"
                    value={groupForm.groupName}
                    onChange={(e) => setGroupForm((p) => ({ ...p, groupName: e.target.value }))}
                    placeholder="Group name"
                    required
                  />
                  <Field
                    label="Semester"
                    hint="Format: Spring 2024, Summer 2024, Fall 2024"
                    value={groupForm.semester}
                    onChange={(e) => setGroupForm((p) => ({ ...p, semester: e.target.value }))}
                    placeholder="Spring 2026"
                    required
                  />
                  <Select
                    label="Lecturer"
                    value={groupForm.lecturerId}
                    onChange={(e) => setGroupForm((p) => ({ ...p, lecturerId: e.target.value }))}
                    required
                  >
                    <option value="">Select lecturer</option>
                    {lecturers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.fullName || l.username} ({l.email || "-"})
                      </option>
                    ))}
                  </Select>
                  <div className="md:col-span-2 flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={groupSaving}
                      className="rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
                    >
                      {groupSaving ? "Creating..." : "Create group"}
                    </button>
                  </div>
                </form>

                {groupResult ? (
                  <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                    <div className="text-sm font-semibold text-emerald-900">Created!</div>
                    <div className="mt-2 text-sm text-emerald-900/90 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold">Group:</span> {groupResult.groupName}
                      </div>
                      <div>
                        <span className="font-semibold">Semester:</span> {groupResult.semester}
                      </div>
                      <div>
                        <span className="font-semibold">Lecturer:</span> {groupResult.lecturerUsername}
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span> {groupResult.status}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-emerald-900/70">Use groupId below to create integration config.</div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {section === "Integrations" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Integration configs</h2>
                    <p className="text-sm text-slate-600">Create/update config and trigger sync jobs</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={intGroupId}
                      onChange={(e) => setIntGroupId(e.target.value)}
                      placeholder="groupId"
                      className="w-full sm:w-72 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                    />
                    <button
                      onClick={loadIntegrationConfig}
                      disabled={intLoading}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-60"
                      type="button"
                    >
                      Load
                    </button>
                  </div>
                </div>

                {intMessage ? (
                  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-sm text-slate-700 font-medium">{intMessage}</p>
                  </div>
                ) : null}

                {intConfig ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Current config</div>
                        <div className="text-xs text-slate-500">Tokens are masked in responses.</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => runSync("JIRA")}
                          disabled={intLoading}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-60"
                          type="button"
                        >
                          Sync Jira
                        </button>
                        <button
                          onClick={() => runSync("GITHUB")}
                          disabled={intLoading}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-60"
                          type="button"
                        >
                          Sync GitHub
                        </button>
                        <button
                          onClick={() => runSync("FULL")}
                          disabled={intLoading}
                          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-60"
                          type="button"
                        >
                          Full sync
                        </button>
                      </div>
                    </div>
                    {syncResult ? (
                      <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                        <div className="text-sm font-semibold text-emerald-900">Last sync result</div>
                        <div className="mt-2 text-sm text-emerald-900/90 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div><span className="font-semibold">Status:</span> {syncResult.status}</div>
                          <div><span className="font-semibold">Type:</span> {syncResult.type}</div>
                          <div><span className="font-semibold">Jira issues:</span> {syncResult.jiraIssueCount}</div>
                          <div><span className="font-semibold">GitHub commits:</span> {syncResult.githubCommitCount}</div>
                        </div>
                        {syncResult.message ? <div className="mt-2 text-sm text-emerald-900/80">{syncResult.message}</div> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={saveIntegrationConfig}>
                  <Field
                    label="groupId *"
                    value={intForm.groupId}
                    onChange={(e) => setIntForm((p) => ({ ...p, groupId: e.target.value }))}
                    placeholder="groupId"
                    required
                  />
                  <Field
                    label="jiraBaseUrl *"
                    value={intForm.jiraBaseUrl}
                    onChange={(e) => setIntForm((p) => ({ ...p, jiraBaseUrl: e.target.value }))}
                    placeholder="https://your-domain.atlassian.net"
                    required
                  />
                  <Field
                    label="jiraProjectKey *"
                    value={intForm.jiraProjectKey}
                    onChange={(e) => setIntForm((p) => ({ ...p, jiraProjectKey: e.target.value }))}
                    placeholder="PROJ"
                    required
                  />
                  <Field
                    label="jiraBoardId"
                    value={intForm.jiraBoardId}
                    onChange={(e) => setIntForm((p) => ({ ...p, jiraBoardId: e.target.value }))}
                    placeholder="Optional"
                  />
                  <Field
                    label="jiraAccessToken *"
                    hint="Nếu đã có config, chỉ cần nhập khi muốn đổi token"
                    value={intForm.jiraAccessToken}
                    onChange={(e) => setIntForm((p) => ({ ...p, jiraAccessToken: e.target.value }))}
                    placeholder="Jira token"
                    required={!intConfig}
                  />
                  <div />
                  <Field
                    label="githubOwner *"
                    value={intForm.githubOwner}
                    onChange={(e) => setIntForm((p) => ({ ...p, githubOwner: e.target.value }))}
                    placeholder="octocat"
                    required
                  />
                  <Field
                    label="githubRepo *"
                    value={intForm.githubRepo}
                    onChange={(e) => setIntForm((p) => ({ ...p, githubRepo: e.target.value }))}
                    placeholder="repo-name"
                    required
                  />
                  <Field
                    label="githubToken *"
                    hint="Nếu đã có config, chỉ cần nhập khi muốn đổi token"
                    value={intForm.githubToken}
                    onChange={(e) => setIntForm((p) => ({ ...p, githubToken: e.target.value }))}
                    placeholder="GitHub token"
                    required={!intConfig}
                  />
                  <div />

                  <div className="md:col-span-2 flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={intLoading}
                      className="rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
                    >
                      {intLoading ? "Saving..." : intConfig ? "Update config" : "Create config"}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {section === "Identity Mappings" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Identity mappings</h2>
                    <p className="text-sm text-slate-600">Map accountId to Jira/GitHub identities</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={mapAccountId}
                      onChange={(e) => setMapAccountId(e.target.value)}
                      placeholder="accountId"
                      className="w-full sm:w-72 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                    />
                    <button
                      onClick={loadMapping}
                      disabled={mapLoading}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition disabled:opacity-60"
                      type="button"
                    >
                      Load
                    </button>
                  </div>
                </div>

                {mapMessage ? (
                  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p className="text-sm text-slate-700 font-medium">{mapMessage}</p>
                  </div>
                ) : null}

                {mapData ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">Current mapping</div>
                    <div className="mt-2 text-sm text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div><span className="text-slate-500">Jira accountId:</span> {mapData.jiraAccountId || "-"}</div>
                      <div><span className="text-slate-500">Jira email:</span> {mapData.jiraEmail || "-"}</div>
                      <div><span className="text-slate-500">GitHub username:</span> {mapData.githubUsername || "-"}</div>
                      <div><span className="text-slate-500">GitHub email:</span> {mapData.githubEmail || "-"}</div>
                    </div>
                  </div>
                ) : null}

                <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={saveMapping}>
                  <Field
                    label="accountId *"
                    value={mapForm.accountId}
                    onChange={(e) => setMapForm((p) => ({ ...p, accountId: e.target.value }))}
                    placeholder="UUID"
                    required
                  />
                  <Field
                    label="jiraAccountId"
                    value={mapForm.jiraAccountId}
                    onChange={(e) => setMapForm((p) => ({ ...p, jiraAccountId: e.target.value }))}
                    placeholder="Jira accountId"
                  />
                  <Field
                    label="jiraEmail"
                    value={mapForm.jiraEmail}
                    onChange={(e) => setMapForm((p) => ({ ...p, jiraEmail: e.target.value }))}
                    placeholder="jira@email.com"
                  />
                  <Field
                    label="githubUsername"
                    value={mapForm.githubUsername}
                    onChange={(e) => setMapForm((p) => ({ ...p, githubUsername: e.target.value }))}
                    placeholder="octocat"
                  />
                  <Field
                    label="githubEmail"
                    value={mapForm.githubEmail}
                    onChange={(e) => setMapForm((p) => ({ ...p, githubEmail: e.target.value }))}
                    placeholder="github@email.com"
                  />
                  <div />

                  <div className="md:col-span-2 flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={mapLoading}
                      className="rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
                    >
                      {mapLoading ? "Saving..." : "Save mapping"}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            <div className="text-center text-xs text-slate-500 py-4">© {new Date().getFullYear()} SWP391 Admin Dashboard</div>
          </div>
        </main>
      </div>

      {/* Edit modal */}
      <Modal
        open={!!selectedAccount}
        title={`Edit account: ${selectedAccount?.username || ""}`}
        onClose={() => setSelectedAccount(null)}
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={saveEdit}>
          <Field
            label="Email"
            type="email"
            value={editPayload.email}
            onChange={(e) => setEditPayload((p) => ({ ...p, email: e.target.value }))}
            placeholder="email"
          />
          <Field
            label="Full name"
            value={editPayload.fullName}
            onChange={(e) => setEditPayload((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Full name"
          />
          <Field
            label="Phone"
            value={editPayload.phone}
            onChange={(e) => setEditPayload((p) => ({ ...p, phone: e.target.value }))}
            placeholder="Phone"
          />
          <Field
            label="Address"
            value={editPayload.address}
            onChange={(e) => setEditPayload((p) => ({ ...p, address: e.target.value }))}
            placeholder="Address"
          />

          <Select
            label="Active"
            value={editPayload.isActive ? "true" : "false"}
            onChange={(e) => setEditPayload((p) => ({ ...p, isActive: e.target.value === "true" }))}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
          <div />

          <div className="md:col-span-2 flex gap-3 pt-1">
            <button
              type="submit"
              disabled={editSaving}
              className="rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
            >
              {editSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedAccount(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Create lecturer modal */}
      <Modal open={createLectOpen} title="Create lecturer" onClose={() => setCreateLectOpen(false)}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={createLecturer}>
          <Field
            label="Username *"
            value={createLectPayload.username}
            onChange={(e) => setCreateLectPayload((p) => ({ ...p, username: e.target.value }))}
            placeholder="lecturer01"
            required
          />
          <Field
            label="Email *"
            type="email"
            value={createLectPayload.email}
            onChange={(e) => setCreateLectPayload((p) => ({ ...p, email: e.target.value }))}
            placeholder="lecturer@email.com"
            required
          />
          <Field
            label="Password *"
            type="password"
            value={createLectPayload.password}
            onChange={(e) => setCreateLectPayload((p) => ({ ...p, password: e.target.value }))}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
          <Field
            label="Full name"
            value={createLectPayload.fullName}
            onChange={(e) => setCreateLectPayload((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Full name"
          />
          <Field
            label="Phone"
            value={createLectPayload.phone}
            onChange={(e) => setCreateLectPayload((p) => ({ ...p, phone: e.target.value }))}
            placeholder="Phone"
          />
          <Field
            label="Address"
            value={createLectPayload.address}
            onChange={(e) => setCreateLectPayload((p) => ({ ...p, address: e.target.value }))}
            placeholder="Address"
          />

          <div className="md:col-span-2 flex gap-3 pt-1">
            <button
              type="submit"
              disabled={createLectSaving}
              className="rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
            >
              {createLectSaving ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setCreateLectOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
