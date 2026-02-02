// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLoginApi } from "../services/api.service";
import { storage } from "../utils/storage";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // clear old session
    storage.remove("token");
    storage.remove("isLoggedIn");
    storage.remove("requiresPasswordChange");

    try {
      // login (NO loginType)
      const res = await userLoginApi(username, password);
      const payload = res?.data?.data ?? res?.data ?? {};
      const token = payload?.token;

      if (!token || typeof token !== "string") {
        setError("Invalid token received from server!");
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        console.error("JWT decode error:", err);
        setError("Invalid token format!");
        return;
      }

      const requiresPasswordChange =
        payload?.requiresPasswordChange ??
        decoded?.requiresPasswordChange ??
        false;

      // save session
      storage.set("token", token);
      storage.set("isLoggedIn", true);
      storage.set("requiresPasswordChange", !!requiresPasswordChange);

      storage.set("userEmail", decoded?.sub || "");
      storage.set("id", decoded?.id || decoded?.userId || "");
      storage.set("userName", decoded?.name || "");
      storage.set("userPhone", decoded?.phone || "");

      if (requiresPasswordChange) {
        navigate("/change-password", { replace: true });
        return;
      }

      // ROLE-BASED redirect (chuẩn RBAC)
      const roles = decoded?.roles || payload?.roles || [];
      if (roles.includes("ADMIN")) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/groups", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err?.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.errorCode ||
            "Login failed!"
        );
      } else if (err?.request) {
        setError("Cannot connect to server. Please try again later!");
      } else {
        setError("Unexpected error!");
      }
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
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="text-slate-700"
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
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            SWP391 System
          </h1>
          <p className="mt-1 text-slate-600">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-slate-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 text-slate-400"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/register-student")}
                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                Create a student account
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              © {new Date().getFullYear()} SWP391
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
