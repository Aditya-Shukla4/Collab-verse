import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  // ! Use of social login
  const { socialLogin } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      if (router.isReady && router.query.token) {
        const token = router.query.token;

        try {
          await socialLogin(token);
        } catch (error) {
          console.error("Authentication callback failed:", error);
          router.push("/LoginPage?error=auth_failed");
        }
      }
    };

    handleAuth();
  }, [router.isReady, router.query, socialLogin, router]);

  return (
    <div className="flex justify-center items-center h-screen text-white bg-gray-900">
      <p className="text-xl">Authenticating, please wait...</p>
    </div>
  );
}
