import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMeApi, getMeApi, updateMeApi } from "../services/api.service";
import { logout } from "../utils/auth";
import { storage } from "../utils/storage";

function Field({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
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

export default function ProfilePage() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ email: "", fullName: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loginType = storage.get("loginType") || "USER";

  const headerTitle = useMemo(() => (loginType === "ADMIN" ? "Admin" : "User"), [loginType]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMeApi();
      setMe(data);
      setForm({
        email: data?.email || "",
        fullName: data?.fullName || "",
        phone: data?.phone || "",
        address: data?.address || "",
      });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = await updateMeApi(form);
      setMe(updated);
      setSuccess("Profile updated.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const ok = window.confirm("Delete your account? This action cannot be undone.");
    if (!ok) return;
    setError("");
    setSuccess("");
    try {
      await deleteMeApi();
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{headerTitle} Profile</h1>
            <p className="text-sm text-slate-600">Manage your account information</p>
          </div>
          <div className="flex items-center gap-2">
            {loginType === "ADMIN" ? (
              <button
                onClick={() => navigate("/admin")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                type="button"
              >
                Admin Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/home")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                type="button"
              >
                Home
              </button>
            )}

            <button
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                {(me?.fullName || me?.username || "U").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-slate-500">Signed in as</div>
                <div className="text-base font-semibold text-slate-900 truncate">
                  {me?.fullName || me?.username || ""}
                </div>
                <div className="text-xs text-slate-600 truncate">Role: {me?.role || ""}</div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Username</span>
                <span className="font-semibold text-slate-900 truncate">{me?.username || ""}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-900 truncate">{me?.email || ""}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Status</span>
                <span className={me?.active || me?.isActive ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
                  {me?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => navigate("/change-password")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition"
                type="button"
              >
                <div className="text-sm font-semibold text-slate-900">Change password</div>
                <div className="text-xs text-slate-500">Update your login credentials</div>
              </button>

              <button
                onClick={onDelete}
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left hover:bg-red-100 transition"
                type="button"
              >
                <div className="text-sm font-semibold text-red-700">Delete account</div>
                <div className="text-xs text-red-600">Soft delete your account</div>
              </button>
            </div>
          </div>

          {/* Edit form */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Account details</h2>
              <button
                onClick={refresh}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                type="button"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="mt-6 text-sm text-slate-600">Loading...</div>
            ) : (
              <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSave}>
                {error ? (
                  <div className="md:col-span-2 rounded-xl bg-red-50 border border-red-200 p-4">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                ) : null}

                {success ? (
                  <div className="md:col-span-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                    <p className="text-sm text-emerald-800 font-medium">{success}</p>
                  </div>
                ) : null}

                <Field label="Username" value={me?.username || ""} disabled />
                <Field label="Role" value={me?.role || ""} disabled />

                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="your@email.com"
                />
                <Field
                  label="Full name"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="Your full name"
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="090..."
                />
                <Field
                  label="Address"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Address"
                />

                <div className="md:col-span-2 flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-slate-900 text-white px-4 py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(loginType === "ADMIN" ? "/admin" : "/home")}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
