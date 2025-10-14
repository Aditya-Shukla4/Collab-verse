// next.config.mjs
import transpileModules from "next-transpile-modules";

const withTM = transpileModules(["monaco-editor"]);

const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default withTM(nextConfig);
