/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },

  // This is the new, built-in way to transpile packages.
  // The old 'next-transpile-modules' is no longer needed.
  transpilePackages: ["monaco-editor"],
};

export default nextConfig;
