import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../lib/http";
import { setToken } from "../lib/auth";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "admin1",
    password: "123456",
    loginType: "ADMIN"
  });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await http.post("/api/v1/auth/login", form);
      setToken(res.data.token);
      nav("/admin");
    } catch {
      setError("Login failed");
    }
  }

  return (
    <div className="auth">
      <form className="card" onSubmit={submit}>
        <h2>SWP391 Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.loginType}
          onChange={(e) => setForm({ ...form, loginType: e.target.value })}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>

        <button>Login</button>
      </form>
    </div>
  );
}