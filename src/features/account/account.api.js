
import axios from "../../services/axios.customize";

// Account APIs (Admin)
export const getAccounts = () => axios.get("/api/v1/accounts");
export const createLecturer = (data) => axios.post("/api/v1/accounts/lecturers", data);
export const updateAccount = (id, data) => axios.put(`/api/v1/accounts/${id}`, data);
export const deleteAccount = (id) => axios.delete(`/api/v1/accounts/${id}`);
