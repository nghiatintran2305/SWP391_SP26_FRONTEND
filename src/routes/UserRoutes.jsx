// src/routes/UserRoutes.jsx
import { Route } from "react-router-dom";
import UserDashboard from "../pages/UserDashboard";
import MyGroups from "../pages/MyGroups";
import MyTasks from "../pages/MyTasks";
import MyCommits from "../pages/MyCommits";

export default function UserRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/groups" element={<MyGroups />} />
      <Route path="/tasks" element={<MyTasks />} />
      <Route path="/commits" element={<MyCommits />} />
    </>
  );
}
