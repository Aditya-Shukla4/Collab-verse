import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

// This page is a middleman. Its only job is to catch the token from the URL
// after a social login (like GitHub) and pass it to our main authentication system.
export default function AuthCallback() {
  const router = useRouter();
  // We get the 'login' function from our central AuthContext.
  const { login } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Check if the router is ready and has the token in the URL.
      if (router.isReady && router.query.token) {
        const token = router.query.token;

        try {
          // 2. Call the central login function. This function (in AuthContext)
          // will save the token, set the Authorization header for all future
          // requests, fetch the user profile, and update the global state.
          await login(token);

          // 3. Once the user is logged in, send them to the create profile page.
          // --- THIS IS THE FIX FOR YOUR REDIRECT REQUEST ---
          router.push("/create-profile");
        } catch (error) {
          console.error("Authentication callback failed:", error);
          // If something goes wrong, send them back to the login page.
          router.push("/LoginPage?error=auth_failed");
        }
      }
    };

    handleAuth();
  }, [router.isReady, router.query, login, router]); // Effect dependencies

  // Show a simple loading message to the user while we work.
  return (
    <div className="flex justify-center items-center h-screen text-white bg-gray-900">
      <p className="text-xl">Authenticating, please wait...</p>
    </div>
  );
}
