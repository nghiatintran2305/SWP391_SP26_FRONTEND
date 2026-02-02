import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/Login.jsx";
import HomePage from "./pages/home.jsx";
import AdminPage from "./pages/admin.jsx";              // ✅ thêm dòng này
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import ProfilePage from "./pages/profile.jsx";
import ChangePasswordPage from "./pages/change-password.jsx";
import RegisterStudentPage from "./pages/register-student.jsx";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/register-student", element: <RegisterStudentPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/admin", element: <AdminPage /> },      // ✅ thêm route này
      { path: "/profile", element: <ProfilePage /> },
      { path: "/change-password", element: <ChangePasswordPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);