return (
  <div className="auth">
    <div className="auth-card">
      <h2>SWP391 Admin</h2>
      <p>Sign in to manage projects</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submit}>
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

        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
);
