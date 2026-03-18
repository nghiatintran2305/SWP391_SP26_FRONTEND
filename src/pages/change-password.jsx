import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../services/api.service";
import { logout } from "../utils/auth";
//changepass
export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Confirm password does not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await changePasswordApi({ oldPassword, newPassword, confirmPassword });
      setSuccess(res?.message || "Password changed successfully. Please login again.");

      // After change password, force re-login
      logout();
      setTimeout(() => navigate("/", { replace: true }), 400);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Change password failed.";
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

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="text-slate-700"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L3 6.5V17.5L12 22L21 17.5V6.5L12 2Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V12.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M21 6.5L12 12.2L3 6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Change Password</h1>
          <p className="mt-1 text-slate-600">Update your password to continue</p>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Old password</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">New password</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirm new password</label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {loading ? "Saving..." : "Change password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              Back to profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
