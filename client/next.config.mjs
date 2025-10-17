/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },

  // This is the new, built-in way to transpile packages.
  transpilePackages: ["monaco-editor"],

  // 💥 FIX IS HERE: Hum Next.js ko bata rahe hain ki in websites se photo aane de 💥
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**", // Allow any path on this domain
      },
      // Aage jaakar GitHub avatars bhi use karega, isliye isko bhi add kar le
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      // 💥 NAYA WALA HOSTNAME ADD KAR DIYA HAI 💥
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
