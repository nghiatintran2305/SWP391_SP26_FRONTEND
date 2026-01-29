import axios from "axios";
import { getToken, logout } from "./auth";

const http = axios.create();

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) logout();
    return Promise.reject(err);
  }
);

export default http;
