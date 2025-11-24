import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // your backend
  withCredentials: true, // 👈 sends cookies automatically
});

export default api;
