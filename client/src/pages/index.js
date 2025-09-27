// client/src/pages/index.js

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Step 1: Check karo ki URL mein token hai ya nahi
    const { token } = router.query;

    if (token) {
      // Step 2: Agar token hai, toh usko localStorage mein save kar do
      localStorage.setItem("token", token);

      // Step 3: User ko profile page pe bhej do
      // Replace a true path to your profile page.
      // e.g. /profile, /dashboard, etc.
      router.replace("/create-profile");
    } else {
      // Agar token nahi hai, toh user ko login page pe bhej sakte ho
      // Ya yahan par landing page ka content dikha sakte ho
      router.replace("/LoginPage");
    }
  }, [router, router.query]);

  // Page load hote waqt ek loading message dikha sakte hain
  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );
}
