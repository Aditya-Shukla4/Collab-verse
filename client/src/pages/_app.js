import "@/styles/globals.css";
import { useRouter } from "next/router";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import Layout from "@/components/layout/Layout";
import PublicHeader from "@/components/layout/PublicHeader";

export default function App({ Component, pageProps }) {
  const router = useRouter();

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
          <>
            <PublicHeader />
            <Component {...pageProps} />
          </>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </SocketProvider>
    </AuthProvider>
  );
}
