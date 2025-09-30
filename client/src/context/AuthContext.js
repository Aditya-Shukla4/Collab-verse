import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios"; // Our central API client

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const { data } = await api.get("/users/me");
          setUser(data);
        } catch (error) {
          console.error("Auth init failed:", error);
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const { data: loggedInUser } = await api.get("/users/me");
      setUser(loggedInUser);

      // --- THE NEW SMART REDIRECT LOGIC ---
      // Check if the user's profile is incomplete (e.g., no skills)
      if (loggedInUser.skills && loggedInUser.skills.length === 0) {
        // If incomplete, force redirect to create-profile
        router.push("/create-profile");
      } else {
        // If profile is complete, redirect to the dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      logout();
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data: newUser } = await api.get("/users/me");
      setUser(newUser);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const socialLogin = (token) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    api
      .get("/users/me")
      .then((response) => {
        const loggedInUser = response.data;
        setUser(loggedInUser);
        // Also check for social login
        if (loggedInUser.skills && loggedInUser.skills.length === 0) {
          router.push("/create-profile");
        } else {
          router.push("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Social login fetch failed", err);
        logout();
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/LoginPage");
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    socialLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
