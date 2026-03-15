
import { Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";

export default function AdminRoutes() {
  return (
    <Route path="/admin" element={<AdminDashboard />} />
  );
}
