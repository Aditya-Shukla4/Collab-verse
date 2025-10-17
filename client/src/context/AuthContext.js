import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // This is the only function that should ever fetch the user's own profile.
  const fetchAndSetUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const { data } = await api.get("/users/me");

        // FIX: Ensure these arrays always exist
        const userData = {
          ...data,
          receivedCollabRequests: Array.isArray(data.receivedCollabRequests)
            ? data.receivedCollabRequests
            : [],
          projectInvites: Array.isArray(data.projectInvites)
            ? data.projectInvites
            : [],
          sentCollabRequests: Array.isArray(data.sentCollabRequests)
            ? data.sentCollabRequests
            : [],
          colleagues: Array.isArray(data.colleagues) ? data.colleagues : [],
        };

        setUser(userData);
        return userData;
      } catch (error) {
        console.error("Auth fetch failed:", error);
        logout();
      }
    }
    return null;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchAndSetUser();
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const loggedInUser = await fetchAndSetUser();
      if (
        loggedInUser &&
        (!loggedInUser.skills || loggedInUser.skills.length === 0)
      ) {
        router.push("/create-profile");
      } else {
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
      await fetchAndSetUser();
      router.push("/create-profile");
    } catch (error) {
      logout();
      throw error;
    }
  };

  const socialLogin = async (token) => {
    localStorage.setItem("token", token);
    const loggedInUser = await fetchAndSetUser();
    if (
      loggedInUser &&
      (!loggedInUser.skills || loggedInUser.skills.length === 0)
    ) {
      router.push("/create-profile");
    } else {
      router.push("/dashboard");
    }
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
    refetchUser: fetchAndSetUser, // We are using this reliable function again
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
