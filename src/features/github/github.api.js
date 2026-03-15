import axios from "../../services/axios.customize";

// lấy URL để chuyển sang GitHub
export const getGithubAuthorizeUrl = () =>
  axios.get("/api/github/authorize-url");

// gọi callback BE sau khi FE nhận code từ GitHub
export const handleGithubCallback = (code) =>
  axios.get(`/api/github/callback?code=${encodeURIComponent(code)}`);

// API cũ
export const getMyCommits = (groupId) =>
  axios.get("/api/v1/github/commits/me", { params: { groupId } });