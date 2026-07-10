import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://url-shortener-dashboard-backend.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});
