// src/services/api.service.jsx
import axios from "./axios.customize";

// Helper: backend responses in this project are usually raw JSON (not wrapped)
const unwrap = (res) => res?.data?.data ?? res?.data;

//Login
export const userLoginApi = (username, password, loginType = "ADMIN") => {
    return axios.post("/api/v1/auth/login", {
        username,
        password,
        loginType,
    });
};

export const userLogoutApi = () => {
    // BE đọc token từ Authorization header
    return axios.post("/api/v1/auth/logout");
};

// ===================== Accounts =====================

// Public
export const registerStudentApi = (payload) => {
  return axios.post("/api/v1/accounts/register/student", payload).then(unwrap);
};

// Authenticated
export const getMeApi = () => axios.get("/api/v1/accounts/me").then(unwrap);
export const updateMeApi = (payload) =>
  axios.put("/api/v1/accounts/me", payload).then(unwrap);
export const changePasswordApi = (payload) =>
  axios.put("/api/v1/accounts/me/change-password", payload).then(unwrap);
export const deleteMeApi = () => axios.delete("/api/v1/accounts/me").then(unwrap);

// Admin
export const getAllAccountsApi = () => axios.get("/api/v1/accounts").then(unwrap);
export const getAccountByIdApi = (accountId) =>
  axios.get(`/api/v1/accounts/${accountId}`).then(unwrap);

export const getLecturersApi = (search) =>
  axios
    .get("/api/v1/accounts/lecturers", { params: search ? { search } : {} })
    .then(unwrap);

export const getStudentsApi = (search) =>
  axios
    .get("/api/v1/accounts/students", { params: search ? { search } : {} })
    .then(unwrap);

export const createLecturerApi = (payload) =>
  axios.post("/api/v1/accounts/lecturers", payload).then(unwrap);

export const adminUpdateAccountApi = (accountId, payload) =>
  axios.put(`/api/v1/accounts/${accountId}`, payload).then(unwrap);

export const adminDeleteAccountApi = (accountId) =>
  axios.delete(`/api/v1/accounts/${accountId}`).then(unwrap);

// ===================== Project Groups =====================
export const createProjectGroupApi = (payload) =>
  axios.post("/api/v1/project-groups", payload).then(unwrap);

// ===================== Integrations =====================
export const createIntegrationConfigApi = (payload) =>
  axios.post("/api/v1/integrations/configs", payload).then(unwrap);

export const updateIntegrationConfigApi = (groupId, payload) =>
  axios.put(`/api/v1/integrations/configs/${groupId}`, payload).then(unwrap);

export const getIntegrationConfigApi = (groupId) =>
  axios.get(`/api/v1/integrations/configs/${groupId}`).then(unwrap);

export const syncIntegrationApi = (groupId, payload) =>
  axios.post(`/api/v1/integrations/configs/${groupId}/sync`, payload).then(unwrap);

// ===================== Identity Mappings =====================
export const upsertIdentityMappingApi = (payload) =>
  axios.post("/api/v1/identity-mappings", payload).then(unwrap);

export const getIdentityMappingApi = (accountId) =>
  axios.get(`/api/v1/identity-mappings/${accountId}`).then(unwrap);
