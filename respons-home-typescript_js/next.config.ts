import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output bundles everything needed to run without node_modules
  // This is the recommended mode for cPanel / VPS deployments
  output: "standalone",

  // Disable the "Powered by Next.js" header in responses
  poweredByHeader: false,

  // Compress responses (useful if your host doesn't do it at the proxy level)
  compress: true,
};

export default nextConfig;
