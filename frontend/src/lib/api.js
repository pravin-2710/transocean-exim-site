import axios from "axios";

const backendUrl = document.querySelector('meta[name="backend-url"]')?.getAttribute("content")?.trim();

if (!backendUrl || backendUrl.includes("REACT_APP_BACKEND_URL")) {
  throw new Error("REACT_APP_BACKEND_URL is not configured.");
}

export const API = `${backendUrl.replace(/\/+$/, "")}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("te_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
