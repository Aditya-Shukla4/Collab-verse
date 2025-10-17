import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Disable caching
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Request Interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log(
      `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle responses
api.interceptors.response.use(
  (response) => {
    console.log(
      `📥 API Response: ${response.status} - ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data
    );

    // If 401 Unauthorized, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/LoginPage";
    }

    return Promise.reject(error);
  }
);

export default api;
