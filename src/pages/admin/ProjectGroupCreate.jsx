import { useEffect, useState } from "react";
import http from "../../lib/http";

export default function ProjectGroupCreate() {
  const [lecturers, setLecturers] = useState([]);
  const [form, setForm] = useState({
    groupName: "",
    semester: "Spring 2024",
    lecturerId: ""
  });

  useEffect(() => {
    http.get("/api/v1/accounts/lecturers")
      .then(res => {
        setLecturers(res.data);
        if (res.data.length)
          setForm(f => ({ ...f, lecturerId: res.data[0].id }));
      });
  }, []);

  function submit(e) {
    e.preventDefault();
    http.post("/api/v1/project-groups", form)
      .then(() => alert("Created"))
      .catch(() => alert("Failed"));
  }

  return (
    <form onSubmit={submit}>
      <h2>Create Project Group</h2>

      <input
        placeholder="Group Name"
        onChange={e => setForm({ ...form, groupName: e.target.value })}
      />

      <input
        placeholder="Semester"
        value={form.semester}
        onChange={e => setForm({ ...form, semester: e.target.value })}
      />

      <select
        value={form.lecturerId}
        onChange={e => setForm({ ...form, lecturerId: e.target.value })}
      >
        {lecturers.map(l => (
          <option key={l.id} value={l.id}>
            {l.fullName}
          </option>
        ))}
      </select>

      <button>Create</button>
    </form>
  );
}
