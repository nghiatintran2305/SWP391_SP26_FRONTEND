import axios from "../../services/axios.customize";

// Project Group APIs (User)
export const getMyGroups = () => axios.get("/api/v1/project-groups/me");
