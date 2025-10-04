import axios from "axios";

// Ek naya axios instance banaya
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", // Saare requests ke liye base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Yeh hai MAGIC ✨ (Interceptor)
// Yeh function har request ke bheje jaane se PEHLE chalega
api.interceptors.request.use(
  (config) => {
    // localStorage se token nikaalo
    const token = localStorage.getItem("token");
    if (token) {
      // Agar token hai, toh har request ke header mein automatically laga do
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Request bhejte waqt koi error aaye toh yahan handle hoga
    return Promise.reject(error);
  }
);

export default api;
