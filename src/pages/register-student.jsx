import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudentApi } from "../services/api.service";

export default function RegisterStudentPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      const res = await registerStudentApi(form);
      setSuccess(`Created student account: ${res?.username || form.username}`);
      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Register failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute -top-16 -right-24 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-24 left-10 w-72 h-72 bg-fuchsia-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Student Registration</h1>
          <p className="mt-1 text-slate-600">Create a new student account</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            {error ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-sm text-emerald-800 font-medium">{success}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Username *</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                  value={form.username}
                  onChange={(e) => setField("username", e.target.value)}
                  placeholder="e.g. student01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email *</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="student@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password *</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                  type="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="Nguyen Van A"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="090..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Address</label>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
