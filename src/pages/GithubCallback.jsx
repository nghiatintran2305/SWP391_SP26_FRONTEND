//GitCallBack
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleGithubCallback } from "../features/github/github.api";

export default function GithubCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Đang kết nối GitHub...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) {
      setMessage("Thiếu code từ GitHub.");
      return;
    }

    if (state && state !== "github") {
      setMessage("State không hợp lệ.");
      return;
    }

    handleGithubCallback(code)
      .then(() => {
        setMessage("Kết nối GitHub thành công.");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setMessage(
          err?.response?.data?.message || "Kết nối GitHub thất bại."
        );
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        <h1 className="text-xl font-bold text-slate-900">GitHub Integration</h1>
        <p className="mt-3 text-slate-600">{message}</p>
      </div>
    </div>
  );
}