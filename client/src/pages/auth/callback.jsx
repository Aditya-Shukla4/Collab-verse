// src/pages/auth/callback.jsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { token } = router.query;

      if (token) {
        // 1. Save the token
        localStorage.setItem("token", token);

        try {
          // 2. Use the token to fetch the user's own profile
          const response = await axios.get(
            "http://localhost:5000/api/users/me",
            {
              headers: {
                "x-auth-token": token,
              },
            }
          );
          const user = response.data;

          // 3. Check if the profile is complete (e.g., if skills are filled out)
          if (user.skills && user.skills.length > 0) {
            // If profile is complete, send to dashboard
            router.push("/dashboard");
          } else {
            // If profile is incomplete, send to create-profile page
            router.push("/create-profile");
          }
        } catch (error) {
          console.error("Failed to fetch user profile after auth:", error);
          // If something goes wrong, send to login
          router.push("/LoginPage");
        }
      } else {
        // If no token is found in URL, send to login
        router.push("/LoginPage");
      }
    };

    // Make sure router.query is populated before running
    if (router.isReady) {
      handleAuth();
    }
  }, [router.isReady, router.query, router]);

  return (
    <div className="text-white text-center p-10">
      Authenticating... Please wait.
    </div>
  );
}
