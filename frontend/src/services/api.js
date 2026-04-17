import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem("jobnestUser");

  if (savedUser) {
    try {
      const token = JSON.parse(savedUser).token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("jobnestUser");
    }
  }

  return config;
});

export default api;
