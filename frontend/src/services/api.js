import axios from "axios";

const LOCAL_API_URL = "http://localhost:5000/api";
const PRODUCTION_API_URL = "https://jobnest-backend-tssv.onrender.com/api";

// Vercel should set VITE_API_URL. The production fallback keeps deployed builds
// pointed at the Render API if the environment variable is missed.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PRODUCTION_API_URL : LOCAL_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem("jobnestUser");

  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      const token = parsedUser.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("jobnestUser");
    }
  }

  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn("Authentication failed - clearing user data");
      localStorage.removeItem("jobnestUser");
      // Optionally redirect to login
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
