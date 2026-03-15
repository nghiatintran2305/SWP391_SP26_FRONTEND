import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GithubIntegrationPage() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGithubUser();
  }, []);

  const fetchGithubUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/github/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRepos = async () => {
    const res = await axios.get("http://localhost:8080/api/github/repos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRepos(res.data);
  };

  const fetchCommits = async (repoName) => {
    const res = await axios.get(
      `http://localhost:8080/api/github/commits?repo=${repoName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCommits(res.data);
  };

  return (
    <div className="container mt-4">
      <h2>GitHub Integration</h2>

      {user ? (
        <div className="card p-3">
          <h5>{user.login}</h5>
          <p>{user.email}</p>
          <button onClick={fetchRepos} className="btn btn-primary">
            Load Repositories
          </button>
        </div>
      ) : (
        <a
          href="http://localhost:8080/api/github/link"
          className="btn btn-dark"
        >
          Link GitHub Account
        </a>
      )}

      <div className="mt-4">
        <h4>Repositories</h4>
        {repos.map((repo) => (
          <div key={repo.id} className="border p-2 mb-2">
            {repo.name}
            <button
              className="btn btn-sm btn-success ms-2"
              onClick={() => fetchCommits(repo.name)}
            >
              View Commits
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h4>Commits</h4>
        {commits.map((commit, index) => (
          <div key={index} className="border p-2 mb-2">
            <strong>{commit.message}</strong>
            <br />
            {commit.author}
          </div>
        ))}
      </div>
    </div>
  );
}
