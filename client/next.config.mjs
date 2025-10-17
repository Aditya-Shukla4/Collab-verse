/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Webpack fallback for client-side packages
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },

  // Transpile external packages
  transpilePackages: ["monaco-editor"],

  // Add allowed external image domains
  images: {
    domains: [
      "i.pravatar.cc",
      "cdn-icons-png.flaticon.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      // agar aur hosts use hote hain toh add kar sakte ho
    ],
  },
};

export default nextConfig;
