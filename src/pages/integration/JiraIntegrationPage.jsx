import React, { useState } from "react";
import axios from "axios";

export default function JiraIntegrationPage() {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:8080/api/jira/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(res.data);
  };

  const fetchIssues = async (projectKey) => {
    const res = await axios.get(
      `http://localhost:8080/api/jira/issues?project=${projectKey}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIssues(res.data);
  };

  return (
    <div className="container mt-4">
      <h2>Jira Integration</h2>

      <a
        href="http://localhost:8080/api/jira/link"
        className="btn btn-warning"
      >
        Link Jira Account
      </a>

      <button className="btn btn-primary ms-2" onClick={fetchProjects}>
        Load Projects
      </button>

      <div className="mt-4">
        <h4>Projects</h4>
        {projects.map((p) => (
          <div key={p.id} className="border p-2">
            {p.name}
            <button
              className="btn btn-sm btn-success ms-2"
              onClick={() => fetchIssues(p.key)}
            >
              View Issues
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4>Issues</h4>
        {issues.map((i) => (
          <div key={i.id} className="border p-2">
            <strong>{i.key}</strong> - {i.summary}
          </div>
        ))}
      </div>
    </div>
  );
}
