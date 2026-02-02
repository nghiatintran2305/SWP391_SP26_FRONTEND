import axios from "../../services/axios.customize";

// Jira cache APIs (User)
export const getMyJiraTasks = (groupId) =>
  axios.get("/api/v1/jira/issues/me", { params: { groupId } });
