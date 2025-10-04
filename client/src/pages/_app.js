import "@/styles/globals.css";
import { useRouter } from "next/router";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import Layout from "@/components/layout/Layout";
import PublicHeader from "@/components/layout/PublicHeader"; // We'll move PublicHeader to its own file

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // If the page component has its own `getLayout` function (like our Landing Page), use it.
  if (Component.getLayout) {
    return (
      <AuthProvider>
        <SocketProvider>
          {Component.getLayout(<Component {...pageProps} />)}
        </SocketProvider>
      </AuthProvider>
    );
  }

  const publicPages = ["/LoginPage", "/SignupPage"];

  return (
    <AuthProvider>
      <SocketProvider>
        {publicPages.includes(router.pathname) ? (
          // Layout for public pages like Login/Signup
          <>
            <PublicHeader />
            <Component {...pageProps} />
          </>
        ) : (
          // Main app layout for all authenticated pages
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </SocketProvider>
    </AuthProvider>
  );
}
