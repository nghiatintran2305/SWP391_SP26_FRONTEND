import axios from "../../services/axios.customize";

// Identity mapping APIs (User self-service)
export const getMyIdentity = () => axios.get("/api/v1/identity-mappings/me");
export const updateMyIdentity = (data) => axios.put("/api/v1/identity-mappings/me", data);
