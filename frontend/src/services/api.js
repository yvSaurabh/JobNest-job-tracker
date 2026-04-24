import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
