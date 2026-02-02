import axios from "../../services/axios.customize";

// GitHub cache APIs (User)
export const getMyCommits = (groupId) =>
  axios.get("/api/v1/github/commits/me", { params: { groupId } });
